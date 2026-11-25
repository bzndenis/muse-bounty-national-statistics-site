// NusaData — router. Hash routes, one page each; the shell (header, nav,
// footer) is static in index.html and only #app is re-rendered.
//
//   #/                home
//   #/economy         the economy in six years of figures
//   #/people          population, work and welfare
//   #/provinces       all 38 provinces, searchable and comparable
//   #/indicators      every headline figure, searchable
//   #/releases        release calendar
//   #/about           sources and method
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { home, economy, people, provincesShell, indicators, releases, about, notFound, navLink } from './views.js';
import { initEconomy, initProvinces, initIndicators, initReleases } from './explorer.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');

const ROUTES = [
  { route: '#/', label: 'Home', render: home },
  { route: '#/economy', label: 'Economy', render: economy, init: initEconomy },
  { route: '#/people', label: 'People', render: people },
  { route: '#/provinces', label: 'Provinces', render: provincesShell, init: initProvinces },
  { route: '#/indicators', label: 'Indicators', render: indicators, init: initIndicators },
  { route: '#/releases', label: 'Releases', render: releases, init: initReleases },
  { route: '#/about', label: 'About', render: about },
];

function currentRoute() {
  const hash = location.hash || '#/';
  const found = ROUTES.find((r) => r.route === hash.split('?')[0]);
  return found || null;
}

function render() {
  window.__shotReady = false;
  const page = currentRoute();
  nav.innerHTML = ROUTES.map((r) => navLink(r.route, r.label, page ? page.route : '')).join('');
  if (page) {
    document.title = `${page.label === 'Home' ? 'NusaData — Indonesia in Numbers' : `${page.label} | NusaData`}`;
    app.innerHTML = page.render();
    if (page.init) page.init();
  } else {
    document.title = 'Not found | NusaData';
    app.innerHTML = notFound();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
