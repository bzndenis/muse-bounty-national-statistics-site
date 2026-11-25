#!/usr/bin/env node
// NusaData verification + screenshots over the Chrome DevTools Protocol
// (Node 22 built-ins only: fetch + WebSocket, no packages). Serves app/ on
// a local port, drives headless Chromium, and:
//   - collects console errors and every network request on each route
//   - clicks every control (metric switcher, region chips, sort, search,
//     compare selects, indicator search, release filter, province row)
//   - asserts the expected DOM changes after each interaction
//   - takes 4 real screenshots of the site's own code
// Usage: node tools/verify.mjs [--shots] [--port 8932]
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const entry = join(here, '..');
const appDir = join(entry, 'app');
const shotDir = join(entry, 'screenshots');
const chrome = `${process.env.HOME}/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome`;
const PORT = Number(process.env.PORT || 8932);
const takeShots = process.argv.includes('--shots');

const SHOTS = [
  { name: '1-home.jpg', hash: '#/', width: 1280, height: 800 },
  { name: '2-economy.jpg', hash: '#/economy', width: 1280, height: 800 },
  { name: '3-provinces.jpg', hash: '#/provinces', width: 1280, height: 800 },
  { name: '4-phone.jpg', hash: '#/', width: 390, height: 844 },
];

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

function serve() {
  return spawn('python3', ['-m', 'http.server', String(PORT), '--directory', appDir], { stdio: 'ignore' });
}
async function waitForServer() {
  for (let i = 0; i < 50; i += 1) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/index.html`); if (r.ok) return; } catch { /* retry */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('static server did not come up');
}

async function launchChrome() {
  const proc = spawn(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu',
    `--remote-debugging-port=9333`, '--user-data-dir=/tmp/nusadata-chrome-profile', 'about:blank'],
    { stdio: 'ignore' });
  for (let i = 0; i < 50; i += 1) {
    try { const r = await fetch('http://127.0.0.1:9333/json/version'); if (r.ok) return proc; } catch { /* retry */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('chrome did not come up');
}

async function newTab() {
  const r = await fetch('http://127.0.0.1:9333/json/new?about:blank', { method: 'PUT' });
  const t = await r.json();
  return t;
}

class CDP {
  constructor(wsUrl) { this.ws = new WebSocket(wsUrl); this.id = 0; this.pending = new Map(); this.events = []; }
  async open() {
    await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; });
    this.ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id && this.pending.has(d.id)) { this.pending.get(d.id)(d); this.pending.delete(d.id); }
      else if (d.method) this.events.push(d);
    };
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res) => { this.pending.set(id, res); this.ws.send(JSON.stringify({ id, method, params })); });
  }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.result?.exceptionDetails) throw new Error('eval failed: ' + JSON.stringify(r.result.exceptionDetails).slice(0, 400));
    return r.result?.result?.value;
  }
  close() { this.ws.close(); }
}

async function shotToJpeg(pngB64, jpgPath, width, height) {
  const pngPath = jpgPath.replace(/\.jpg$/, '.png');
  writeFileSync(pngPath, Buffer.from(pngB64, 'base64'));
  try {
    execFileSync('python3', ['-c',
      'import sys; from PIL import Image; im = Image.open(sys.argv[1]).convert("RGB"); '
      + `im = im.crop((0, 0, ${width}, ${height})); im.save(sys.argv[2], "JPEG", quality=88, optimize=True)`,
      pngPath, jpgPath], { stdio: 'pipe' });
  } catch {
    execFileSync('ffmpeg', ['-y', '-i', pngPath, '-q:v', '4', jpgPath], { stdio: 'pipe' });
  }
  const { unlinkSync } = await import('node:fs');
  unlinkSync(pngPath);
}

const server = serve();
let chromeProc = null;
try {
  await waitForServer();
  chromeProc = await launchChrome();
  const tab = await newTab();
  const cdp = new CDP(tab.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });

  const goto = async (hash) => {
    cdp.events.length = 0;
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html${hash}` });
    for (let i = 0; i < 60; i += 1) {
      const ready = await cdp.eval('window.__shotReady === true').catch(() => false);
      if (ready) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    await new Promise((r) => setTimeout(r, 150));
    const errors = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown' || (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error'));
    const requests = cdp.events.filter((e) => e.method === 'Network.requestWillBeSent').map((e) => e.params.request.url);
    return { errors, requests };
  };

  // ---- every route loads, no console errors, only local requests --------
  for (const route of ['#/', '#/economy', '#/people', '#/provinces', '#/indicators', '#/releases', '#/about', '#/nope']) {
    const { errors, requests } = await goto(route);
    const external = requests.filter((u) => !u.startsWith(`http://127.0.0.1:${PORT}`) && !u.startsWith('data:'));
    check(`route ${route} loads without console errors`, errors.length === 0, errors.length ? JSON.stringify(errors).slice(0, 300) : `${requests.length} local requests`);
    check(`route ${route} makes no external request`, external.length === 0, external.join(', '));
  }

  // ---- home content ------------------------------------------------------
  await goto('#/');
  check('home shows 8 headline cards', (await cdp.eval(`document.querySelectorAll('.stat').length`)) === 8);
  check('home shows 2 charts', (await cdp.eval(`document.querySelectorAll('#app svg').length`)) >= 2);
  check('home latest releases listed', (await cdp.eval(`document.querySelectorAll('.release-list li').length`)) === 4);
  check('home has no placeholder text', (await cdp.eval(`/lorem|placeholder|TODO|XXX/i.test(document.body.innerText)`)) === false);

  // ---- economy switcher ---------------------------------------------------
  await goto('#/economy');
  const before = await cdp.eval(`document.getElementById('chart-title').textContent`);
  await cdp.eval(`[...document.querySelectorAll('[data-metric]')].find(b=>b.dataset.metric==='inflation').click()`);
  const after = await cdp.eval(`document.getElementById('chart-title').textContent`);
  check('economy metric switcher changes chart', before !== after && after.includes('Inflation'), `${before} -> ${after}`);
  check('economy table follows the chart', (await cdp.eval(`document.querySelectorAll('#econ-table td').length`)) === 6);
  await cdp.eval(`[...document.querySelectorAll('[data-metric]')].find(b=>b.dataset.metric==='imports').click()`);
  check('economy imports view renders', (await cdp.eval(`document.getElementById('chart-title').textContent`)).includes('Imports'));

  // ---- provinces explorer --------------------------------------------------
  await goto('#/provinces');
  check('provinces table shows 38 rows', (await cdp.eval(`document.querySelectorAll('#prov-body tr').length`)) === 38);
  await cdp.eval(`const ps=document.getElementById('prov-search'); ps.value='java'; ps.dispatchEvent(new Event('input',{bubbles:true}))`);
  check('province search filters', (await cdp.eval(`document.querySelectorAll('#prov-body tr').length`)) === 3, 'West/Central/East Java');
  await cdp.eval(`const ps2=document.getElementById('prov-search'); ps2.value=''; ps2.dispatchEvent(new Event('input',{bubbles:true}))`);
  await cdp.eval(`[...document.querySelectorAll('[data-region]')].find(b=>b.dataset.region==='Java').click()`);
  check('region filter shows Java only', (await cdp.eval(`document.querySelectorAll('#prov-body tr').length`)) === 6);
  await cdp.eval(`[...document.querySelectorAll('[data-region]')].find(b=>b.dataset.region==='All regions').click()`);
  await cdp.eval(`const sortSel=document.getElementById('prov-sort'); sortSel.value='density-desc'; sortSel.dispatchEvent(new Event('change',{bubbles:true}))`);
  check('sort by density puts Jakarta first', (await cdp.eval(`document.querySelector('#prov-body tr td').textContent`)) === 'Jakarta');
  await cdp.eval(`document.querySelector('#prov-body tr').click()`);
  check('clicking a row shows detail', (await cdp.eval(`document.getElementById('prov-detail').innerText.includes('Jakarta')`)) === true);
  await cdp.eval(`const cmpAel=document.getElementById('cmp-a'); cmpAel.value='West Java'; cmpAel.dispatchEvent(new Event('change',{bubbles:true})); const cmpBel=document.getElementById('cmp-b'); cmpBel.value='Papua'; cmpBel.dispatchEvent(new Event('change',{bubbles:true}))`);
  check('compare shows both provinces', (await cdp.eval(`document.getElementById('cmp-result').innerText.includes('West Java') && document.getElementById('cmp-result').innerText.includes('Papua')`)) === true);

  // ---- indicators search ---------------------------------------------------
  await goto('#/indicators');
  check('indicators list shows all 26', (await cdp.eval(`document.querySelectorAll('#ind-body tr').length`)) === 26);
  await cdp.eval(`const is1=document.getElementById('ind-search'); is1.value='inflation'; is1.dispatchEvent(new Event('input',{bubbles:true}))`);
  check('indicator search narrows to 1', (await cdp.eval(`document.querySelectorAll('#ind-body tr').length`)) === 1);
  await cdp.eval(`[...document.querySelectorAll('[data-topic]')].find(b=>b.dataset.topic==='People').click()`);
  await cdp.eval(`const is2=document.getElementById('ind-search'); is2.value=''; is2.dispatchEvent(new Event('input',{bubbles:true}))`);
  check('indicator topic filter works', (await cdp.eval(`document.querySelectorAll('#ind-body tr').length`)) > 5);

  // ---- releases filter ------------------------------------------------------
  await goto('#/releases');
  const relAll = await cdp.eval(`document.querySelectorAll('#rel-list li').length`);
  await cdp.eval(`[...document.querySelectorAll('[data-rel]')].find(b=>b.dataset.rel==='Scheduled').click()`);
  const relSched = await cdp.eval(`document.querySelectorAll('#rel-list li').length`);
  check('release filter narrows list', relAll === 12 && relSched === 3, `${relAll} -> ${relSched}`);

  // ---- nav links -------------------------------------------------------------
  await goto('#/');
  const navHrefs = await cdp.eval(`[...document.querySelectorAll('#nav a')].map(a=>a.getAttribute('href')).join(',')`);
  check('nav has 7 section links', navHrefs.split(',').length === 7, navHrefs);
  const badLinks = await cdp.eval(`[...document.querySelectorAll('#app a')].filter(a=>{const h=a.getAttribute('href')||''; return h.startsWith('http')}).length`);
  check('no external links in page body', badLinks === 0);

  // ---- screenshots ------------------------------------------------------------
  if (takeShots) {
    mkdirSync(shotDir, { recursive: true });
    for (const s of SHOTS) {
      await cdp.send('Emulation.setDeviceMetricsOverride', { width: s.width, height: s.height, deviceScaleFactor: 1, mobile: s.width < 500 });
      const { errors } = await goto(s.hash);
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const jpgPath = join(shotDir, s.name);
      await shotToJpeg(shot.result.data, jpgPath, s.width, s.height);
      const { statSync } = await import('node:fs');
      const bytes = statSync(jpgPath).size;
      check(`screenshot ${s.name} (${s.width}x${s.height}) under 256 KiB`, bytes <= 262144, `${bytes} bytes, console errors: ${errors.length}`);
    }
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  }

  cdp.close();
} finally {
  if (chromeProc) chromeProc.kill();
  server.kill();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
if (failed.length) { console.log('FAILED: ' + failed.map((f) => f.name).join(' | ')); process.exit(1); }
