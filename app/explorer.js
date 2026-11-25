// NusaData — the interactive pages. Each init function wires one route's
// controls after views.js has put its shell on screen. All state lives in
// the page; nothing is fetched over the network.

import { SERIES, PROVINCES, INDICATORS, RELEASES } from './data.js';
import { barChart, lineChart } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const fmt = (v, d = 1) => String(Number(v).toFixed(d)).replace('.', ',');
const density = (p) => (p.pop * 1e6) / p.area;

function on(id, event, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, fn);
  return el;
}

// ---- Economy: switch the chart between indicators -----------------------
export function initEconomy() {
  const chart = document.getElementById('econ-chart');
  const table = document.getElementById('econ-table');
  const title = document.getElementById('chart-title');
  if (!chart) return;
  const draw = (key) => {
    const s = SERIES[key];
    const useLine = key === 'exports' || key === 'imports';
    title.textContent = s.label;
    chart.innerHTML = useLine
      ? lineChart(SERIES.years, s.values, { unit: s.unit })
      : barChart(SERIES.years, s.values, { unit: s.unit });
    table.innerHTML = `<div class="table-wrap"><table><thead><tr>${SERIES.years.map((y) => `<th class="num">${y}</th>`).join('')}</tr></thead><tbody><tr>${s.values.map((v) => `<td class="num">${fmt(v, key === 'gdpNominal' ? 0 : 2)}</td>`).join('')}</tr></tbody></table></div><p class="muted">${esc(s.label)} — ${esc(s.unit)}. Same data as the chart above.</p>`;
  };
  document.querySelectorAll('[data-metric]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-metric]').forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      draw(btn.dataset.metric);
    });
  });
  draw('gdpGrowth');
}

// ---- Provinces: search, filter, sort, detail, compare -------------------
export function initProvinces() {
  const body = document.getElementById('prov-body');
  const count = document.getElementById('prov-count');
  const detail = document.getElementById('prov-detail');
  if (!body) return;
  let region = 'All regions';
  let query = '';
  let sort = 'pop-desc';
  let selected = null;

  const filtered = () => {
    let list = PROVINCES.filter((p) => (region === 'All regions' || p.region === region)
      && (p.name.toLowerCase().includes(query) || p.capital.toLowerCase().includes(query)));
    const sorts = {
      'pop-desc': (a, b) => b.pop - a.pop,
      'pop-asc': (a, b) => a.pop - b.pop,
      'density-desc': (a, b) => density(b) - density(a),
      'area-desc': (a, b) => b.area - a.area,
      'name-asc': (a, b) => a.name.localeCompare(b.name),
    };
    return list.sort(sorts[sort] || sorts['pop-desc']);
  };

  const render = () => {
    const list = filtered();
    body.innerHTML = list.map((p) => `<tr data-name="${esc(p.name)}" class="${p.name === selected ? 'sel' : ''}">
      <td><strong>${esc(p.name)}</strong></td><td>${esc(p.region)}</td><td>${esc(p.capital)}</td>
      <td class="num">${fmt(p.pop)}</td><td class="num">${fmt(p.area / 1000)}</td><td class="num">${fmt(density(p), 0)}</td>
    </tr>`).join('') || `<tr><td colspan="6">No province matches “${esc(query)}”. Try clearing the search.</td></tr>`;
    count.textContent = `${list.length} of 38 provinces shown.`;
    body.querySelectorAll('tr[data-name]').forEach((tr) => {
      tr.addEventListener('click', () => {
        selected = tr.dataset.name;
        render();
        showDetail(selected);
      });
    });
  };

  const showDetail = (name) => {
    const p = PROVINCES.find((x) => x.name === name);
    if (!p) { detail.innerHTML = ''; return; }
    const share = ((p.pop / 281.6) * 100);
    const rank = [...PROVINCES].sort((a, b) => b.pop - a.pop).findIndex((x) => x.name === name) + 1;
    detail.innerHTML = `<article class="detail"><h3>${esc(p.name)}</h3>
      <p>Capital <strong>${esc(p.capital)}</strong> · Region <strong>${esc(p.region)}</strong> · Ranked <strong>#${rank} of 38</strong> by population.</p>
      <dl class="facts">
        <dt>Population (mid-2024)</dt><dd>${fmt(p.pop)} million — ${fmt(share, 1)}% of Indonesia</dd>
        <dt>Land area</dt><dd>${fmt(p.area / 1000)} thousand km²</dd>
        <dt>Density</dt><dd>${fmt(density(p), 0)} people per km² (national average: 149)</dd>
      </dl></article>`;
  };

  on('prov-search', 'input', (e) => { query = e.target.value.trim().toLowerCase(); render(); });
  on('prov-sort', 'change', (e) => { sort = e.target.value; render(); });
  document.querySelectorAll('[data-region]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-region]').forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      region = btn.dataset.region;
      render();
    });
  });

  // Compare two provinces.
  const cmpA = document.getElementById('cmp-a');
  const cmpB = document.getElementById('cmp-b');
  const cmpResult = document.getElementById('cmp-result');
  const cmpRow = (label, a, b, better) => `<tr><td>${label}</td><td class="num${better === 'a' ? ' win' : ''}">${a}</td><td class="num${better === 'b' ? ' win' : ''}">${b}</td></tr>`;
  const compare = () => {
    if (!cmpA || !cmpB || !cmpResult) return;
    const a = PROVINCES.find((p) => p.name === cmpA.value);
    const b = PROVINCES.find((p) => p.name === cmpB.value);
    if (!a || !b) return;
    if (a.name === b.name) {
      cmpResult.innerHTML = '<p class="muted">Pick two different provinces to compare them.</p>';
      return;
    }
    cmpResult.innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th></th><th class="num">${esc(a.name)}</th><th class="num">${esc(b.name)}</th></tr></thead>
      <tbody>
        ${cmpRow('Population (million)', fmt(a.pop), fmt(b.pop), a.pop > b.pop ? 'a' : 'b')}
        ${cmpRow('Land area (1,000 km²)', fmt(a.area / 1000), fmt(b.area / 1000), a.area > b.area ? 'a' : 'b')}
        ${cmpRow('Density (people/km²)', fmt(density(a), 0), fmt(density(b), 0), density(a) > density(b) ? 'a' : 'b')}
        ${cmpRow('Share of Indonesia', `${fmt((a.pop / 281.6) * 100, 1)}%`, `${fmt((b.pop / 281.6) * 100, 1)}%`, a.pop > b.pop ? 'a' : 'b')}
        <tr><td>Capital</td><td class="num">${esc(a.capital)}</td><td class="num">${esc(b.capital)}</td></tr>
        <tr><td>Region</td><td class="num">${esc(a.region)}</td><td class="num">${esc(b.region)}</td></tr>
      </tbody></table></div>
      <p class="muted">The larger figure in each row is highlighted. ${esc(a.name)} is ${fmt(a.pop / b.pop, 1)}× the population of ${esc(b.name)}.</p>`;
  };
  if (cmpA && cmpB) {
    cmpA.value = 'West Java';
    cmpB.value = 'Jakarta';
    cmpA.addEventListener('change', compare);
    cmpB.addEventListener('change', compare);
    compare();
  }
  render();
}

// ---- Indicators: live search + topic filter ------------------------------
export function initIndicators() {
  const body = document.getElementById('ind-body');
  const count = document.getElementById('ind-count');
  if (!body) return;
  let query = '';
  let topic = 'All';
  const render = () => {
    const list = INDICATORS.filter((d) => (topic === 'All' || d.topic === topic)
      && d.name.toLowerCase().includes(query));
    body.innerHTML = list.map((d) => `<tr><td><a href="${d.route}"><strong>${esc(d.name)}</strong></a></td><td>${esc(d.value)}</td><td>${esc(d.year)}</td><td>${esc(d.topic)}</td></tr>`).join('')
      || `<tr><td colspan="4">No indicator matches “${esc(query)}”.</td></tr>`;
    count.textContent = `${list.length} of ${INDICATORS.length} indicators shown.`;
  };
  on('ind-search', 'input', (e) => { query = e.target.value.trim().toLowerCase(); render(); });
  document.querySelectorAll('[data-topic]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-topic]').forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      topic = btn.dataset.topic;
      render();
    });
  });
  render();
}

// ---- Releases: filter -----------------------------------------------------
export function initReleases() {
  const list = document.getElementById('rel-list');
  if (!list) return;
  const render = (mode) => {
    const items = RELEASES.filter((r) => mode === 'All' || r.status === mode || r.topic === mode);
    list.innerHTML = items.map((r) => `<li><span class="rel-date">${esc(r.date)}</span><span>${esc(r.title)}</span><span class="badge ${r.status === 'Published' ? 'pub' : 'sched'}">${esc(r.status)}</span><span class="muted">${esc(r.topic)}</span></li>`).join('')
      || '<li>No releases in this group.</li>';
  };
  document.querySelectorAll('[data-rel]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-rel]').forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      render(btn.dataset.rel);
    });
  });
  render('All');
}
