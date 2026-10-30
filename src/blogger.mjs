// Latest posts from the Blogger blog (blog.nexa.com.np), fetched at BUILD time.
// - Never fails the build: if the blog is unreachable or the feed is odd, it returns [] and the site shows a plain "Visit our blog" card.
// - Feed content is untrusted: links must stay on the blog's own host, images must be https, all text is escaped by the caller.
// - Posts refresh whenever the site is rebuilt (push a commit, or trigger a Netlify build hook / scheduled build).

const strip = (h) => String(h || '').replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, ' ').replace(/<\/?(p|div|br|li|ul|ol|h[1-6]|tr|td|blockquote|section|article)\b[^>]*>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, '’').replace(/\s+/g, ' ').trim();
const clip = (t, n) => (t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t);

export function parseBloggerFeed(json, blogUrl, max = 3) {
  const host = new URL(blogUrl).host;
  const entries = (json && json.feed && Array.isArray(json.feed.entry)) ? json.feed.entry : [];
  const out = [];
  for (const e of entries) {
    try {
      const alt = (e.link || []).find((l) => l.rel === 'alternate' && l.href);
      if (!alt) continue;
      const u = new URL(alt.href);
      if (u.protocol !== 'https:' && u.protocol !== 'http:') continue;
      if (u.host !== host) continue; // only link to our own blog
      const title = strip(e.title && e.title.$t);
      if (!title) continue;
      const body = strip((e.summary && e.summary.$t) || (e.content && e.content.$t) || '');
      let img = e['media$thumbnail'] && e['media$thumbnail'].url ? String(e['media$thumbnail'].url) : '';
      if (img) { try { const iu = new URL(img.replace(/^http:/, 'https:')); img = iu.protocol === 'https:' ? iu.href.replace(/\/s\d+(-c)?\//, '/w640-h400-c/') : ''; } catch { img = ''; } }
      const date = String((e.published && e.published.$t) || '').slice(0, 10);
      out.push({ title: clip(title, 110), url: `https://${host}${u.pathname}${u.search}`, excerpt: clip(body, 150), date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '', cat: (e.category && e.category[0] && e.category[0].term) ? clip(strip(e.category[0].term), 28) : '', img });
      if (out.length >= max) break;
    } catch { /* skip malformed entry */ }
  }
  return out;
}

export async function latestPosts(blogUrl, max = 3) {
  try {
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 9000);
    const res = await fetch(`${blogUrl}/feeds/posts/default?alt=json&max-results=${max}`, { signal: ctrl.signal, headers: { accept: 'application/json' } });
    clearTimeout(t);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = parseBloggerFeed(await res.json(), blogUrl, max);
    console.log(`Blogger: ${posts.length} latest post(s) loaded from ${blogUrl}`);
    return posts;
  } catch (err) {
    console.warn(`WARN Blogger feed not loaded (${err.message}). The home page will show a "Visit our blog" card instead. Check that ${blogUrl}/feeds/posts/default works.`);
    return [];
  }
}
