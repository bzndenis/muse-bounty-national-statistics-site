// NusaData — charts. Small SVG builders, no libraries: vertical bars,
// a line chart, horizontal bars and a donut. All values come from data.js.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const fmt = (v) => String(v).replace('.', ',');

// Vertical bar chart. Handles negative values (2020 GDP growth).
export function barChart(years, values, { unit = '', color = '#0e7490', negColor = '#b45309', height = 260, decimals = 2 } = {}) {
  const w = 640;
  const h = height;
  const padL = 52;
  const padB = 28;
  const padT = 14;
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const iw = w - padL - 16;
  const ih = h - padT - padB;
  const y0 = padT + ((max / span) * ih); // pixel row of value 0
  const bw = Math.min(56, (iw / values.length) * 0.58);
  const step = iw / values.length;
  let bars = '';
  let labels = '';
  values.forEach((v, i) => {
    const x = padL + i * step + (step - bw) / 2;
    const y = padT + (((max - v) / span) * ih);
    const bh = Math.max(2, Math.abs(y - y0));
    const top = Math.min(y, y0);
    bars += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${v < 0 ? negColor : color}"><title>${years[i]}: ${fmt(v.toFixed(decimals))} ${unit}</title></rect>`;
    bars += `<text x="${(x + bw / 2).toFixed(1)}" y="${(top - 5).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">${fmt(v.toFixed(decimals))}</text>`;
    labels += `<text x="${(padL + i * step + step / 2).toFixed(1)}" y="${(h - 8).toFixed(1)}" text-anchor="middle" font-size="12" fill="#64748b">${years[i]}</text>`;
  });
  const grid = [0, 0.5, 1].map((f) => {
    const gv = max - f * span;
    const gy = padT + f * ih;
    return `<line x1="${padL}" y1="${gy.toFixed(1)}" x2="${w - 16}" y2="${gy.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/><text x="${padL - 8}" y="${(gy + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#94a3b8">${fmt(gv.toFixed(0))}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Bar chart" style="width:100%;height:auto;display:block">${grid}<line x1="${padL}" y1="${y0.toFixed(1)}" x2="${w - 16}" y2="${y0.toFixed(1)}" stroke="#94a3b8" stroke-width="1"/>${bars}${labels}</svg>`;
}

// Line chart with dots and value labels.
export function lineChart(years, values, { unit = '', color = '#0e7490', height = 260, decimals = 1 } = {}) {
  const w = 640;
  const h = height;
  const padL = 52;
  const padB = 28;
  const padT = 18;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = (max - min) * 1.25 || 1;
  const lo = min - span * 0.1;
  const hi = max + span * 0.1;
  const iw = w - padL - 16;
  const ih = h - padT - padB;
  const px = (i) => padL + (i / (values.length - 1)) * iw;
  const py = (v) => padT + (((hi - v) / (hi - lo)) * ih);
  const pts = values.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const dots = values.map((v, i) => `<circle cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="4.5" fill="#fff" stroke="${color}" stroke-width="2.5"><title>${years[i]}: ${fmt(v.toFixed(decimals))} ${unit}</title></circle><text x="${px(i).toFixed(1)}" y="${(py(v) - 11).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">${fmt(v.toFixed(decimals))}</text>`).join('');
  const labels = years.map((y, i) => `<text x="${px(i).toFixed(1)}" y="${h - 8}" text-anchor="middle" font-size="12" fill="#64748b">${y}</text>`).join('');
  const grid = [0, 0.5, 1].map((f) => {
    const gy = padT + f * ih;
    return `<line x1="${padL}" y1="${gy.toFixed(1)}" x2="${w - 16}" y2="${gy.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Line chart" style="width:100%;height:auto;display:block">${grid}<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${dots}${labels}</svg>`;
}

// Horizontal bars: label on the left, bar, value on the right.
export function hBars(items, { unit = '', color = '#0e7490', maxValue = null } = {}) {
  const max = maxValue ?? Math.max(...items.map((d) => d.value));
  const rows = items.map((d) => {
    const pct = Math.max(1.5, (d.value / max) * 100);
    return `<div class="hbar-row"><span class="hbar-label">${esc(d.label)}</span><span class="hbar-track"><span class="hbar-fill" style="width:${pct.toFixed(1)}%;background:${color}"></span></span><span class="hbar-value">${fmt(d.value.toFixed(d.decimals ?? 1))} ${unit}</span></div>`;
  }).join('');
  return `<div class="hbars">${rows}</div>`;
}

// Donut: shares that add to 100.
export function donut(parts, { size = 220, colors = ['#0e7490', '#f59e0b', '#64748b'] } = {}) {
  const r = 80;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const segs = parts.map((p, i) => {
    const len = (p.share / 100) * c;
    const s = `<circle cx="110" cy="110" r="${r}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="34" stroke-dasharray="${len.toFixed(1)} ${(c - len).toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}"><title>${esc(p.label)}: ${fmt(p.share.toFixed(1))}%</title></circle>`;
    offset += len;
    return s;
  }).join('');
  const biggest = parts.reduce((a, b) => (b.share > a.share ? b : a), parts[0]);
  const legend = parts.map((p, i) => `<li><span class="swatch" style="background:${colors[i % colors.length]}"></span>${esc(p.label)} — <strong>${fmt(p.share.toFixed(1))}%</strong> <span class="muted">${esc(p.note || '')}</span></li>`).join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 220 220" width="${size}" height="${size}" role="img" aria-label="Donut chart"><g transform="rotate(-90 110 110)">${segs}</g><text x="110" y="106" text-anchor="middle" font-size="26" font-weight="700" fill="#0f172a">${fmt(biggest.share.toFixed(1))}%</text><text x="110" y="128" text-anchor="middle" font-size="12" fill="#64748b">${esc(biggest.note || '')}</text></svg><ul class="legend">${legend}</ul></div>`;
}
