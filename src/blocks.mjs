// Reusable section builders + shared copy for inner pages. All output is plain HTML strings.
// Copy here follows the site rule: describe real ways of working only; no invented clients, figures or credentials.
import { esc, icon, svcGroups } from './lib.mjs';
import { services, industries, process as steps } from './data.mjs';

export const slug = (s) => String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const svcBy = Object.fromEntries(services.map((s) => [s.slug, s]));
export const indBy = Object.fromEntries(industries.map((i) => [i.slug, i]));
// lowercase the first letter unless the word looks like an acronym (VAT, NGO…)
export const lc = (s) => (/^[A-Z][A-Z]/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));

/* ---------- layout helpers ---------- */
export const sec = (inner, { alt = false, id = '', cls = '' } = {}) =>
  `<section class="section${alt ? ' section--alt' : ''}${cls ? ' ' + cls : ''}"${id ? ` id="${id}"` : ''}><div class="container">${inner}</div></section>`;
export const head = (eyebrow, h, p = '', center = false) =>
  `<div class="section-head${center ? ' section-head--c' : ''} reveal"><span class="eyebrow">${esc(eyebrow)}</span><h2>${esc(h)}</h2>${p ? `<p class="lead">${esc(p)}</p>` : ''}</div>`;

export const statBand = (items) =>
  `<section class="statband" aria-label="At a glance"><div class="container"><ul class="statband__in" style="--cols:${items.length}">${items.map(([n, l]) => `<li><b${typeof n === 'number' ? ` data-count="${n}"` : ''}>${esc(n)}</b><span>${esc(l)}</span></li>`).join('')}</ul></div></section>`;

export const iconCards = (items, cols = 'g3') =>
  `<div class="grid ${cols}">${items.map(([i, h, p], k) => `<div class="panel reveal" data-d="${k % 3}"><span class="ico">${icon(i)}</span><h3>${esc(h)}</h3><p class="muted" style="margin:0">${esc(p)}</p></div>`).join('')}</div>`;

export const stepsBlock = (arr, cls = '') =>
  `<div class="steps${cls ? ' ' + cls : ''}">${arr.map(([h, p]) => `<div class="step reveal"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>`;

export const faqBlock = (qs) =>
  `<div class="acc">${qs.map(([q, a]) => `<details><summary>${esc(q)}</summary><div class="ans">${esc(a)}</div></details>`).join('')}</div>`;

export const quickFacts = (rows, title = 'At a glance') =>
  `<div class="panel"><h3>${esc(title)}</h3><dl class="qf">${rows.map(([i, t, v]) => `<div>${icon(i)}<dt>${esc(t)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>`;

export const banner = (h, p, label, href) =>
  `<div class="banner reveal"><div><h3>${esc(h)}</h3><p>${esc(p)}</p></div><a class="btn btn--navy" href="${href}">${esc(label)} ${icon('arrow-right')}</a></div>`;

export const chipNav = (items, label) =>
  `<nav class="chipnav" aria-label="${esc(label)}">${items.map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join('')}</nav>`;

export const compare = (cols, rows) =>
  `<div class="cmp-wrap reveal" tabindex="0" role="region" aria-label="Comparison table"><table class="cmp"><thead><tr><th scope="col"><span class="sr-only">Topic</span></th>${cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(([t, ...c]) => `<tr><th scope="row">${esc(t)}</th>${c.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

export const fitLists = (yes, no) =>
  `<div class="fit"><div class="panel reveal"><h3>${icon('check')}A good fit if you…</h3><ul class="checks">${yes.map((x) => `<li>${icon('check')}<span>${esc(x)}</span></li>`).join('')}</ul></div><div class="panel reveal" data-d="1"><h3>${icon('x')}Probably not the right fit if you need…</h3><ul class="checks checks--no">${no.map((x) => `<li>${icon('x')}<span>${esc(x)}</span></li>`).join('')}</ul></div></div>`;

/* ---------- shared content ---------- */
export const standards = [
  ['clipboard-check', 'Scope agreed in writing', 'Deliverables, responsibilities and timelines are confirmed before work begins.'],
  ['file-text', 'Documented, traceable workings', 'Reconciliations and schedules are kept so results can be reviewed with you.'],
  ['bar-chart', 'Plain-language reporting', 'We explain what the figures mean for decisions, not just how they were produced.'],
  ['lock', 'Confidential by default', 'Client information is used only for agreed work and shared on a need-to-know basis.'],
  ['clock', 'Early notice of changes', 'We flag anything that affects scope, timing or cost as soon as we see it.'],
  ['chat', 'Direct, transparent communication', 'Straightforward updates from the team doing the work.'],
];

export const models = [
  ['Ongoing monthly support', 'Recurring bookkeeping and reporting handled on an agreed schedule.', ['Transaction processing', 'Reconciliations', 'Monthly reports']],
  ['Compliance support', 'Assistance with tax, corporate and payroll documentation for Nepal-based entities.', ['Tax documentation', 'Statutory records', 'Filing coordination']],
  ['Remote outsourcing', 'Flexible back-office finance capacity for firms and international businesses.', ['Month-end assistance', 'Workflow documentation', 'Reporting support']],
  ['Project-based work', 'Defined deliverables with a clear start and end.', ['Financial models', 'Project reports', 'Spreadsheet cleanup']],
];
export const modelCards = () =>
  `<div class="grid g4">${models.map(([h, p, l], i) => `<div class="panel model reveal" data-d="${i % 4}"><b class="model__n">${String(i + 1).padStart(2, '0')}</b><h3>${esc(h)}</h3><p class="muted">${esc(p)}</p><ul class="model__l">${l.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>`;

/* what we usually ask clients for, by service group */
const inputsByGroup = {
  'Accounting & Reporting': ['Bank and cash statements', 'Sales and purchase invoices', 'Existing ledgers or a trial balance', 'Prior-period financial statements', 'Details of the accounting software you use'],
  'Tax & Compliance': ['Registration and incorporation documents', 'PAN, VAT and other registration details', 'Previous returns and filing records', 'Payroll or transaction summaries, where relevant', 'Any notices or correspondence from authorities'],
  'Advisory & Finance': ['A short description of the business and its objectives', 'Recent financial statements or management accounts', 'Budgets, projections or existing models', 'Funding, lender or investor requirements', 'Contracts or transaction documents, where relevant'],
  'Specialised Support': ['Programme, grant or project documents', 'Budgets and approved cost categories', 'Accounting records and supporting documents', 'Donor, regulator or tender requirements', 'Existing policies and procedures'],
};
export const serviceInputs = (slugName) => {
  const g = svcGroups.find(([, a]) => a.includes(slugName));
  return g ? inputsByGroup[g[0]] : inputsByGroup['Accounting & Reporting'];
};
export const industryInputs = ['Recent financial records or bank statements', 'Existing registrations and prior filings', 'Details of the accounting, billing or point-of-sale systems you use', 'Key contracts, grants or funding terms, where relevant', 'Your reporting needs and deadlines'];

export const industryApproach = (i) => [
  ['Understand your operations', 'We review how your business runs day to day: transaction flows, records, systems and who needs which reports.'],
  ['Prioritise what matters', `We start with the most pressing areas, such as ${lc(i.challenges[0])}.`],
  ['Agree scope and set up', 'Deliverables, schedules and responsibilities are agreed in writing, and practical workflows are set up around your tools.'],
  ['Deliver and refine', `Recurring or defined-scope work is delivered and reviewed with you, for example ${lc(i.deliverables[0])}.`],
];
export const industryFaqs = (i) => {
  const names = i.services.slice(0, 3).map((s) => svcBy[s].title);
  const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];
  return [
    ['Can NEXA support a business like ours?', `NEXA can support this type of organisation with services such as ${list}. We discuss your records, systems and priorities in an initial conversation and confirm scope before any work begins.`],
    ['Which services are most relevant?', `${svcBy[i.services[0]].title} is a common starting point, often alongside ${svcBy[i.services[1]].title}. The right mix depends on your needs and is agreed with you.`],
    ['Can support be provided remotely?', 'Yes. Support can be delivered remotely using shared documents, spreadsheets and agreed accounting tools.'],
    ['How do we get started?', 'Send a short description of your business through the contact page. We will arrange an initial discussion and agree scope and deliverables in writing before work starts.'],
  ];
};

export const areas = [
  ['calculator', 'Accounting & Reporting', 'Books, reconciliations, statements and management reports built on reliable records.'],
  ['file-text', 'Tax & Compliance', 'Registrations, returns, payroll and corporate compliance kept in order.'],
  ['bulb', 'Advisory & Finance', 'Business advisory, project finance, valuation and cross-border support.'],
  ['shield', 'Specialised Support', 'NGO and donor reporting, internal controls, ESG and tender support.'],
];
export const areaCards = () =>
  `<div class="grid g4">${areas.map(([i, h, p], k) => `<a class="card reveal" data-d="${k % 4}" href="/services#${slug(h)}"><span class="ico">${icon(i)}</span><h3>${esc(h)}</h3><p>${esc(p)}</p><span class="link-arrow">View services ${icon('arrow-right')}</span></a>`).join('')}</div>`;

export const needs = [
  ['I need clean monthly books and reconciliations', 'accounting-bookkeeping'],
  ['I need to register a company or file annual returns', 'company-registration'],
  ['I need help organising VAT, withholding or income tax records', 'taxation-compliance'],
  ['I need management reports, budgets or cash-flow forecasts', 'financial-reporting'],
  ['I need payroll processed and employee records organised', 'payroll-hr'],
  ['I need a project report for a lender or investor', 'project-finance'],
  ['I need remote finance capacity for my firm or business', 'outsourced-accounting'],
  ['I run an NGO or a donor-funded programme', 'ngo-ingo'],
];
export const needFinder = () =>
  `<div class="finder-grid">${needs.map(([t, s], k) => `<a class="finder reveal" data-d="${k % 2}" href="/services/${s}"><span>${esc(t)}</span><b>${esc(svcBy[s].title)} ${icon('arrow-right')}</b></a>`).join('')}</div>`;

export const processSteps = steps;
