import { esc } from './lib-util.mjs';
const T = 'font-family="Inter,Arial,sans-serif"';
/* Hero composition: report card, filing checklist and reconciliation ring. Descriptive only, no statistics. */
export function heroArt() {
  const bars = [[70, 60], [112, 95], [154, 78], [196, 130], [238, 108], [280, 150]];
  return `<svg viewBox="0 0 560 560" role="img" aria-label="Illustration of a management report, a filing checklist and a reconciliation status" xmlns="http://www.w3.org/2000/svg">
<defs><pattern id="hg" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#fff" stroke-opacity=".07"/></pattern>
<linearGradient id="hb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#143457"/><stop offset="1" stop-color="#0B1F3B"/></linearGradient></defs>
<rect width="560" height="560" rx="10" fill="url(#hb)"/><rect width="560" height="560" rx="10" fill="url(#hg)"/>
<circle cx="480" cy="60" r="90" fill="none" stroke="#C9A24D" stroke-opacity=".35"/><circle cx="480" cy="60" r="130" fill="none" stroke="#C9A24D" stroke-opacity=".18"/>
<g class="float"><rect x="48" y="86" width="380" height="270" rx="10" fill="#fff"/><rect x="48" y="86" width="380" height="38" rx="10" fill="#F6F7F9"/><rect x="48" y="112" width="380" height="12" fill="#F6F7F9"/>
<circle cx="70" cy="105" r="4.500" fill="#E3E7ED"/><circle cx="86" cy="105" r="4.500" fill="#E3E7ED"/><circle cx="102" cy="105" r="4.500" fill="#E3E7ED"/>
<text x="124" y="109" ${T} font-size="12" font-weight="600" fill="#0B1F3B">Management report</text>
<g transform="translate(18,0)">${bars.map(([x, h], i) => `<rect x="${x + 30}" y="${330 - h}" width="26" height="${h}" rx="3" fill="${i === 5 ? '#C9A24D' : '#0B1F3B'}" opacity="${i === 5 ? 1 : 0.9 - i * 0.1}"/>`).join('')}</g>
<polyline points="${bars.map(([x, h]) => `${x + 61},${322 - h - 18}`).join(' ')}" fill="none" stroke="#D6AD52" stroke-width="2.500" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="76" y="146" width="120" height="8" rx="4" fill="#E3E7ED"/><rect x="76" y="162" width="84" height="8" rx="4" fill="#EEF0F3"/></g>
<g class="float2"><rect x="250" y="318" width="262" height="196" rx="10" fill="#fff" stroke="#E3E7ED"/>
<text x="270" y="348" ${T} font-size="12" font-weight="600" fill="#0B1F3B">Filing calendar</text>
${[['VAT return', 1], ['Withholding tax', 1], ['Annual filing', 0], ['Payroll records', 1]].map(([t, d], i) => `<g transform="translate(270,${368 + i * 34})"><rect width="20" height="20" rx="4" fill="${d ? '#C9A24D' : '#fff'}" stroke="${d ? '#C9A24D' : '#C9D0DA'}" stroke-width="1.500"/>${d ? '<path d="M5 10.500l3.500 3.500L15 7" stroke="#0B1F3B" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' : ''}<text x="32" y="14" ${T} font-size="12" fill="#172334">${t}</text></g>`).join('')}</g>
<g class="float3"><circle cx="110" cy="440" r="62" fill="#fff"/><circle cx="110" cy="440" r="46" fill="none" stroke="#E3E7ED" stroke-width="10"/>
<circle cx="110" cy="440" r="46" fill="none" stroke="#C9A24D" stroke-width="10" stroke-linecap="round" stroke-dasharray="230 290" transform="rotate(-90 110 440)"/>
<path d="M95 440l11 11 20-22" stroke="#0B1F3B" stroke-width="4.500" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<text x="110" y="522" ${T} font-size="12" font-weight="600" fill="#fff" text-anchor="middle">Reconciled</text></g></svg>`;
}
/* Remote outsourcing workflow diagram. */
export function flowArt() {
  const node = (x, t, s, hl) => `<g transform="translate(${x},40)"><rect width="180" height="110" rx="10" fill="${hl ? '#C9A24D' : '#14304F'}" stroke="${hl ? '#C9A24D' : '#fff'}" stroke-opacity="${hl ? 1 : 0.18}"/><text x="90" y="52" ${T} font-size="15" font-weight="700" fill="${hl ? '#0B1F3B' : '#fff'}" text-anchor="middle">${t}</text><text x="90" y="74" ${T} font-size="12" fill="${hl ? '#0B1F3B' : '#fff'}" opacity=".78" text-anchor="middle">${s}</text></g>`;
  const arrow = (x) => `<g transform="translate(${x},95)"><path d="M0 0h34" stroke="#D6AD52" stroke-width="2" stroke-dasharray="4 4"/><path d="M28-6l8 6-8 6" fill="none" stroke="#D6AD52" stroke-width="2"/></g>`;
  return `<svg viewBox="0 0 640 190" role="img" aria-label="Workflow: your records go to the NEXA team, who return reports and files" xmlns="http://www.w3.org/2000/svg">${node(10, 'Your records', 'Bank, invoices, ledgers')}${arrow(194)}${node(230, 'NEXA team', 'Agreed workflow', true)}${arrow(414)}${node(450, 'Reports & files', 'On the agreed schedule')}<text x="320" y="172" ${T} font-size="12" fill="#fff" opacity=".6" text-anchor="middle">Scope, deliverables and timelines agreed up front</text></svg>`;
}
/* Generic panel illustration (variants 0-3). */
export function panelArt(v = 0, label = 'Illustration of financial reports and charts') {
  const b = [[60, 150, 40], [120, 110, 80], [180, 130, 60], [240, 80, 110], [300, 95, 95]];
  const rows = Array.from({ length: 6 }, (_, i) => `<rect x="40" y="${250 + i * 18}" width="${v % 2 ? 120 + (i * 37) % 90 : 180 - (i * 29) % 80}" height="6" rx="3" fill="#fff" opacity=".22"/><rect x="${v % 2 ? 300 : 340}" y="${250 + i * 18}" width="40" height="6" rx="3" fill="#C9A24D" opacity=".75"/>`).join('');
  return `<svg viewBox="0 0 420 380" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid slice"><defs><pattern id="pg${v}" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#fff" stroke-opacity=".06"/></pattern></defs><rect width="420" height="380" fill="#0B1F3B"/><rect width="420" height="380" fill="url(#pg${v})"/><rect x="28" y="28" width="364" height="190" rx="6" fill="#14304F" stroke="#fff" stroke-opacity=".12"/>${b.map(([x, y, h], i) => `<rect x="${x + 10}" y="${200 - h - (v * 6 * (i % 2))}" width="34" height="${h + v * 6 * (i % 2)}" rx="2" fill="${i === 3 ? '#C9A24D' : '#fff'}" opacity="${i === 3 ? 1 : 0.85}"/>`).join('')}<rect x="28" y="232" width="364" height="124" rx="6" fill="#14304F" stroke="#fff" stroke-opacity=".12"/>${rows}<circle cx="352" cy="64" r="16" fill="none" stroke="#C9A24D" stroke-width="2"/><path d="M345 64l5 5 9-10" fill="none" stroke="#C9A24D" stroke-width="2.500" stroke-linecap="round"/></svg>`;
}
