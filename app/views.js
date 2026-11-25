// NusaData — page templates. Each function returns the HTML for one route.
// Interactive pages (economy chart switcher, provinces explorer, indicator
// search, release filter) render their shell here; main.js and explorer.js
// wire the controls after the HTML is on screen.

import { HEADLINES, SERIES, AGE_GROUPS, INDICATORS, RELEASES, SOURCES, PROVINCES, REGIONS, META } from './data.js';
import { barChart, lineChart, hBars, donut } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const fmtNum = (v, d = 1) => String(Number(v).toFixed(d)).replace('.', ',');

export function navLink(route, label, current) {
  return `<a href="${route}"${route === current ? ' aria-current="page" class="active"' : ''}>${label}</a>`;
}

export function pageHead(title, intro) {
  return `<p class="crumb"><a href="#/">NusaData</a> / ${esc(title)}</p><h1>${esc(title)}</h1><p class="lede">${esc(intro)}</p>`;
}

function headlineCards() {
  return HEADLINES.map((h) => `<a class="card stat" href="${h.route}">
    <span class="stat-label">${esc(h.label)}</span>
    <span class="stat-value">${esc(h.value)}</span>
    <span class="stat-sub">${esc(h.sub)}</span>
    <span class="stat-change">${esc(h.change)}</span>
  </a>`).join('');
}

function latestReleases(n = 4) {
  const items = RELEASES.filter((r) => r.status === 'Published').slice(0, n);
  return `<ul class="release-list">${items.map((r) => `<li><span class="rel-date">${esc(r.date)}</span><a href="#/releases">${esc(r.title)}</a><span class="badge pub">Published</span></li>`).join('')}</ul>`;
}

export function home() {
  const top5 = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 5)
    .map((p) => ({ label: p.name, value: p.pop, decimals: 1 }));
  return `
  <section class="hero">
    <p class="eyebrow">Indonesia in numbers · Unofficial statistics portal</p>
    <h1>Indonesia, measured.</h1>
    <p class="lede">Population, the economy, prices, work and welfare — the headline figures for 281.6 million people, from published BPS releases, in one place. Updated ${esc(META.updated)}.</p>
    <p class="hero-links"><a class="btn" href="#/economy">Explore the economy</a> <a class="btn ghost" href="#/provinces">Browse all 38 provinces</a></p>
  </section>
  <section aria-label="Headline indicators"><div class="grid stats">${headlineCards()}</div></section>
  <section class="duo">
    <article class="panel"><h2><a href="#/economy">GDP growth, 2019–2024</a></h2>
      <p class="muted">Real GDP, % change on the previous year. The 2020 contraction was the pandemic year.</p>
      ${barChart(SERIES.years, SERIES.gdpGrowth.values, { unit: '%' })}
      <p class="src">Source: BPS, Economic Growth of Indonesia 2024.</p></article>
    <article class="panel"><h2><a href="#/people">Population, 2019–2024</a></h2>
      <p class="muted">Mid-year population, millions. The 2020 census counted 270.2 million people.</p>
      ${lineChart(SERIES.years, SERIES.population.values, { unit: 'jt' })}
      <p class="src">Source: BPS, Population Census 2020 and mid-year estimates.</p></article>
  </section>
  <section class="duo">
    <article class="panel"><h2><a href="#/provinces">Largest provinces</a></h2>
      <p class="muted">Population, millions, mid-2024 estimate. Java holds about 55% of all Indonesians.</p>
      ${hBars(top5, { unit: 'jt' })}
      <p><a href="#/provinces">See all 38 provinces &rarr;</a></p></article>
    <article class="panel"><h2><a href="#/releases">Latest releases</a></h2>
      ${latestReleases(4)}
      <p><a href="#/releases">Full release calendar &rarr;</a></p></article>
  </section>
  <section class="panel"><h2>Start exploring</h2>
    <div class="grid trio">
      <a class="card link-card" href="#/economy"><strong>Economy</strong><span>GDP, inflation, trade, reserves and the rupiah.</span></a>
      <a class="card link-card" href="#/people"><strong>People</strong><span>Population, age structure, work, poverty and welfare.</span></a>
      <a class="card link-card" href="#/indicators"><strong>Indicators A–Z</strong><span>Every headline figure on this site, searchable.</span></a>
    </div></section>`;
}

export function economy() {
  const metrics = [
    { key: 'gdpGrowth', label: 'GDP growth' },
    { key: 'gdpNominal', label: 'GDP nominal' },
    { key: 'inflation', label: 'Inflation' },
    { key: 'exports', label: 'Exports' },
    { key: 'imports', label: 'Imports' },
  ];
  const buttons = metrics.map((m, i) => `<button type="button" class="chip-btn${i === 0 ? ' on' : ''}" data-metric="${m.key}">${m.label}</button>`).join('');
  return `
  ${pageHead('Economy', 'How the economy is doing: growth, prices, trade and the rupiah — six years of published figures, 2019–2024.')}
  <section class="panel"><h2 id="chart-title">GDP growth (% yoy)</h2>
    <div class="controls" role="group" aria-label="Choose indicator">${buttons}</div>
    <div id="econ-chart">${barChart(SERIES.years, SERIES.gdpGrowth.values, { unit: '%' })}</div>
    <div id="econ-table"></div>
    <p class="src">Source: BPS — GDP growth and national accounts; inflation from the Consumer Price Index; trade from BPS foreign trade statistics.</p></section>
  <section class="duo">
    <article class="panel"><h2>Trade: exports vs imports</h2>
      <p class="muted">US$ billion. Indonesia has run a trade surplus every year since 2020.</p>
      ${lineChart(SERIES.years, SERIES.exports.values, { unit: 'US$ M', color: '#0e7490' })}
      <p class="muted">Imports, same years:</p>
      ${lineChart(SERIES.years, SERIES.imports.values, { unit: 'US$ M', color: '#b45309' })}
      <p class="src">Source: BPS foreign trade statistics, 2024.</p></article>
    <article class="panel"><h2>Money in 2024</h2>
      <dl class="facts">
        <dt>GDP</dt><dd>Rp 22,139 trillion</dd>
        <dt>GDP per capita</dt><dd>Rp 78.6 million (± US$ 4,960)</dd>
        <dt>Inflation (Dec, yoy)</dt><dd>1.57% — inside the 2.5% ± 1% target</dd>
        <dt>Exports</dt><dd>US$ 264.7 billion</dd>
        <dt>Imports</dt><dd>US$ 233.7 billion</dd>
        <dt>Trade balance</dt><dd>US$ 31.0 billion surplus</dd>
        <dt>Foreign reserves</dt><dd>US$ 155.7 billion (end 2024)</dd>
        <dt>Rupiah / US$</dt><dd>Rp 16,162 (end 2024)</dd>
        <dt>Foreign visitors</dt><dd>13.9 million</dd>
        <dt>Rice production</dt><dd>30.3 million tonnes</dd>
      </dl>
      <p class="src">Sources: BPS; Bank Indonesia (reserves, exchange rate).</p></article>
  </section>`;
}

export function people() {
  return `
  ${pageHead('People', 'Who lives in Indonesia, how old they are, how they work and how they live — 281.6 million people across 38 provinces.')}
  <section class="duo">
    <article class="panel"><h2>Population, 2019–2024</h2>
      <p class="muted">Millions, mid-year. Growth has slowed to about 0.9% a year.</p>
      ${lineChart(SERIES.years, SERIES.population.values, { unit: 'jt' })}
      <p class="src">Source: BPS, Population Census 2020 and mid-year estimates.</p></article>
    <article class="panel"><h2>Age structure, 2024</h2>
      <p class="muted">Share of the population. Seven in ten Indonesians are of working age.</p>
      ${donut(AGE_GROUPS)}
      <p class="src">Source: BPS, 2024 population estimates (rounded).</p></article>
  </section>
  <section class="duo">
    <article class="panel"><h2>Unemployment &amp; poverty</h2>
      <p class="muted">Both fell back below their pre-pandemic levels by 2024.</p>
      ${barChart(SERIES.years, SERIES.unemployment.values, { unit: '%' })}
      <p class="muted">Unemployment rate, % (August each year).</p>
      ${barChart(SERIES.years, SERIES.poverty.values, { unit: '%', color: '#b45309' })}
      <p class="muted">Poverty rate, % (September each year).</p>
      <p class="src">Source: BPS — labour force surveys; poverty profiles.</p></article>
    <article class="panel"><h2>Human development</h2>
      <p class="muted">The Human Development Index rose every year from 2021 to 2024.</p>
      ${barChart(SERIES.years, SERIES.hdi.values, { unit: '', color: '#166534' })}
      <dl class="facts">
        <dt>HDI 2024</dt><dd>75.02</dd>
        <dt>Life expectancy</dt><dd>74.2 years (2024)</dd>
        <dt>Literacy (15+)</dt><dd>96.5% (2024)</dd>
        <dt>Median age</dt><dd>30.5 years (2024)</dd>
        <dt>Internet users</dt><dd>221.6 million — 79.5% of the population (APJII, 2024)</dd>
        <dt>Gini ratio</dt><dd>0.381 (Sep 2024)</dd>
      </dl>
      <p class="src">Sources: BPS, Human Development Index 2024; APJII survey 2024.</p></article>
  </section>`;
}

export function provincesShell() {
  const chips = REGIONS.map((r, i) => `<button type="button" class="chip-btn${i === 0 ? ' on' : ''}" data-region="${esc(r)}">${esc(r)}</button>`).join('');
  const options = PROVINCES.map((p) => `<option value="${esc(p.name)}">${esc(p.name)}</option>`).join('');
  return `
  ${pageHead('Provinces', 'All 38 provinces: population, land area, density and capital. Search, filter by region, sort the table, or compare two provinces side by side. Figures are mid-2024 estimates, rounded.')}
  <section class="panel"><h2>Find a province</h2>
    <div class="controls">
      <label class="search-label">Search <input id="prov-search" type="search" placeholder="Type a province or capital…" autocomplete="off"></label>
      <label class="search-label">Sort by
        <select id="prov-sort">
          <option value="pop-desc">Population: largest first</option>
          <option value="pop-asc">Population: smallest first</option>
          <option value="density-desc">Density: highest first</option>
          <option value="area-desc">Area: largest first</option>
          <option value="name-asc">Name: A–Z</option>
        </select></label>
    </div>
    <div class="controls" role="group" aria-label="Filter by region">${chips}</div>
    <p class="muted" id="prov-count"></p>
    <div class="table-wrap"><table id="prov-table">
      <thead><tr><th>Province</th><th>Region</th><th>Capital</th><th class="num">Population (jt)</th><th class="num">Area (1,000 km²)</th><th class="num">Density (/km²)</th></tr></thead>
      <tbody id="prov-body"></tbody>
    </table></div>
    <p class="src">Population: BPS mid-2024 estimates, rounded to 0.1 million. Density = population ÷ land area. Tap a row to see the province in detail.</p>
    <div id="prov-detail" aria-live="polite"></div>
  </section>
  <section class="panel"><h2>Compare two provinces</h2>
    <div class="controls">
      <label class="search-label">First <select id="cmp-a">${options}</select></label>
      <label class="search-label">Second <select id="cmp-b">${options}</select></label>
    </div>
    <div id="cmp-result" aria-live="polite"></div>
  </section>`;
}

export function indicators() {
  return `
  ${pageHead('Indicators A–Z', 'Every headline figure on this site in one searchable list. Click a row to open its section.')}
  <section class="panel">
    <div class="controls">
      <label class="search-label">Search indicators <input id="ind-search" type="search" placeholder="Try “inflation”, “poverty”, “exports”…" autocomplete="off"></label>
      <span class="chip-group" role="group" aria-label="Filter by topic">
        <button type="button" class="chip-btn on" data-topic="All">All</button>
        <button type="button" class="chip-btn" data-topic="Economy">Economy</button>
        <button type="button" class="chip-btn" data-topic="People">People</button>
      </span>
    </div>
    <p class="muted" id="ind-count"></p>
    <div class="table-wrap"><table>
      <thead><tr><th>Indicator</th><th>Value</th><th>Year</th><th>Topic</th></tr></thead>
      <tbody id="ind-body"></tbody>
    </table></div>
  </section>`;
}

export function releases() {
  return `
  ${pageHead('Release calendar', 'When the figures on this site were — and will be — published. Dates follow the regular BPS release rhythm.')}
  <section class="panel">
    <div class="controls" role="group" aria-label="Filter releases">
      <button type="button" class="chip-btn on" data-rel="All">All releases</button>
      <button type="button" class="chip-btn" data-rel="Published">Published</button>
      <button type="button" class="chip-btn" data-rel="Scheduled">Scheduled</button>
      <button type="button" class="chip-btn" data-rel="Economy">Economy</button>
      <button type="button" class="chip-btn" data-rel="People">People</button>
    </div>
    <ul class="release-list" id="rel-list"></ul>
  </section>`;
}

export function about() {
  const srcs = SOURCES.map((s) => `<li><strong>${esc(s.name)}</strong> — ${esc(s.detail)}</li>`).join('');
  return `
  ${pageHead('About & sources', 'What NusaData is, where its numbers come from, and what it is not.')}
  <section class="panel"><h2>What this site is</h2>
    <p>NusaData is an unofficial statistics portal built as a demonstration: it gathers Indonesia's headline figures — population, the economy, prices, work and welfare — from published releases and presents them as browsable pages, charts and tables. It runs entirely from its own files, with no network requests, on desktop and on phones.</p>
    <p>It is <strong>not</strong> affiliated with BPS (Statistics Indonesia) or any government body, and it is not a source of official statistics. For official figures, see the publications below.</p>
    <h2>Sources</h2>
    <ul class="src-list">${srcs}</ul>
    <h2>How the figures are shown</h2>
    <ul>
      <li>Every series carries its year. A figure labelled 2024 is the latest published annual figure for that series at the time this site was built (26 November 2026).</li>
      <li>Province populations are mid-2024 estimates rounded to the nearest 100,000; densities are computed from those rounded figures and the rounded land area.</li>
      <li>Money is in rupiah unless a figure says US$. “jt” means million, “T” means trillion, “M” means billion (miliar).</li>
      <li>Charts are drawn from the same data files as the tables, so a chart and its table can never disagree.</li>
    </ul>
    <h2>Contact &amp; corrections</h2>
    <p>Spotted a figure that has been superseded? The newest BPS release for a series always wins over this page. Corrections are welcome — check the release calendar for the latest publication first.</p>
  </section>`;
}

export function notFound() {
  return `<h1>Page not found</h1><p class="lede">There is no page at this address. Try the <a href="#/">home page</a>, the <a href="#/indicators">indicator index</a> or the <a href="#/provinces">province explorer</a>.</p>`;
}
