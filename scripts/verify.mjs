// Offline QA over ./dist : links/assets resolve, SEO basics, forms wired to Formspree, JSON-LD parses, no placeholder text.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
const DIST = 'dist';
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const html = walk(DIST).filter((f) => f.endsWith('.html'));
const exists = (u) => { const p = u.split('#')[0].split('?')[0]; if (!p || p === '/') return true; const b = join(DIST, p); return (existsSync(b) && statSync(b).isFile()) || existsSync(join(b, 'index.html')); };
const errs = [], warns = [];
for (const f of html) {
  const s = readFileSync(f, 'utf8'); const rel = '/' + relative(DIST, f); const idx = !/noindex/.test(s);
  for (const m of s.matchAll(/(?:href|src)="(\/[^"]*)"/g)) if (!m[1].startsWith('//') && !exists(m[1])) errs.push(`${rel}: broken ${m[1]}`);
  if (idx) {
    if (!/<title>[^<]{10,}<\/title>/.test(s)) errs.push(`${rel}: title`);
    if (!/<meta name="description" content="[^"]{30,}/.test(s)) errs.push(`${rel}: description`);
    if (!/<link rel="canonical"/.test(s)) errs.push(`${rel}: canonical`);
  }
  if ((s.match(/<h1[ >]/g) || []).length !== 1) errs.push(`${rel}: h1 count`);
  if (/lorem ipsum|TODO|undefined|\[object/i.test(s) || /\bNaN\b/.test(s)) errs.push(`${rel}: placeholder text`);
  for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { errs.push(`${rel}: bad JSON-LD`); } }
  for (const m of s.matchAll(/<form [^>]*>/g)) { if (/class="sx__form"/.test(m[0])) continue; if (!/data-formspree/.test(m[0]) || !/action="https:\/\/formspree\.io\/f\/mpqvnlnb"/.test(m[0]) || !/name="[^"]+"/.test(m[0])) errs.push(`${rel}: form not wired to Formspree`); }
  /* content guards: no address, one phone number, one email, only our Calendly links */
  if (/Saptari|Saptakoshi|Madhesh|streetAddress|postalCode/i.test(s)) errs.push(`${rel}: postal address text found (addresses must not appear anywhere)`);
  for (const m of s.matchAll(/(?:\+|%2B)?977[\s-]?\d[\d\s-]{8,12}\d/g)) if (m[0].replace(/\D/g, '') !== '9779768553322') errs.push(`${rel}: unexpected phone number ${m[0]}`);
  for (const m of s.matchAll(/tel:([^"'\s>]+)/g)) if (m[1].replace(/\D/g, '') !== '9779768553322') errs.push(`${rel}: unexpected tel: link ${m[1]}`);
  for (const m of s.matchAll(/wa\.me\/(\d+)/g)) if (m[1] !== '9779768553322') errs.push(`${rel}: unexpected WhatsApp number ${m[1]}`);
  for (const m of s.matchAll(/[\w.+-]+@nexa\.com\.np/g)) if (m[0].toLowerCase() !== 'info@nexa.com.np') errs.push(`${rel}: unexpected email ${m[0]}`);
  for (const m of s.matchAll(/https:\/\/calendly\.com\/[^"'\s<>)]+/g)) if (!/^https:\/\/calendly\.com\/(nexaadvisoryconsulting\/(physical-meeting|group|30min)|privacy)$/.test(m[0])) errs.push(`${rel}: unexpected Calendly link ${m[0]}`);
  if (/\/blog\/index\.html$/.test(rel) && !/http-equiv="refresh"[^>]*blog\.nexa\.com\.np/.test(s)) errs.push(`${rel}: blog redirect page does not point to blog.nexa.com.np`);
  if (/href="\/blog(\/|")/.test(s) && !/\/blog\/index\.html$/.test(rel)) errs.push(`${rel}: internal /blog link (use the external blog URL)`);
  if (/data-netlify|netlify-honeypot/.test(s)) errs.push(`${rel}: leftover Netlify form attributes`);
  if (/class="phero"|class="phero /.test(s) && !/class="phero__media/.test(s)) errs.push(`${rel}: page hero has no image slot`);
  if (!/data-open-search/.test(s) || !/id="sx"/.test(s)) errs.push(`${rel}: site search missing`);
  for (const [, t] of s.matchAll(/data-filter="#([^"]+)"/g)) if (!new RegExp(`id="${t}"`).test(s)) errs.push(`${rel}: filter target #${t} missing`);
  for (const u of ['instagram.com/nexa.advisory.consulting', 'facebook.com/nexaadvisoryandconsulting', 'linkedin.com/company/nexa-advisory-and-consulting', 'x.com/nexaadvisory_np', 'wa.me/9779768553322']) if (!s.includes(u)) errs.push(`${rel}: footer/social link missing: ${u}`);
  if (/<form class="form"/.test(s) && !/name="form_name"/.test(s)) errs.push(`${rel}: missing form_name`);
  if (/<form class="form"/.test(s) && !/name="_gotcha"/.test(s)) errs.push(`${rel}: missing spam honeypot`);
  if (/supabase|service_role/i.test(s)) errs.push(`${rel}: backend reference`);
  if (!/<footer class="nf">/.test(s)) errs.push(`${rel}: footer missing`);
  if (!/class="hx-ctaw"/.test(s) && !/careers\/apply\//.test(rel)) errs.push(`${rel}: CTA band missing`);
  if (/Ltd\.\./.test(s) || /\.\.\s*All rights/.test(s)) errs.push(`${rel}: double period in footer`);
  if (/<a [^>]*href="\/\/?"[^>]*><\/a>/.test(s)) errs.push(`${rel}: empty link`);
  if (/stored securely in our database|private bucket/i.test(s)) errs.push(`${rel}: outdated storage wording`);
  const ids = [...s.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]); const dup = ids.filter((x, i) => ids.indexOf(x) !== i); if (dup.length) warns.push(`${rel}: duplicate ids ${[...new Set(dup)]}`);
}
const sm = readFileSync(join(DIST, 'sitemap.xml'), 'utf8'); const locs = [...sm.matchAll(/<loc>([^<]+)/g)].map((m) => m[1].replace('https://www.nexa.com.np', '') || '/');
for (const l of locs) if (!exists(l)) errs.push(`sitemap: ${l} missing`);
for (const r of ['/', '/services', '/industries', '/why-nexa', '/about', '/outsourcing', '/book', '/careers', '/faqs', '/contact', '/privacy-policy', '/terms-of-use', '/disclaimer', '/cookie-policy']) if (!locs.includes(r)) errs.push(`required route missing: ${r}`);
const book = readFileSync(join(DIST, 'book', 'index.html'), 'utf8');
for (const u of ['physical-meeting', 'group', '30min']) if (!book.includes(`https://calendly.com/nexaadvisoryconsulting/${u}`)) errs.push(`book: Calendly link missing: ${u}`);
if (!/id="cal-frame"/.test(book) || !/data-meet="one-on-one"/.test(book)) errs.push('book: calendar panel or meeting picker missing');
if (/<iframe/.test(book)) errs.push('book: iframe must be created on demand, not rendered up front');
const home = readFileSync(join(DIST, 'index.html'), 'utf8');
if (!/data-wiz/.test(home) || !/class="meetq"/.test(home)) errs.push('home: wizard or booking strip missing');
try { const si = JSON.parse(readFileSync(join(DIST, 'assets', 'search-index.json'), 'utf8')); if (!Array.isArray(si) || si.length < 40) errs.push('search index too small'); for (const e of si) { if (!/^https:\/\//.test(e.u) && !exists(e.u)) errs.push(`search index: broken target ${e.u}`); } } catch (e) { errs.push('search index missing or invalid: ' + e.message); }
if (!/class="hx-stats/.test(home)) errs.push('home: hero statistics missing');
if (!/id="hxttrk"/.test(home) || (home.match(/class="hx-tcard"/g) || []).length < 3) errs.push('home: testimonials carousel missing or too short');
if (/hx-tnote/.test(home)) warns.push('home: testimonials are still marked as SAMPLES (src/content/social-proof.mjs). Replace with verified quotes, then set testimonialsAreSamples = false.');
if (existsSync(join(DIST, 'admin'))) errs.push('admin folder still present');
console.log(`Checked ${html.length} HTML files, ${locs.length} sitemap URLs.`); warns.forEach((w) => console.log('WARN', w)); errs.forEach((e) => console.log('FAIL', e));
if (errs.length) { console.log(`\n${errs.length} problem(s).`); process.exit(1); } else console.log('All checks passed.');
