(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const hdr = $('#hdr'), nav = $('#nav'), burger = $('#burger'), progress = $('#progress'), totop = $('#totop');

  /* Scroll state + progress bar */
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    hdr.classList.toggle('is-scrolled', y > 24);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    ticking = false;
  };
  onScroll();
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
  totop && totop.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0 }); });

  /* Mobile drawer */
  const setNav = (open) => {
    nav.classList.toggle('is-open', open); hdr.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-lock', open);
  };
  burger && burger.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  window.matchMedia('(min-width:1141px)').addEventListener('change', (e) => { if (e.matches) { setNav(false); closeAll(); } });

  /* Mega menus & dropdowns (click/touch/keyboard; hover handled in CSS) */
  const panels = () => $$('.mega, .dd');
  const closeAll = (except) => {
    $$('.nl-t[aria-expanded="true"]').forEach((b) => { if (b !== except) { b.setAttribute('aria-expanded', 'false'); const p = document.getElementById(b.getAttribute('aria-controls')); p && p.classList.remove('is-open'); } });
  };
  $$('.nl-t').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const p = document.getElementById(b.getAttribute('aria-controls')); const open = b.getAttribute('aria-expanded') !== 'true';
    closeAll(b); b.setAttribute('aria-expanded', open); p.classList.toggle('is-open', open);
  }));
  document.addEventListener('click', (e) => { if (!e.target.closest('.has-mega, .has-dd')) closeAll(); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = $('.nl-t[aria-expanded="true"]');
    if (open) { closeAll(); open.focus(); }
    else if (nav.classList.contains('is-open')) { setNav(false); burger.focus(); }
    if (document.activeElement && document.activeElement.blur && !open) { /* keep focus */ }
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a') && nav.classList.contains('is-open')) setNav(false); });

  /* Reveal on scroll */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal, .hx-r').forEach((el) => io.observe(el));
  } else $$('.reveal, .hx-r').forEach((el) => el.classList.add('in'));


  /* Home: process timeline, hero parallax, engagement-model carousel */
  const rm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const tl = $('#hxtl');
  if (tl) { if ('IntersectionObserver' in window) { const o = new IntersectionObserver((e) => { if (e[0].isIntersecting) { tl.classList.add('in'); o.disconnect(); } }, { threshold: 0.3 }); o.observe(tl); } else tl.classList.add('in'); }
  const bg = $('#hxbg');
  if (bg && !rm) window.addEventListener('scroll', () => { const y = window.scrollY; if (y < 900) bg.style.transform = 'translate3d(0,' + y * 0.15 + 'px,0)'; }, { passive: true });
  const tr = $('#hxtrk');
  if (tr) {
    const pv = $('#hxprev'), nx = $('#hxnext'), ct = $('#hxcnt');
    const step = () => tr.children[0].offsetWidth + 20;
    const upd = () => { ct.textContent = (Math.round(tr.scrollLeft / step()) + 1) + ' / ' + tr.children.length; pv.disabled = tr.scrollLeft < 4; nx.disabled = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4; };
    pv.addEventListener('click', () => tr.scrollBy({ left: -step(), behavior: rm ? 'auto' : 'smooth' }));
    nx.addEventListener('click', () => tr.scrollBy({ left: step(), behavior: rm ? 'auto' : 'smooth' }));
    tr.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true });
    tr.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') nx.click(); if (e.key === 'ArrowLeft') pv.click(); });
    window.addEventListener('resize', upd); upd();
  }

  /* Hero statistics: count up once when visible (final value is already in the HTML, so no-JS and reduced-motion see it) */
  const counters = $$('[data-count]');
  if (counters.length && !rm && 'IntersectionObserver' in window) {
    const run = (el) => {
      const end = parseInt(el.dataset.count, 10), suf = el.dataset.suffix || '', t0 = performance.now(), dur = 1400;
      if (!(end > 0)) return;
      const tick = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(end * e) + suf; if (k < 1) requestAnimationFrame(tick); };
      el.textContent = '0' + suf; requestAnimationFrame(tick);
    };
    const co = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } }), { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }

  /* Testimonials carousel: scroll-snap track + arrows + dots + optional autoplay (paused on hover/focus, off for reduced motion) */
  const tt = $('#hxttrk');
  if (tt && tt.children.length) {
    const slides = Array.from(tt.children), dotsEl = $('#hxtdots'), pv = $('#hxtprev'), nx = $('#hxtnext'), pp = $('#hxtplay'), live = $('#hxtlive');
    const PAUSE = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
    const PLAY = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.500z"/></svg>';
    let page = 0, timer = null, userPaused = false, hovering = false;
    const step = () => (slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : slides[0].offsetWidth);
    const per = () => Math.max(1, Math.round(tt.clientWidth / step()));
    const pages = () => Math.max(1, Math.ceil(slides.length / per()));
    const maxLeft = () => tt.scrollWidth - tt.clientWidth;
    const buildDots = () => {
      dotsEl.innerHTML = '';
      for (let i = 0; i < pages(); i++) {
        const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Show testimonials ' + (i + 1) + ' of ' + pages());
        b.addEventListener('click', () => { goTo(i); userStop(); }); dotsEl.appendChild(b);
      }
    };
    const mark = () => {
      const n = pages(); const left = tt.scrollLeft;
      page = left >= maxLeft() - 4 ? n - 1 : Math.min(n - 1, Math.round(left / (per() * step())));
      Array.from(dotsEl.children).forEach((b, i) => { if (i === page) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      pv.disabled = false; nx.disabled = false;
      const a = page * per() + 1, z = Math.min(slides.length, (page + 1) * per());
      live.textContent = timer ? '' : 'Showing testimonials ' + a + (z > a ? ' to ' + z : '') + ' of ' + slides.length;
    };
    const goTo = (i) => { const n = pages(); const t = ((i % n) + n) % n; tt.scrollTo({ left: t >= n - 1 ? maxLeft() : t * per() * step(), behavior: rm ? 'auto' : 'smooth' }); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const start = () => { if (rm || userPaused || hovering || timer || pages() < 2) return; timer = setInterval(() => { if (!document.hidden) goTo(page + 1); }, 7000); };
    const userStop = () => { userPaused = true; stop(); syncBtn(); };
    const syncBtn = () => { if (!pp) return; const paused = userPaused; pp.innerHTML = paused ? PLAY : PAUSE; pp.setAttribute('aria-pressed', String(paused)); pp.setAttribute('aria-label', paused ? 'Start automatic rotation' : 'Pause automatic rotation'); };
    pv.addEventListener('click', () => { goTo(page - 1); userStop(); });
    nx.addEventListener('click', () => { goTo(page + 1); userStop(); });
    if (pp) { if (rm) pp.hidden = true; else pp.addEventListener('click', () => { userPaused = !userPaused; if (userPaused) stop(); else start(); syncBtn(); }); }
    tt.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); goTo(page + 1); userStop(); } if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(page - 1); userStop(); } });
    tt.addEventListener('scroll', () => requestAnimationFrame(mark), { passive: true });
    tt.addEventListener('touchstart', userStop, { passive: true });
    const box = tt.closest('.hx-tcar');
    box.addEventListener('mouseenter', () => { hovering = true; stop(); }); box.addEventListener('mouseleave', () => { hovering = false; start(); });
    box.addEventListener('focusin', () => { hovering = true; stop(); }); box.addEventListener('focusout', () => { hovering = false; start(); });
    let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { buildDots(); mark(); }, 150); });
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { if (es[0].isIntersecting) start(); else stop(); }, { threshold: 0.3 }).observe(tt);
    buildDots(); syncBtn(); mark();
  }

  /* On-this-page highlighting */
  const tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(tocLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const so = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { tocLinks.forEach((a) => a.classList.remove('on')); map.get(e.target.id)?.classList.add('on'); } }), { rootMargin: '-20% 0px -70% 0px' });
    map.forEach((_, id) => { const el = document.getElementById(id); el && so.observe(el); });
  }

  /* Careers: hide vacancies past their deadline (until next deploy removes them) */
  const jobs = $('#jobs');
  if (jobs) {
    const today = new Date().toISOString().slice(0, 10);
    $$('[data-deadline]', jobs).forEach((j) => { if (j.dataset.deadline && j.dataset.deadline < today) j.remove(); });
    if (!$('.job', jobs)) { const e = $('#no-jobs'); e && (e.hidden = false); }
  }

  /* On-page search + filter: any [data-filter="#target"] toolbar filters [data-fitem] cards (optionally grouped in [data-fgroup]) */
  $$('[data-filter]').forEach((bar) => {
    const target = $(bar.dataset.filter); if (!target) return;
    const items = $$('[data-fitem]', target), groups = $$('[data-fgroup]', target), none = $('[data-fnone]', target);
    const input = $('[data-fsearch]', bar), chips = $$('[data-fcat]', bar), count = $('[data-fcount]', bar);
    const noun = (count && count.dataset.noun) || 'results';
    let q = '', cat = '';
    const apply = () => {
      const toks = q.toLowerCase().split(/\s+/).filter(Boolean); let n = 0;
      items.forEach((it) => {
        const ok = (!cat || it.dataset.cat === cat) && toks.every((t) => it.dataset.text.includes(t));
        it.hidden = !ok; if (ok) n++;
        if (it.tagName === 'DETAILS') { if (ok && toks.length) { if (!it.open) { it.open = true; it.dataset.auto = '1'; } } else if (it.dataset.auto) { it.open = false; delete it.dataset.auto; } }
      });
      groups.forEach((g) => { g.hidden = !$('[data-fitem]:not([hidden])', g); });
      if (none) none.hidden = n > 0;
      if (count) count.textContent = q || cat ? 'Showing ' + n + ' of ' + items.length + ' ' + noun : items.length + ' ' + noun;
    };
    const ex = $('[data-fexpand]', bar), co = $('[data-fcollapse]', bar);
    ex && ex.addEventListener('click', () => items.forEach((it) => { if (!it.hidden && it.tagName === 'DETAILS') { it.open = true; delete it.dataset.auto; } }));
    co && co.addEventListener('click', () => items.forEach((it) => { if (it.tagName === 'DETAILS') { it.open = false; delete it.dataset.auto; } }));
    input && input.addEventListener('input', () => { q = input.value.trim(); apply(); });
    input && input.addEventListener('keydown', (e) => { if (e.key === 'Escape' && input.value) { input.value = ''; q = ''; apply(); } });
    chips.forEach((c) => c.addEventListener('click', () => { cat = c.dataset.fcat; chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c))); apply(); }));
    const pre = new URLSearchParams(location.search).get('q'); if (pre && input) { input.value = pre; q = pre.trim(); }
    apply();
  });

  /* Mega-menu quick search (filters the links inside that menu) */
  $$('[data-mega-search]').forEach((inp) => {
    const mega = document.getElementById(inp.dataset.megaSearch); if (!mega) return;
    const none = $('.mega__none', mega);
    inp.addEventListener('input', () => {
      const toks = inp.value.toLowerCase().split(/\s+/).filter(Boolean); let n = 0;
      $$('.mi', mega).forEach((a) => { const ok = toks.every((t) => (a.dataset.q || '').includes(t)); a.hidden = !ok; if (ok) n++; });
      $$('.mg', mega).forEach((g) => { g.hidden = !$('.mi:not([hidden])', g); });
      if (none) none.hidden = n > 0;
    });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const first = $('.mi:not([hidden])', mega); if (first) { e.preventDefault(); location.href = first.href; } } });
  });

  /* Site search dialog: press "/" or Ctrl/Cmd+K anywhere, or use the header button */
  const sx = $('#sx');
  if (sx) {
    const q = $('#sxq'), res = $('#sxr'), chipsEl = $('#sxc'), box = $('.sx__box', sx);
    let data = null, loading = null, cat = '', sel = -1, opener = null;
    const E = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const hl = (s, toks) => { let o = E(s); toks.forEach((t) => { if (/[&;<>"]/.test(t)) return; o = o.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![^<]*>)', 'ig'), '<mark>$1</mark>'); }); return o; };
    const load = () => loading || (loading = fetch('/assets/search-index.json').then((r) => r.json()).then((d) => { data = d.map((x) => Object.assign(x, { tl: x.t.toLowerCase(), kl: (x.k || '').toLowerCase(), dl: (x.d || '').toLowerCase() })); }).catch(() => { data = []; }));
    const find = (toks) => {
      if (!toks.length) return data.filter((x) => x.p).map((x) => ({ x, s: 0 }));
      return data.map((x) => {
        let s = 0;
        for (const t of toks) { let m = 0; if (x.tl.startsWith(t)) m = 8; else if (x.tl.includes(' ' + t)) m = 6; else if (x.tl.includes(t)) m = 4; else if (x.kl.includes(t)) m = 2; else if (x.dl.includes(t)) m = 1.5; if (!m) return null; s += m; }
        return { x, s: s + (x.c === 'Service' ? 0.5 : 0) };
      }).filter(Boolean).sort((a, b) => b.s - a.s);
    };
    const setSel = (i) => { const rs = $$('.sx__r', res); if (!rs.length) { sel = -1; return; } sel = (i + rs.length) % rs.length; rs.forEach((r, k) => r.setAttribute('aria-selected', String(k === sel))); rs[sel].scrollIntoView({ block: 'nearest' }); q.setAttribute('aria-activedescendant', rs[sel].id); };
    const render = () => {
      if (!data) { res.innerHTML = '<p class="sx__empty">Loading…</p>'; return; }
      const toks = q.value.toLowerCase().split(/\s+/).filter(Boolean);
      const all = find(toks); const counts = {}; all.forEach(({ x }) => { counts[x.c] = (counts[x.c] || 0) + 1; });
      if (cat && !counts[cat]) cat = '';
      chipsEl.innerHTML = '';
      [['', 'All (' + all.length + ')']].concat(Object.keys(counts).map((c) => [c, c + ' (' + counts[c] + ')'])).forEach(([c, label]) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = label; b.setAttribute('aria-pressed', String(c === cat));
        b.addEventListener('click', () => { cat = c; render(); q.focus(); }); chipsEl.appendChild(b);
      });
      const list = all.filter(({ x }) => !cat || x.c === cat).slice(0, 40);
      if (!list.length) { res.innerHTML = '<p class="sx__empty">No results for “' + E(q.value.trim()) + '”. Try a different word, or <a href="/contact">ask us directly</a>.</p>'; sel = -1; q.removeAttribute('aria-activedescendant'); return; }
      res.innerHTML = (toks.length ? '' : '<div class="sx__lbl">Popular</div>') + list.map(({ x }, i) => '<a class="sx__r" role="option" id="sxo' + i + '" aria-selected="false" href="' + E(x.u) + '"><span class="t">' + hl(x.t, toks) + '</span><span class="c">' + E(x.c) + '</span>' + (x.d ? '<small>' + hl(x.d, toks) + '</small>' : '') + '</a>').join('');
      $$('.sx__r', res).forEach((a) => a.addEventListener('click', () => close()));
      setSel(0);
    };
    const open = () => { if (!sx.hidden) return; opener = document.activeElement; sx.hidden = false; document.body.classList.add('sx-lock'); q.value = ''; cat = ''; render(); load().then(render); q.focus(); };
    const close = () => { if (sx.hidden) return; sx.hidden = true; document.body.classList.remove('sx-lock'); opener && opener.focus && opener.focus(); };
    $$('[data-open-search]').forEach((b) => b.addEventListener('click', () => { closeAll(); if (nav.classList.contains('is-open')) setNav(false); open(); }));
    $$('[data-sx-close]').forEach((el) => el.addEventListener('click', close));
    q.addEventListener('input', () => { sel = 0; render(); });
    q.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSel(sel + 1); } else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(sel - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); const r = $$('.sx__r', res)[Math.max(sel, 0)]; if (r) { const h = r.getAttribute('href'); close(); location.href = h; } }
    });
    document.addEventListener('keydown', (e) => {
      const t = document.activeElement, typing = t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable);
      if (e.key === '/' && !typing && sx.hidden && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); open(); }
      else if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); sx.hidden ? open() : close(); }
      else if (e.key === 'Escape' && !sx.hidden) { e.preventDefault(); close(); }
      else if (e.key === 'Tab' && !sx.hidden) { const f = $$('input,button,a[href]', box).filter((n) => !n.disabled && n.offsetParent !== null); if (!f.length) return; const first = f[0], last = f[f.length - 1]; if (e.shiftKey && t === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && t === last) { e.preventDefault(); first.focus(); } }
    });
  }

  /* Booking page: pick a meeting type, then load the Calendly calendar on demand (nothing from Calendly loads before the visitor chooses) */
  const meets = $$('[data-meet]');
  if (meets.length) {
    const bar = $('#cal-bar'), ttl = $('#cal-title'), openLink = $('#cal-open'), frame = $('#cal-frame');
    const OK = /^https:\/\/calendly\.com\/[\w-]+\/[\w-]+$/;
    const pick = (b, scroll) => {
      const url = b.dataset.url; if (!OK.test(url)) return;
      meets.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      ttl.textContent = b.dataset.title; openLink.href = url; bar.hidden = false;
      frame.innerHTML = '<div class="cal__load" id="cal-load">Loading calendar…</div>';
      const f = document.createElement('iframe');
      f.src = url + '?embed_domain=' + encodeURIComponent(location.hostname) + '&embed_type=Inline&hide_gdpr_banner=1&primary_color=c9a24d&text_color=0b1f3b';
      f.title = 'Book a ' + b.dataset.title; f.addEventListener('load', () => { const l = $('#cal-load'); if (l) l.remove(); });
      frame.appendChild(f);
      try { history.replaceState(null, '', '?type=' + b.dataset.meet + '#calendar'); } catch (e) { /* ignore */ }
      if (scroll) $('#calendar').scrollIntoView({ behavior: rm ? 'auto' : 'smooth', block: 'start' });
    };
    meets.forEach((b) => b.addEventListener('click', () => pick(b, true)));
    const want = new URLSearchParams(location.search).get('type'); const pre = want && meets.find((b) => b.dataset.meet === want);
    if (pre) pick(pre, location.hash === '#calendar');
  }

  /* Booking page: interactive document checklist */
  const chk = $('[data-checklist]');
  if (chk) {
    const data = JSON.parse($('#chk-data').textContent), sel = $('#chk-sel'), out = $('#chk-out'), list = $('#chk-list'), h = $('#chk-h'), copy = $('#chk-copy'), ok = $('#chk-ok');
    sel.addEventListener('change', () => {
      const d = data[sel.value]; ok.textContent = '';
      if (!d) { out.hidden = true; return; }
      h.textContent = 'Your checklist: ' + d.t; list.innerHTML = '';
      d.items.forEach((t) => { const li = document.createElement('li'), lb = document.createElement('label'), cb = document.createElement('input'), sp = document.createElement('span'); cb.type = 'checkbox'; sp.textContent = t; lb.append(cb, sp); li.append(lb); list.append(li); });
      out.hidden = false;
    });
    copy.addEventListener('click', () => {
      const rows = $$('li', list).map((li) => (li.querySelector('input').checked ? '[x] ' : '[ ] ') + li.textContent.trim());
      const text = h.textContent + '\n' + rows.join('\n') + '\n\nNEXA Advisory & Consulting, info@nexa.com.np';
      const done = () => { ok.textContent = 'Copied to clipboard'; setTimeout(() => { ok.textContent = ''; }, 2500); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => {});
      else { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ } ta.remove(); }
    });
  }

  /* Home: "find your fit" wizard (runs entirely in the browser) */
  const wiz = $('[data-wiz]');
  if (wiz) {
    const D = JSON.parse($('#wiz-data').textContent), res = $('[data-wiz-res]'), st = { aud: '', need: '' };
    const mk = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; };
    const render = () => {
      if (!st.aud || !st.need) return;
      const a = D.aud[st.aud], keys = Array.from(new Set(D.nd[st.need].concat(a.add))).slice(0, 4);
      res.innerHTML = '';
      res.append(mk('h3', '', 'Recommended for you'), mk('p', '', 'Based on your answers, these services are a good place to start:'));
      const cards = mk('div', 'wiz__cards');
      keys.forEach((k) => { const s = D.sv[k], c = mk('a', 'wiz__card'); c.href = s.u; c.append(mk('b', '', s.t), mk('small', '', s.d)); cards.append(c); });
      const act = mk('div', 'wiz__act'), b1 = mk('a', 'btn btn--gold', 'Book a meeting'), b2 = mk('a', 'btn btn--ghost-light', 'Send an enquiry'), b3 = mk('a', 'link-arrow', 'See the sector page: ' + D.ind[a.i].t);
      b1.href = '/book#meeting'; b2.href = '/contact'; b3.href = D.ind[a.i].u; act.append(b1, b2, b3);
      res.append(cards, act);
    };
    $$('[data-wiz-q]', wiz).forEach((g) => { const btns = $$('button', g); btns.forEach((b) => b.addEventListener('click', () => { btns.forEach((x) => x.setAttribute('aria-checked', String(x === b))); st[g.dataset.wizQ] = b.dataset.v; render(); })); });
  }

  /* Forms (Formspree: AJAX with inline status; plain POST still works if JS is off) */
  const msg = (f, ok, text) => { const s = $('.form-status', f); s.innerHTML = ''; const d = document.createElement('div'); d.className = 'alert ' + (ok ? 'alert--ok' : 'alert--err'); d.textContent = text; s.appendChild(d); s.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };
  $$('form[data-formspree]').forEach((f) => {
    const b = $('button[type=submit]', f); const lbl = $('.lbl', b); const orig = lbl.textContent;
    f.addEventListener('submit', async (e) => {
      e.preventDefault(); $('.form-status', f).innerHTML = '';
      if (!f.checkValidity()) { f.reportValidity(); return; }
      const file = $('input[type=file]', f);
      if (file && file.files[0]) {
        const x = file.files[0]; const ok = /\.(pdf|docx?)$/i.test(x.name);
        if (!ok) return msg(f, false, 'Please upload your CV as a PDF, DOC or DOCX file.');
        if (x.size > 5 * 1024 * 1024) return msg(f, false, 'Your CV is larger than 5 MB. Please upload a smaller file.');
      }
      b.disabled = true; lbl.textContent = 'Sending…'; b.insertAdjacentHTML('afterbegin', '<span class="spin" aria-hidden="true"></span>');
      try {
        const res = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(res.status);
        f.reset(); msg(f, true, f.dataset.success || 'Thank you. Your message has been received and our team will respond by email.');
      } catch (err) {
        msg(f, false, 'We could not send your form. Please try again, or email info@nexa.com.np directly.');
      } finally { b.disabled = false; lbl.textContent = orig; $('.spin', b)?.remove(); }
    });
  });
})();
