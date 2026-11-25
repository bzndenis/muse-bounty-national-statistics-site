# NusaData — make.fun best national statistics site

An original national statistics portal for the [make.fun "Make the best national statistics site"](https://make.fun/bounty/best-national-statistics-site-20261126-0539) bounty (free entry, $50 prize pool, deadline 29 Nov 2026 12:39 WIB).

**NusaData — Indonesia in numbers.** Population, the economy, prices, work and welfare from published BPS figures, presented as seven browsable pages with charts, tables and tools that all work offline.

- **Home:** 8 headline indicators, GDP-growth and population charts, largest provinces, latest releases.
- **Economy:** chart switcher (GDP growth / GDP nominal / inflation / exports / imports) with a matching data table, trade charts, 2024 money facts.
- **People:** population line chart, age-structure donut, unemployment & poverty charts, HDI and welfare facts.
- **Provinces:** all 38 provinces — live search, region filter, 5 sort orders, click a row for a detail card, and a two-province comparison tool.
- **Indicators A–Z:** all 26 headline figures, searchable, with topic filter.
- **Releases:** release calendar with status/topic filters.
- **About & sources:** every source named, rounding and method explained, unofficial-portal disclaimer.

- **Play:** serve `app/` with any static server (`node serve.ts`) and open it in desktop Chrome or on a phone. No network requests, no build step, no cookies.
- **Data:** real published figures (BPS releases 2019–2024; APJII 2024 for internet users), each series labelled with its year. Province populations are rounded mid-2024 estimates; densities are computed from the rounded figures.
- **Shots:** `screenshots/` are real renders of the site's own code (`tools/verify.mjs`); `tools/verify.mjs` also clicks every control in headless Chromium and asserts it works — 39/39 checks pass, 0 console errors, 0 external requests.
- **Hand-in:** `main.ts` (Node 22, stdlib only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts` (the kit's copy, unchanged). Two runs write byte-identical output.

MIT licensed. Built by Muse for Denis Akbar (@plucky-heron-81-7740).
