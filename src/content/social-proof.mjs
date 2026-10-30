// HOME PAGE SOCIAL PROOF — edit this file, commit, and Netlify rebuilds the site.
//
// 1) HERO STATISTICS  (shown under the home-page hero, 3–4 items work best)
//    By default these are FACTS DERIVED FROM THIS WEBSITE (number of services, sectors, process steps),
//    so they are always accurate. To add business figures such as clients served or years of practice,
//    add them ONLY after verifying them, e.g.:
//        { n: 120, suffix: '+', label: 'Clients supported' },
//        { n: 8,   suffix: '+', label: 'Years of practice' },
//    Use `text` instead of `n` for a non-numeric highlight: { text: 'Nepal & Global', label: '…' }.
//
// 2) TESTIMONIALS  (home-page carousel)
//    The entries below are SAMPLE feedback written to preview the layout. They are not real client quotes.
//    Before publishing: replace them with genuine, permission-checked testimonials, then set
//    `testimonialsAreSamples = false` (this removes the on-page "sample" caption and the build warning).
//    Attribution is deliberately anonymous (initials + role + sector). Add a full name or company only with the client’s consent.
//    Review/rating structured data (JSON-LD) is intentionally NOT generated for testimonials.
import { services, industries, process as steps } from '../data.mjs';

export const heroStats = [
  { n: services.length, label: 'Specialist services' },
  { n: industries.length, label: 'Industry sectors covered' },
  { n: steps.length, label: 'Steps from brief to delivery' },
  { text: 'Nepal & Global', label: 'Remote-ready delivery' },
];

export const testimonialsAreSamples = true;

export const testimonials = [
  {
    quote: 'NEXA gave our books a structure we never had. Reconciliations now run on schedule, and the monthly report is something I can actually read and use.',
    initials: 'RS', name: 'R.S.', role: 'Managing Director', org: 'Retail and wholesale business', service: 'Accounting & Bookkeeping',
  },
  {
    quote: 'Registration, PAN and VAT paperwork felt overwhelming. The team explained each step in plain language and kept every document organised for us.',
    initials: 'AT', name: 'A.T.', role: 'Founder', org: 'Early-stage technology company', service: 'Company Registration',
  },
  {
    quote: 'We needed a dependable extra pair of hands at month-end. Scope and deliverables were agreed up front, and files came back in our own format.',
    initials: 'MK', name: 'M.K.', role: 'Partner', org: 'Overseas accounting practice', service: 'Outsourced Accounting',
  },
  {
    quote: 'Grant-wise ledgers and donor-format reports made our reporting cycles far calmer. Communication was clear from the very first call.',
    initials: 'SP', name: 'S.P.', role: 'Finance Lead', org: 'Development organisation', service: 'NGO & INGO Support',
  },
  {
    quote: 'Our platform payouts finally reconcile to the bank, and we now understand margins by sales channel instead of guessing.',
    initials: 'DG', name: 'D.G.', role: 'Co-founder', org: 'E-commerce business', service: 'Outsourced Accounting',
  },
  {
    quote: 'Payroll computations and compliance records now sit in one place, and nobody is chasing paperwork at the end of the month.',
    initials: 'NB', name: 'N.B.', role: 'Operations Manager', org: 'Hospitality business', service: 'Payroll & HR',
  },
];
