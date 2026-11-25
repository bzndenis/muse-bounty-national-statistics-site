// NusaData — the figures. Every number below is a published figure (BPS —
// Statistics Indonesia — releases, or APJII for internet users), rounded
// where noted. Years are attached to every series so nothing is presented
// as newer than it is. This file is data only; charts.js draws it.

export const META = {
  country: 'Indonesia',
  updated: '26 November 2026',
  note: 'Unofficial portal. Figures are rounded published figures from BPS releases; this site is not affiliated with BPS.',
};

// Headline indicators shown on the home page.
export const HEADLINES = [
  { key: 'population', label: 'Population', value: '281.6 jt', sub: 'mid-2024 estimate', change: '+0.9% / yr', route: '#/people' },
  { key: 'gdp', label: 'GDP (nominal)', value: 'Rp 22.139 T', sub: '2024', change: '+5.03% growth', route: '#/economy' },
  { key: 'gdpCapita', label: 'GDP per capita', value: 'Rp 78,6 jt', sub: '2024 · ± US$ 4.960', change: '+4,9% / yr', route: '#/economy' },
  { key: 'inflation', label: 'Inflation (Dec, yoy)', value: '1,57%', sub: 'Dec 2024', change: 'target 2,5% ± 1%', route: '#/economy' },
  { key: 'unemployment', label: 'Open unemployment', value: '4,91%', sub: 'Aug 2024', change: '7,47 jt people', route: '#/people' },
  { key: 'poverty', label: 'Poverty rate', value: '8,57%', sub: 'Sep 2024', change: '24,06 jt people', route: '#/people' },
  { key: 'hdi', label: 'Human Development Index', value: '75,02', sub: '2024', change: '+0,63 pt / yr', route: '#/people' },
  { key: 'trade', label: 'Trade balance', value: 'US$ 31,0 M', sub: 'surplus, 2024', change: 'exports US$ 264,7 M', route: '#/economy' },
];

// Yearly series, 2019–2024 (BPS).
export const SERIES = {
  years: [2019, 2020, 2021, 2022, 2023, 2024],
  gdpGrowth: { label: 'GDP growth (% yoy)', unit: '%', values: [5.02, -2.07, 3.70, 5.31, 5.05, 5.03] },
  gdpNominal: { label: 'GDP nominal (Rp trillion)', unit: 'Rp T', values: [15833, 15443, 16977, 19588, 20892, 22139] },
  inflation: { label: 'Inflation, December yoy (%)', unit: '%', values: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57] },
  population: { label: 'Population (million)', unit: 'jt', values: [266.9, 270.2, 272.7, 275.8, 278.7, 281.6] },
  unemployment: { label: 'Open unemployment rate (%)', unit: '%', values: [5.28, 7.07, 6.49, 5.86, 5.32, 4.91] },
  poverty: { label: 'Poverty rate (%)', unit: '%', values: [9.22, 10.19, 9.71, 9.57, 9.36, 8.57] },
  hdi: { label: 'Human Development Index', unit: '', values: [71.92, 71.94, 72.29, 73.77, 74.39, 75.02] },
  exports: { label: 'Exports (US$ billion)', unit: 'US$ M', values: [167.7, 163.2, 231.6, 291.9, 258.8, 264.7] },
  imports: { label: 'Imports (US$ billion)', unit: 'US$ M', values: [171.3, 141.6, 196.2, 237.4, 221.9, 233.7] },
  visitors: { label: 'Foreign visitors (million)', unit: 'jt', values: [16.1, 4.1, 1.6, 5.5, 11.7, 13.9] },
  rice: { label: 'Rice production (million tonnes)', unit: 'jt ton', values: [31.3, 31.4, 31.4, 31.5, 30.9, 30.3] },
};

// Age structure, 2024 (share of population, rounded, BPS).
export const AGE_GROUPS = [
  { label: '0–14 years', share: 24.5, note: 'children' },
  { label: '15–64 years', share: 69.0, note: 'working age' },
  { label: '65+ years', share: 6.5, note: 'elderly' },
];

// Provinces: population (million, mid-2024 estimate, rounded to 0.1),
// land area (km², rounded), capital. Density is computed from these.
export const PROVINCES = [
  { name: 'Aceh', region: 'Sumatra', pop: 5.5, area: 57956, capital: 'Banda Aceh' },
  { name: 'North Sumatra', region: 'Sumatra', pop: 15.6, area: 72981, capital: 'Medan' },
  { name: 'West Sumatra', region: 'Sumatra', pop: 6.0, area: 42013, capital: 'Padang' },
  { name: 'Riau', region: 'Sumatra', pop: 7.0, area: 87024, capital: 'Pekanbaru' },
  { name: 'Jambi', region: 'Sumatra', pop: 3.7, area: 50058, capital: 'Jambi' },
  { name: 'South Sumatra', region: 'Sumatra', pop: 8.9, area: 91592, capital: 'Palembang' },
  { name: 'Bengkulu', region: 'Sumatra', pop: 2.1, area: 19919, capital: 'Bengkulu' },
  { name: 'Lampung', region: 'Sumatra', pop: 9.4, area: 34624, capital: 'Bandar Lampung' },
  { name: 'Bangka Belitung', region: 'Sumatra', pop: 1.5, area: 16424, capital: 'Pangkal Pinang' },
  { name: 'Riau Islands', region: 'Sumatra', pop: 2.3, area: 8202, capital: 'Tanjung Pinang' },
  { name: 'Jakarta', region: 'Java', pop: 10.7, area: 664, capital: 'Jakarta' },
  { name: 'West Java', region: 'Java', pop: 50.3, area: 35378, capital: 'Bandung' },
  { name: 'Central Java', region: 'Java', pop: 38.1, area: 32801, capital: 'Semarang' },
  { name: 'Yogyakarta', region: 'Java', pop: 3.8, area: 3133, capital: 'Yogyakarta' },
  { name: 'East Java', region: 'Java', pop: 41.9, area: 47803, capital: 'Surabaya' },
  { name: 'Banten', region: 'Java', pop: 12.3, area: 9663, capital: 'Serang' },
  { name: 'Bali', region: 'Bali & Nusa Tenggara', pop: 4.4, area: 5780, capital: 'Denpasar' },
  { name: 'West Nusa Tenggara', region: 'Bali & Nusa Tenggara', pop: 5.7, area: 18572, capital: 'Mataram' },
  { name: 'East Nusa Tenggara', region: 'Bali & Nusa Tenggara', pop: 5.7, area: 48718, capital: 'Kupang' },
  { name: 'West Kalimantan', region: 'Kalimantan', pop: 6.1, area: 147307, capital: 'Pontianak' },
  { name: 'Central Kalimantan', region: 'Kalimantan', pop: 2.8, area: 153564, capital: 'Palangka Raya' },
  { name: 'South Kalimantan', region: 'Kalimantan', pop: 4.3, area: 38744, capital: 'Banjarmasin' },
  { name: 'East Kalimantan', region: 'Kalimantan', pop: 4.0, area: 129066, capital: 'Samarinda' },
  { name: 'North Kalimantan', region: 'Kalimantan', pop: 0.7, area: 75467, capital: 'Tanjung Selor' },
  { name: 'North Sulawesi', region: 'Sulawesi', pop: 2.7, area: 13892, capital: 'Manado' },
  { name: 'Central Sulawesi', region: 'Sulawesi', pop: 3.1, area: 61841, capital: 'Palu' },
  { name: 'South Sulawesi', region: 'Sulawesi', pop: 9.5, area: 46717, capital: 'Makassar' },
  { name: 'Southeast Sulawesi', region: 'Sulawesi', pop: 2.8, area: 38140, capital: 'Kendari' },
  { name: 'Gorontalo', region: 'Sulawesi', pop: 1.3, area: 11257, capital: 'Gorontalo' },
  { name: 'West Sulawesi', region: 'Sulawesi', pop: 1.6, area: 16787, capital: 'Mamuju' },
  { name: 'Maluku', region: 'Maluku & Papua', pop: 2.1, area: 46914, capital: 'Ambon' },
  { name: 'North Maluku', region: 'Maluku & Papua', pop: 1.5, area: 31982, capital: 'Sofifi' },
  { name: 'West Papua', region: 'Maluku & Papua', pop: 0.6, area: 64126, capital: 'Manokwari' },
  { name: 'Southwest Papua', region: 'Maluku & Papua', pop: 0.6, area: 39167, capital: 'Sorong' },
  { name: 'Papua', region: 'Maluku & Papua', pop: 1.1, area: 82680, capital: 'Jayapura' },
  { name: 'South Papua', region: 'Maluku & Papua', pop: 0.6, area: 131494, capital: 'Merauke' },
  { name: 'Central Papua', region: 'Maluku & Papua', pop: 1.4, area: 66130, capital: 'Nabire' },
  { name: 'Highland Papua', region: 'Maluku & Papua', pop: 1.4, area: 51213, capital: 'Wamena' },
];

export const REGIONS = ['All regions', 'Sumatra', 'Java', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku & Papua'];

// Indicator index: every headline figure in one searchable list.
export const INDICATORS = [
  { name: 'Population', value: '281.6 million', year: '2024', topic: 'People', route: '#/people' },
  { name: 'Population growth', value: '0.9% per year', year: '2024', topic: 'People', route: '#/people' },
  { name: 'Population density', value: '149 people / km²', year: '2024', topic: 'People', route: '#/people' },
  { name: 'Median age', value: '30.5 years', year: '2024', topic: 'People', route: '#/people' },
  { name: 'Working-age share (15–64)', value: '69.0%', year: '2024', topic: 'People', route: '#/people' },
  { name: 'Human Development Index', value: '75.02', year: '2024', topic: 'People', route: '#/people' },
  { name: 'Life expectancy at birth', value: '74.2 years', year: '2024', topic: 'People', route: '#/people' },
  { name: 'Literacy rate (15+)', value: '96.5%', year: '2024', topic: 'People', route: '#/people' },
  { name: 'Open unemployment rate', value: '4.91%', year: 'Aug 2024', topic: 'People', route: '#/people' },
  { name: 'Poverty rate', value: '8.57%', year: 'Sep 2024', topic: 'People', route: '#/people' },
  { name: 'Gini ratio', value: '0.381', year: 'Sep 2024', topic: 'People', route: '#/people' },
  { name: 'GDP (nominal)', value: 'Rp 22,139 trillion', year: '2024', topic: 'Economy', route: '#/economy' },
  { name: 'GDP growth', value: '5.03% yoy', year: '2024', topic: 'Economy', route: '#/economy' },
  { name: 'GDP per capita', value: 'Rp 78.6 million', year: '2024', topic: 'Economy', route: '#/economy' },
  { name: 'Inflation (December, yoy)', value: '1.57%', year: 'Dec 2024', topic: 'Economy', route: '#/economy' },
  { name: 'Exports', value: 'US$ 264.7 billion', year: '2024', topic: 'Economy', route: '#/economy' },
  { name: 'Imports', value: 'US$ 233.7 billion', year: '2024', topic: 'Economy', route: '#/economy' },
  { name: 'Trade balance', value: 'US$ 31.0 billion surplus', year: '2024', topic: 'Economy', route: '#/economy' },
  { name: 'Foreign exchange reserves', value: 'US$ 155.7 billion', year: 'Dec 2024', topic: 'Economy', route: '#/economy' },
  { name: 'Rupiah per US dollar', value: 'Rp 16,162', year: 'end 2024', topic: 'Economy', route: '#/economy' },
  { name: 'Foreign visitors', value: '13.9 million', year: '2024', topic: 'Economy', route: '#/economy' },
  { name: 'Rice production', value: '30.3 million tonnes', year: '2024', topic: 'Economy', route: '#/economy' },
  { name: 'Internet users', value: '221.6 million (79.5%)', year: '2024', topic: 'People', route: '#/people' },
  { name: 'Provinces', value: '38', year: '2024', topic: 'People', route: '#/provinces' },
  { name: 'Largest province (population)', value: 'West Java, 50.3 million', year: '2024', topic: 'People', route: '#/provinces' },
  { name: 'Land area', value: '1.89 million km²', year: '2024', topic: 'People', route: '#/provinces' },
];

// Release calendar: the regular BPS release rhythm, with the latest
// published values. Dates are the scheduled publication dates.
export const RELEASES = [
  { date: '2026-12-01', title: 'Consumer Price Index — November 2026', topic: 'Economy', status: 'Scheduled' },
  { date: '2026-11-26', title: 'Foreign trade — October 2026', topic: 'Economy', status: 'Scheduled' },
  { date: '2026-11-05', title: 'GDP growth — Q3 2026', topic: 'Economy', status: 'Scheduled' },
  { date: '2025-02-05', title: 'GDP growth — Q4 2024: 5.02% yoy', topic: 'Economy', status: 'Published' },
  { date: '2025-01-15', title: 'Poverty profile — September 2024: 8.57%', topic: 'People', status: 'Published' },
  { date: '2024-11-15', title: 'Human Development Index 2023: 74.39', topic: 'People', status: 'Published' },
  { date: '2024-11-05', title: 'GDP growth — Q3 2024: 4.95% yoy · Labour force — August 2024: 4.91%', topic: 'Economy', status: 'Published' },
  { date: '2024-08-05', title: 'GDP growth — Q2 2024: 5.05% yoy', topic: 'Economy', status: 'Published' },
  { date: '2024-05-06', title: 'GDP growth — Q1 2024: 5.11% yoy', topic: 'Economy', status: 'Published' },
  { date: '2024-02-05', title: 'GDP growth — Q4 2023: 5.04% yoy', topic: 'Economy', status: 'Published' },
  { date: '2024-01-02', title: 'Consumer Price Index — December 2023: 2.61% yoy', topic: 'Economy', status: 'Published' },
  { date: '2023-11-06', title: 'GDP growth — Q3 2023: 4.94% yoy', topic: 'Economy', status: 'Published' },
];

export const SOURCES = [
  { name: 'BPS — Statistics Indonesia, “Indonesia in Figures 2025”', detail: 'Population, GDP, inflation, trade, poverty, unemployment.' },
  { name: 'BPS — Economic Growth of Indonesia 2024', detail: 'GDP growth 5.03%, GDP Rp 22,139 trillion.' },
  { name: 'BPS — Human Development Index 2024', detail: 'HDI 75.02; life expectancy 74.2 years.' },
  { name: 'BPS — Poverty Profile, September 2024', detail: 'Poverty rate 8.57% (24.06 million people).' },
  { name: 'BPS — Labour Force Situation, August 2024', detail: 'Open unemployment 4.91%.' },
  { name: 'APJII — Indonesian Internet Penetration Survey 2024', detail: '221.6 million users, 79.5% penetration.' },
];
