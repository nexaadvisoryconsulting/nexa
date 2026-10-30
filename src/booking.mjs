// Appointment booking (Calendly), document checklist, home "meeting strip" and the "find your fit" wizard.
// Meeting links live in src/data.mjs -> company.booking. Calendly is loaded only after a visitor chooses a meeting type.
import { company, services, industries } from './data.mjs';
import { esc, icon, svcGroups } from './lib.mjs';
import { serviceInputs, svcBy, indBy } from './blocks.mjs';

const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
export const meetings = company.booking;
// guard: only calendly.com links may ever be embedded
for (const m of meetings) if (!/^https:\/\/calendly\.com\/[\w-]+\/[\w-]+$/.test(m.url)) throw new Error(`Invalid Calendly link for "${m.title}": ${m.url}`);

/* /book page: choose a meeting type (buttons), calendar panel (iframe is created by site.js on demand) */
export const meetPicker = () => `<div class="meets" role="group" aria-label="Choose a meeting type" id="meets">${meetings.map((m, i) => `<button type="button" class="meet reveal" data-d="${i}" data-meet="${m.id}" data-url="${esc(m.url)}" data-title="${esc(m.title)}" aria-pressed="false" aria-controls="cal"><span class="meet__ic">${icon(m.icon)}</span><span class="meet__t">${esc(m.title)}</span><span class="meet__p">${esc(m.blurb)}</span><ul>${m.best.map((b) => `<li>${esc(b)}</li>`).join('')}</ul><span class="meet__go"><span class="meet__go-off">Choose this meeting ${icon('arrow-right')}</span><span class="meet__go-on">${icon('check')} Selected</span></span></button>`).join('')}</div>
<noscript><p class="muted">JavaScript is needed to show the calendar here. Open a booking page directly: ${meetings.map((m) => `<a href="${esc(m.url)}" rel="noopener">${esc(m.title)}</a>`).join(' · ')}</p></noscript>`;

export const calendarPanel = () => `<div class="cal" id="cal" aria-live="polite"><div class="cal__bar" id="cal-bar" hidden><div><span class="eyebrow">Selected meeting</span><strong id="cal-title"></strong></div><div class="cal__act"><a class="btn btn--ghost" id="cal-open" href="#" target="_blank" rel="noopener">Open in a new tab ${icon('arrow-right')}</a></div></div><div class="cal__frame" id="cal-frame"><div class="cal__empty" id="cal-empty">${icon('calendar')}<p><b>Pick a meeting type above</b><br>The calendar with available times will appear here.</p></div></div><p class="cal__note">Scheduling is provided by Calendly. The calendar loads only after you choose a meeting type, and your booking details are handled by Calendly under its <a href="https://calendly.com/privacy" target="_blank" rel="noopener">privacy notice</a>. If it does not load, use “Open in a new tab”, email <a href="mailto:${company.email}">${company.email}</a> or message us on WhatsApp.</p></div>`;

/* document checklist generator (interactive, uses the same lists as the service pages) */
export const checklistTool = () => {
  const general = ['A short description of your business and what you want to achieve', 'What you need help with, and any deadlines you are working towards', 'The accounting software or systems you currently use', 'The people who should join the meeting'];
  const data = { general: { t: 'General preparation', items: general } };
  svcGroups.forEach(([t, a]) => { data[t] = { t, items: [...general.slice(0, 2), ...serviceInputs(a[0])] }; });
  return `<div class="chk" data-checklist><div class="chk__in"><label for="chk-sel">What would you like to discuss?</label><select id="chk-sel"><option value="">Choose an area…</option>${svcGroups.map(([t]) => `<option value="${esc(t)}">${esc(t)}</option>`).join('')}<option value="general">I’m not sure yet</option></select><p class="muted">You do not need everything on the list. Bring what you have, and we will confirm what is missing.</p></div><div class="chk__out" id="chk-out" hidden><h3 id="chk-h"></h3><ul class="chk__list" id="chk-list"></ul><div class="btn-row"><button type="button" class="btn btn--ghost" id="chk-copy">Copy checklist</button><span class="chk__ok" id="chk-ok" role="status"></span></div></div><script type="application/json" id="chk-data">${json(data)}</script></div>`;
};

export const bookingFaq = [
  ['Which meeting type should I choose?', 'Choose One-on-One for a private conversation, Group if several people from your side need to join, and Physical if you prefer to meet in person.'],
  ['Can I reschedule or cancel?', 'Yes. Your confirmation email from the scheduling tool includes links to reschedule or cancel.'],
  ['Which time zone are the times shown in?', 'The calendar detects your time zone automatically, and you can change it on the booking page, which is helpful if you are outside Nepal.'],
  ['Do I need an account?', 'No. You only enter your name, email and any details the form asks for.'],
  ['What happens after the meeting?', 'If we proceed, we agree scope, deliverables, responsibilities and timelines with you in writing before any work begins.'],
  ['The calendar does not load. What can I do?', `Use the “Open in a new tab” link beside the calendar, or email ${company.email} or message us on WhatsApp and we will arrange a time with you.`],
];

/* home page: "talk to us your way" strip */
export const meetStrip = () => `<div class="meetq">${meetings.map((m, i) => `<a class="meetq__c hx-r" data-d="${i}" href="/book?type=${m.id}#calendar"><span class="meetq__ic">${icon(m.icon)}</span><h3>${esc(m.title)}</h3><p>${esc(m.blurb)}</p><span class="meetq__go">Book this meeting ${icon('arrow-right')}</span></a>`).join('')}</div>`;

/* home page: "find your fit" wizard (client-side, no data leaves the browser) */
const AUD = [['sme', 'A business in Nepal', 'sme', []], ['startup', 'A startup or new venture', 'startups', ['company-registration']], ['ngo', 'An NGO, INGO or project', 'ngo-ingo', ['ngo-ingo']], ['intl', 'An international business or firm', 'international-remote', ['outsourced-accounting']]];
const NEED = [['books', 'Reliable books and reconciliations', ['accounting-bookkeeping', 'financial-reporting']], ['tax', 'Tax, VAT and registrations', ['taxation-compliance', 'company-registration']], ['reports', 'Reports, budgets and planning', ['financial-reporting', 'business-advisory', 'project-finance']], ['payroll', 'Payroll and HR compliance', ['payroll-hr', 'regulatory-licensing']], ['remote', 'Remote finance capacity', ['outsourced-accounting', 'accounting-bookkeeping']]];
export const wizard = () => {
  const sv = {}; const need = (k) => { if (!svcBy[k]) throw new Error('wizard: unknown service ' + k); sv[k] = { t: svcBy[k].title, d: svcBy[k].short, u: `/services/${k}` }; return k; };
  const ind = {};
  const aud = Object.fromEntries(AUD.map(([id, , i, add]) => { if (!indBy[i]) throw new Error('wizard: unknown industry ' + i); ind[i] = { t: indBy[i].name, u: `/industries/${i}` }; return [id, { i, add: add.map(need) }]; }));
  const nd = Object.fromEntries(NEED.map(([id, , list]) => [id, list.map(need)]));
  const opts = (name, arr) => `<div class="wiz__opts" role="radiogroup" aria-label="${name === 'aud' ? 'Who are you?' : 'What do you need most?'}" data-wiz-q="${name}">${arr.map(([id, label]) => `<button type="button" role="radio" aria-checked="false" data-v="${id}">${esc(label)}</button>`).join('')}</div>`;
  return `<div class="wiz" data-wiz><div class="wiz__col"><h3 class="wiz__h"><span>1</span>Who are you?</h3>${opts('aud', AUD)}</div><div class="wiz__col"><h3 class="wiz__h"><span>2</span>What do you need most?</h3>${opts('need', NEED)}</div><div class="wiz__res" data-wiz-res aria-live="polite"><div class="wiz__hint">${icon('compass')}<p>Choose one option in each column to see the services and sector page that fit best.</p></div></div><script type="application/json" id="wiz-data">${json({ sv, ind, aud, nd })}</script></div>`;
};
