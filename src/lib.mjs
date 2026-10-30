import { existsSync } from 'node:fs';
import { company, services, industries } from './data.mjs';
import { icon, WA_PATH } from './icons.mjs';
import { brand, BRAND_LABEL } from './brands.mjs';
import { media } from './content/media.mjs';
import { esc } from './lib-util.mjs';
export { esc, icon };
export const ico = (n) => `<span class="hx-ico">${icon(n)}</span>`;
const wa = (t = '') => `https://wa.me/${company.whatsapp}${t ? '?text=' + encodeURIComponent(t) : ''}`;

const svcBy = Object.fromEntries(services.map((s) => [s.slug, s]));
const indBy = Object.fromEntries(industries.map((i) => [i.slug, i]));
const svcGroups = [
  ['Accounting & Reporting', ['accounting-bookkeeping', 'financial-reporting', 'outsourced-accounting']],
  ['Tax & Compliance', ['taxation-compliance', 'company-registration', 'payroll-hr', 'regulatory-licensing']],
  ['Advisory & Finance', ['business-advisory', 'project-finance', 'valuation-transaction-advisory', 'fdi-international-tax']],
  ['Specialised Support', ['ngo-ingo', 'internal-controls-risk', 'sustainability-esg', 'tender-training']],
];
const indGroups = [
  ['Business Types', ['sme', 'startups', 'retail-wholesale', 'manufacturing', 'construction', 'real-estate']],
  ['Services & Digital', ['it-software', 'professional-firms', 'ecommerce', 'hospitality', 'education', 'healthcare']],
  ['Trade, Impact & Global', ['ngo-ingo', 'importers-exporters', 'agriculture', 'transport-logistics', 'consulting-practices', 'donor-funded', 'international-remote', 'accounting-firms']],
];

const markSvg = `<svg class="mk" viewBox="0 0 40 40" aria-hidden="true"><rect class="mk-bg" x="1" y="1" width="38" height="38" rx="7"/><path d="M12 29V11l16 18V11" fill="none" stroke="#C9A24D" stroke-width="3.400" stroke-linejoin="miter"/></svg>`;
// Logo slot: set media.logo (src/content/media.mjs) to show your own logo image; otherwise the default "N" mark is used.
const safeUrl = (u) => (/^(https:\/\/|\/)[^\s"'<>]+$/.test(u || '') ? u : '');
const mark = safeUrl(media.logo) ? `<img class="mk-img" src="${esc(safeUrl(media.logo))}" alt="" width="42" height="42" decoding="async">` : markSvg;
export const logo = (cls = '') => `<a class="logo ${cls}" href="/" aria-label="NEXA Advisory &amp; Consulting – home">${mark}<span class="lt"><b>NEXA</b><small>Advisory &amp; Consulting</small></span></a>`;

/* social + messaging links (official brand glyphs, see brands.mjs) */
const SOC_KEY = { Instagram: 'instagram', Facebook: 'facebook', LinkedIn: 'linkedin', X: 'x' };
export const socLinks = () => Object.entries(company.social || {}).filter(([k, u]) => SOC_KEY[k] && /^https:\/\//.test(u))
  .map(([k, u]) => `<a href="${esc(u)}" rel="noopener noreferrer" target="_blank" aria-label="NEXA on ${esc(BRAND_LABEL[SOC_KEY[k]])}" title="${esc(BRAND_LABEL[SOC_KEY[k]])}" data-b="${SOC_KEY[k]}">${brand(SOC_KEY[k])}</a>`).join('')
  + `<a href="${wa('Hello NEXA, I would like to discuss my requirements.')}" rel="noopener noreferrer" target="_blank" aria-label="Chat with NEXA on WhatsApp" title="WhatsApp" data-b="whatsapp">${brand('whatsapp')}</a>`;
export const icoB = (k) => `<span class="hx-ico">${brand(k)}</span>`;
const searchBtnSvg = icon('search');

const svcGroupIcon = { 'Accounting & Reporting': 'calculator', 'Tax & Compliance': 'file-text', 'Advisory & Finance': 'bulb', 'Specialised Support': 'shield' };
const indGroupIcon = { 'Business Types': 'briefcase', 'Services & Digital': 'laptop', 'Trade, Impact & Global': 'globe' };

function header(path, overlay) {
  const cur = (p) => (path === p || path.startsWith(p + '/') ? ' aria-current="page"' : '');
  const here = (p) => (path === p ? ' aria-current="page"' : '');
  const top = (label, href, id) => `<div class="nl-wrap"><a class="nl" href="${href}"${cur(href)}>${label}</a><button class="nl nl-t" aria-expanded="false" aria-controls="${id}" aria-label="Show ${label} menu">${icon('chevron')}</button></div>`;
  const item = (s) => `<a class="mi" href="/services/${s.slug}"${here('/services/' + s.slug)} data-q="${esc((s.title + ' ' + s.short).toLowerCase())}"><span class="mi__ic">${icon(s.icon)}</span><span><b>${esc(s.title)}</b><small>${esc(s.short)}</small></span></a>`;
  const iitem = (i) => `<a class="mi mi--s" href="/industries/${i.slug}"${here('/industries/' + i.slug)} data-q="${esc((i.name + ' ' + (i.headline || '')).toLowerCase())}"><span class="mi__ic">${icon(i.icon)}</span><span><b>${esc(i.name)}</b></span></a>`;
  const megaTop = (eb, title, id, ph, href, all) => `<div class="mega__top"><div><span class="eyebrow">${eb}</span><strong>${title}</strong></div><label class="mega__s">${searchBtnSvg}<input type="search" data-mega-search="${id}" placeholder="${ph}" aria-label="${ph}" autocomplete="off" enterkeyhint="search"></label><a class="link-arrow" href="${href}">${all} ${icon('arrow-right')}</a></div>`;
  const megaFoot = (lead, a, b) => `<div class="mega__foot"><span>${lead}</span><a href="${a[1]}">${a[0]} ${icon('arrow-right')}</a><a href="${b[1]}">${b[0]}</a><a href="${wa('Hello NEXA, I would like to discuss my requirements.')}" rel="noopener noreferrer" target="_blank">${brand('whatsapp')} WhatsApp us</a></div>`;
  const megaS = `<div class="mega" id="m-services"><div class="container">${megaTop('What we do', `${services.length} specialist services across ${svcGroups.length} practice areas`, 'm-services', 'Find a service…', '/services', 'View all services')}<div class="mega__in mega__in--s">${svcGroups.map(([t, a]) => `<div class="mg"><h4>${icon(svcGroupIcon[t] || 'layers')}<span>${t}</span><em>${a.length}</em></h4>${a.map((x) => item(svcBy[x])).join('')}</div>`).join('')}<div class="mega__feat"><span class="eyebrow">Priority service</span><h3>Your Extended Accounting Team, Without Borders.</h3><p>Flexible remote accounting and finance support for international businesses and accounting firms.</p><ul><li>${icon('check')}Remote bookkeeping</li><li>${icon('check')}Month-end assistance</li><li>${icon('check')}Reporting support</li></ul><a class="btn btn--gold" href="/outsourcing">Explore Outsourcing ${icon('arrow-right')}</a></div></div><p class="mega__none" hidden>No service matches your search. <a href="/contact">Ask us instead</a>.</p>${megaFoot('Not sure which service you need?', ['Use the service finder', '/services#find'], ['Book a meeting', '/book'])}</div></div>`;
  const megaI = `<div class="mega" id="m-industries"><div class="container">${megaTop('Who we support', `${industries.length} industry sectors in ${indGroups.length} groups`, 'm-industries', 'Find your industry…', '/industries', 'All industries')}<div class="mega__in mega__in--i">${indGroups.map(([t, a]) => `<div class="mg"><h4>${icon(indGroupIcon[t] || 'layers')}<span>${t}</span><em>${a.length}</em></h4>${a.map((x) => iitem(indBy[x])).join('')}</div>`).join('')}<div class="mega__feat"><span class="eyebrow">Not sure where you fit?</span><h3>Tell us about your business.</h3><p>We will outline the support that may suit your sector and stage.</p><ul><li>${icon('check')}Scope agreed in writing</li><li>${icon('check')}Remote-ready support</li><li>${icon('check')}Confidential handling</li></ul><a class="btn btn--gold" href="/contact">Contact NEXA ${icon('arrow-right')}</a></div></div><p class="mega__none" hidden>No industry matches your search. <a href="/contact">Tell us about yours</a>.</p>${megaFoot('Your sector is not listed?', ['Talk to us', '/contact'], ['Book a meeting', '/book'])}</div></div>`;
  const rich = (href, ic, t, d) => `<li><a class="mi" href="${href}"${here(href)}><span class="mi__ic">${icon(ic)}</span><span><b>${t}</b><small>${d}</small></span></a></li>`;
  const dd = `<ul class="dd dd--rich" id="m-insights">${rich(company.blog, 'book', 'Blog &amp; Insights', 'Practical articles on accounting, tax and compliance (opens our blog).')}${rich('/faqs', 'chat', 'FAQs', 'Quick answers about working with NEXA.')}${rich('/book', 'calendar', 'Book a Meeting', 'Choose a physical, group or one-on-one meeting.')}<li><button type="button" class="mi mi--btn" data-open-search><span class="mi__ic">${searchBtnSvg}</span><span><b>Search the site</b><small>Services, industries, FAQs and pages.</small></span></button></li></ul>`;
  return `<header class="hdr${overlay ? ' hdr--over' : ''}" id="hdr">
<div class="topbar"><div class="container"><span>${icon('mail')}<a href="mailto:${company.email}">${company.email}</a></span><span class="tb-m">${icon('globe')}${esc(company.coverage)}</span><span class="tb-r">Remote support for international clients · <a class="tb-wa" href="${wa()}" rel="noopener">WhatsApp ${company.phone}</a><span class="tb-soc">${socLinks()}</span></span></div></div>
<div class="hdr__bar"><div class="container hdr__in">${logo()}
<nav aria-label="Primary"><ul class="nav" id="nav">
<li class="m-only"><a class="nl" href="/">Home</a></li>
<li class="has-mega">${top('Services', '/services', 'm-services')}${megaS}</li>
<li class="has-mega">${top('Industries', '/industries', 'm-industries')}${megaI}</li>
<li><a class="nl" href="/why-nexa"${cur('/why-nexa')}>Why NEXA</a></li>
<li><a class="nl" href="/about"${cur('/about')}>About</a></li>
<li><a class="nl" href="/outsourcing"${cur('/outsourcing')}>Outsourcing</a></li>
<li class="has-dd">${top('Insights', company.blog, 'm-insights')}${dd}</li>
<li><a class="nl" href="/careers"${cur('/careers')}>Careers</a></li>
<li class="m-only m-cta"><a class="btn btn--gold" href="/book">Book a Consultation</a><div class="m-soc">${socLinks()}</div><p><a href="mailto:${company.email}">${company.email}</a><br><a href="tel:${company.phone.replace(/\s/g, '')}">${company.phone}</a><br>${esc(company.coverage)}</p></li>
</ul></nav>
<button class="hdr-search" type="button" data-open-search aria-label="Search the site" aria-haspopup="dialog" aria-controls="sx">${searchBtnSvg}<span class="hdr-search__t">Search</span><kbd aria-hidden="true">/</kbd></button>
<a class="btn btn--gold btn--hdr" href="/book">Book a Consultation</a>
<button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button></div>
<div class="progress" id="progress" aria-hidden="true"></div></div></header>`;
}

function footer() {
  const y = new Date().getFullYear();
  const li = (h, t) => `<li><a href="${h}">${t}</a></li>`;
  const fs = [['accounting-bookkeeping', 'Accounting & Bookkeeping'], ['taxation-compliance', 'Taxation & Compliance'], ['financial-reporting', 'Financial Reporting'], ['company-registration', 'Corporate Compliance'], ['payroll-hr', 'Payroll & HR'], ['business-advisory', 'Business Advisory'], ['outsourced-accounting', 'Outsourced Finance']];
  const fi = [['sme', 'SMEs'], ['startups', 'Startups'], ['manufacturing', 'Manufacturing'], ['ecommerce', 'E-commerce'], ['ngo-ingo', 'NGOs & INGOs'], ['importers-exporters', 'Importers & Exporters'], ['accounting-firms', 'Accounting Firms']];
  return `<footer class="nf"><div class="container nf__grid">
<div class="nf__brand">${logo('logo--light')}<p>Accounting, taxation, financial reporting, corporate compliance, business advisory and outsourced finance support for businesses across Nepal and international clients.</p>
<div class="nf__ct"><a href="mailto:${company.email}">${ico('mail')}${company.email}</a><a href="tel:${company.phone.replace(/\s/g, '')}">${ico('phone')}${company.phone}</a><a href="${wa()}" rel="noopener noreferrer" target="_blank">${icoB('whatsapp')}Chat on WhatsApp</a><span>${ico('globe')}${esc(company.coverage)}</span></div>
<p class="nf__follow">Follow NEXA</p><div class="nf__soc">${socLinks()}<a href="mailto:${company.email}" aria-label="Email NEXA" title="Email" data-b="mail">${icon('mail')}</a></div>
<a class="btn btn--gold nf__btn" href="/book">Book a Consultation ${icon('arrow-right')}</a></div>
<div><h4>Company</h4><ul>${li('/about', 'About NEXA')}${li('/why-nexa', 'Why NEXA')}${li('/outsourcing', 'Outsourcing')}${li('/book', 'Book a Meeting')}${li(company.blog, 'Blog &amp; Insights')}${li('/careers', 'Careers')}${li('/faqs', 'FAQs')}${li('/contact', 'Contact')}</ul></div>
<div><h4>Services</h4><ul>${fs.map(([s, t]) => li('/services/' + s, esc(t))).join('')}${li('/services', '<strong>All services →</strong>')}</ul></div>
<div><h4>Industries</h4><ul>${fi.map(([s, t]) => li('/industries/' + s, esc(t))).join('')}${li('/industries', '<strong>All industries →</strong>')}</ul></div></div>
<div class="container nf__strip"><span>Clear scope before work begins</span><span>Structured workflows</span><span>Transparent communication</span><span>Remote-ready across time zones</span></div>
<div class="container nf__bar"><span>&copy; <span id="yr">${y}</span> ${esc(company.name.replace(/\.+$/, ''))}. All rights reserved.</span><ul><li><a href="/privacy-policy">Privacy Policy</a></li><li><a href="/terms-of-use">Terms of Use</a></li><li><a href="/disclaimer">Disclaimer</a></li><li><a href="/cookie-policy">Cookie Policy</a></li></ul><a class="nf__top totop" href="#top" id="totop" aria-label="Back to top">${icon('arrow-up')}</a><p class="nf__note">Content on this website is general information and does not replace professional advice for your specific situation.</p></div></footer>
<div class="hx-wa"><a href="${wa('Hello NEXA, I would like to discuss my requirements.')}" target="_blank" rel="noopener" aria-label="Chat with NEXA on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${WA_PATH}"/></svg></a><span>Chat on WhatsApp</span></div>`;
}

/* site search dialog (populated from /assets/search-index.json by site.js) */
const searchDialog = `<div class="sx" id="sx" role="dialog" aria-modal="true" aria-label="Search NEXA" hidden><div class="sx__bg" data-sx-close></div><div class="sx__box"><form class="sx__form" role="search" action="/services" onsubmit="return false">${icon('search')}<input id="sxq" type="search" placeholder="Search services, industries, FAQs…" autocomplete="off" spellcheck="false" aria-controls="sxr" enterkeyhint="search"><button type="button" class="sx__x" data-sx-close aria-label="Close search">Esc</button></form><div class="sx__chips" id="sxc" role="group" aria-label="Filter results"></div><div class="sx__res" id="sxr" role="listbox" aria-label="Search results"></div><p class="sx__hint" aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></p></div></div>`;

/* page-hero image slot: pageHero() emits %%HEROIMG%%, layout() swaps in the configured image (or the reserved empty space) */
const heroUrl = (path) => { const h = media.heroImages || {}; const sect = '/' + path.split('/')[1]; return safeUrl(h[path] || h[sect + '/*'] || h.default || ''); };
const heroSlot = (path) => { const u = heroUrl(path); return u ? `<figure class="phero__media"><img src="${esc(u)}" alt="" width="1200" height="800" decoding="async" fetchpriority="high"></figure>` : `<div class="phero__media phero__media--empty" aria-hidden="true"><!-- Hero image slot: set a link in src/content/media.mjs -->${icon('image')}<span>Hero image</span></div>`; };
export const homeHeroImage = () => safeUrl((media.heroImages || {})['/']) || '/assets/img/hero-mountain.jpg';

export function layout({ title, desc, path, body: rawBody, overlay = true, preload = '', noindex = false, home = false, ld = [], bc = [], ogType = 'website', head = '' }) {
  const body = rawBody.split('%%HEROIMG%%').join(heroSlot(path));
  const url = `${company.site}${path === '/' ? '/' : path}`;
  const og = existsSync('public/assets/img/og.png') ? `<meta property="og:image" content="${company.site}/assets/img/og.png"><meta name="twitter:image" content="${company.site}/assets/img/og.png">` : '';
  const bcLd = bc.length ? [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', '/'], ...bc].map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, ...(p ? { item: company.site + p } : {}) })) }] : [];
  const lds = [...ld, ...bcLd].map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex,nofollow">' : `<link rel="canonical" href="${url}">`}
<meta property="og:site_name" content="${esc(company.name)}"><meta property="og:type" content="${ogType}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}">${og}<meta name="twitter:card" content="${og ? 'summary_large_image' : 'summary'}"><meta name="theme-color" content="#0B1F3B">
${safeUrl(media.favicon) ? `<link rel="icon" href="${esc(safeUrl(media.favicon))}">` : '<link rel="icon" href="/favicon.svg" type="image/svg+xml">'}${safeUrl(media.appleTouchIcon) ? `<link rel="apple-touch-icon" href="${esc(safeUrl(media.appleTouchIcon))}">` : ''}${head}${preload ? `<link rel="preload" as="image" href="${preload}" fetchpriority="high">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&display=swap">
<link rel="stylesheet" href="/assets/css/site.css"><script>document.documentElement.classList.add('js')</script>${lds}</head>
<body id="top"><a class="skip" href="#main">Skip to content</a>${header(path, overlay)}<main id="main" class="${home ? 'home ' : ''}${body.includes('hx-ctaw') ? 'has-cta' : ''}">${body}</main>${footer()}${searchDialog}
<script src="/assets/js/site.js" defer></script></body></html>`;
}

export const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${items.map(([l, h]) => `<span aria-hidden="true">/</span>${h ? `<a href="${h}">${esc(l)}</a>` : `<span aria-current="page">${esc(l)}</span>`}`).join('')}</nav>`;
const ridge = `<svg class="phero__ridge" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true"><path d="M0 300V180l120-70 90 50 140-110 130 100 110-60 150 90 120-80 140 100 100-60v260z" fill="#1c3d60"/><path d="M0 300V230l150-60 120 40 160-80 140 90 150-50 130 70 150-60 200 60v120z" fill="#14304F"/></svg>`;
export const pageHero = (eyebrow, h1, lead, crumbItems, extra = '', cls = '') => `<section class="phero${cls ? ' ' + cls : ''}">${ridge}<div class="container phero__in"><div class="phero__t">${crumbs(crumbItems)}<span class="eyebrow">${esc(eyebrow)}</span><h1>${esc(h1)}</h1>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}${extra}</div>%%HEROIMG%%</div></section>`;
export const checks = (arr, two = false) => `<ul class="checks${two ? ' checks--2' : ''}">${arr.map((x) => `<li>${icon('check')}<span>${esc(x)}</span></li>`).join('')}</ul>`;
const ctaPoints = [['check', 'Scope agreed in writing'], ['lock', 'Confidential handling'], ['globe', 'Remote-ready support']];
const ext = (h) => (/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : '');
export const ctaBand = (h = 'Ready to Move Your Business Forward?', p = 'Tell us about your business and the support you need. Our team will work with you to understand your requirements and discuss a suitable way forward.', a = ['Book a Consultation', '/book'], b = ['Explore Our Services', '/services'], o = {}) => {
  const msg = o.wa || 'Hello NEXA, I would like to discuss my requirements.';
  const pts = o.points === false ? [] : o.points || ctaPoints;
  return `<section class="hx-ctaw" aria-labelledby="cta-h"><div class="container"><div class="hx-cta2 reveal"><div class="hx-cta2__c"><span class="eyebrow">${esc(o.eyebrow || 'GET IN TOUCH')}</span><h2 id="cta-h">${esc(h)}</h2><p>${esc(p)}</p><div class="btn-row"><a class="btn btn--gold" href="${a[1]}"${ext(a[1])}>${esc(a[0])} ${icon('arrow-right')}</a><a class="btn btn--ghost-light" href="${b[1]}"${ext(b[1])}>${esc(b[0])}</a></div>${pts.length ? `<ul class="hx-pts">${pts.map(([i, t]) => `<li>${icon(i)}${esc(t)}</li>`).join('')}</ul>` : ''}</div><div class="hx-cc hx-cta2__c"><a href="mailto:${company.email}">${ico('mail')}<span><small>EMAIL</small>${company.email}</span></a><a href="${wa(msg)}" target="_blank" rel="noopener">${icoB('whatsapp')}<span><small>WHATSAPP</small>${company.phone}</span></a><div>${ico('globe')}<span><small>COVERAGE</small>${esc(company.coverage)}</span></div></div></div></div></section>`;
};
export { svcGroups, indGroups };
