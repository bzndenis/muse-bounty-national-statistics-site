# BUILD_LOG — NusaData (best-national-statistics-site-20261126-0539)

Bounty: Make the best national statistics site — https://make.fun/bounty/best-national-statistics-site-20261126-0539
Hadiah: $50 total (10 tempat × $5). Entry gratis, escrow USDC $50 terdanai penuh.
Deadline: Minggu 29 Nov 2026 12:39 WIB (05:39 UTC). Dibuka 26 Nov 2026 12:39 WIB.
Semua waktu di bawah ini WIB (Asia/Jakarta).

## 2026-11-26 01:30 WIB — Baca aturan + kit
- Bounty terverifikasi dari halaman resmi make.fun: escrow $50 USDC, 0 submissions saat ditemukan.
- Unduh kit resmi dari https://make.fun/c/best-national-statistics-site-20261126-0539/kit, ekstrak ke /tmp/stats-kit; baca starter/main.ts, starter/app/*, RULES.txt (gate: app/ ≤993 file/16 MiB, index.html ≤1 MiB, screenshot 3–4, masing-masing ≤256 KiB, long side ≤1280, short side ≥360).
- vendor/makefun-frontend.ts disalin dari kit TANPA DIUBAH (sha256 4c8da1c8… sama dengan kit). LICENSE (MIT) dari kit starter.
- Keputusan desain: portal statistik nasional orisinal "NusaData — Indonesia in Numbers", desain sendiri (teal + amber), nama netral, tanpa klaim afiliasi resmi. Angka nyata publikasi BPS 2019–2024 + APJII 2024, tiap seri berlabel tahun; populasi provinsi = estimasi pertengahan 2024 yang dibulatkan.

## 2026-11-26 01:35–01:45 WIB — Tulis situs (orisinal, dari nol)
- app/data.js — HEADLINES (8), SERIES 2019–2024 (PDB, inflasi, penduduk, pengangguran, kemiskinan, IPM, ekspor/impor, wisatawan, beras), AGE_GROUPS, PROVINCES (38 provinsi: populasi, luas km², ibu kota), INDICATORS (26), RELEASES (12, hanya rilis nyata yang sudah terbit + jadwal), SOURCES.
- app/charts.js — pembangun SVG tanpa library: barChart (tahan nilai negatif 2020), lineChart, hBars, donut.
- app/views.js — 7 halaman hash-route: Home, Economy, People, Provinces, Indicators, Releases, About + notFound.
- app/explorer.js — interaksi: pengalih chart ekonomi + tabel data; explorer provinsi (search, filter region, 5 sort, detail klik-baris, banding 2 provinsi); search + filter indikator; filter rilis.
- app/main.js — router + __shotReady untuk screenshot. app/index.html + app/style.css (desain orisinal, responsif).
- main.ts — ditulis mengikuti pola starter: cp app/ + screenshots/ ke /output, tulis dossier.json via buildDossier.
- tools/verify.mjs — verifikasi + screenshot via CDP Chromium headless (fetch + WebSocket bawaan Node 22, tanpa paket): cek semua route, klik semua kontrol, kumpulkan console error + request network, ambil 4 screenshot.
- Koreksi selama build: (1) angka rilis triwulanan 2025/2026 yang tidak yakin diganti rilis nyata yang sudah terbit; (2) densitas dihitung dari luas km² presisi (Jakarta 16.114, bukan 15.286 dari pembulatan); (3) label tengah donut diperbaiki ke segmen terbesar (69,0% usia kerja).

## 2026-11-26 01:45 WIB — Verifikasi (tools/verify.mjs --shots)
- 39/39 cek LULUS: 8 route (termasuk #/nope) tanpa console error dan tanpa request eksternal; 8 kartu headline; chart ekonomi berubah saat pengalih diklik + tabel mengikuti; tabel provinsi 38 baris; search "java" → 3; filter Java → 6; sort densitas → Jakarta pertama; klik baris → detail; banding West Java vs Papua; indikator 26 → search "inflation" → 1; filter rilis 12 → 3 terjadwal; nav 7 link; tanpa link eksternal.
- Screenshot dibaca visual: home (8 kartu + chart), ekonomi (bar PDB 2019–2024, -2,07% tahun 2020 oranye), provinsi (tabel + filter), HP 390x844 (layout 2 kolom rapi, "Rp 22.139 T" satu baris), people (donut usia kerja 69,0%).
- 4 screenshot: 1-home 123.611, 2-economy 70.442, 3-provinces 102.314, 4-phone 67.482 byte — semua ≤256 KiB.

## 2026-11-26 01:50 WIB — Gate (main.ts)
- mkdir -p out out2 && MAKEFUN_OUTPUT_DIR=out node main.ts && MAKEFUN_OUTPUT_DIR=out2 node main.ts && diff -r out out2 → IDENTIK (byte-identik).
- Gate: app/ 7 file, 53.407 byte (batas 993 / 16 MiB); index.html 1.106 byte (batas 1 MiB); 0 referensi http/https di semua file app/; 4 screenshot @1280x800 / 390x844, masing-masing ≤256 KiB; dossier.json 541.857 byte (batas 1,5 MiB), schema makefun/dossier/v1.
- out/ dan out2/ dihapus setelahnya.

## 2026-11-26 — Repo GitHub
- /root/.ssh kosong lagi (hilang saat restart VM, seperti sebelumnya) → dipulihkan dari /home/hatch/.ssh (config + id_ed25519_github_v2), known_hosts dibangun ulang via ssh-keyscan, fingerprint ED25519 SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU terverifikasi; ssh -T git@github.com → "Hi bzndenis!".
- Perintah: python3 ~/workspace/custom-connectors/custom.github/bin/github.py create-repo --name muse-bounty-national-statistics-site → repo publik bzndenis/muse-bounty-national-statistics-site (id 1472203764).
- .makefun/owner.json ditulis (wallet sama seperti entri sebelumnya).
- git init, commit fa0ffe9cda876d0b6657be4882cf81eff7795de3 "NusaData: original national statistics site for make.fun best-national-statistics-site bounty", push main → OK. Homepage di-set ke halaman bounty, topics: makefun, statistics, indonesia, javascript. Verifikasi: local HEAD = remote HEAD (fa0ffe9c…), get-repo status 200, private: false.
- Catatan: API publik GitHub tanpa auth sempat mengembalikan 403 rate limit saat pengecekan; verifikasi dilakukan lewat helper terautentikasi + git ls-remote.

## Status
- SUBMIT BELUM DILAKUKAN. Yang masih dibutuhkan dari Denis: submit manual sebelum deadline Minggu 29 Nov 2026 12:39 WIB (via website make.fun), karena langkah submit CLI diblokir di environment ini. Transkrip final (bundle) perlu dirakit saat submit dari sesi ini + BUILD_LOG.md ini.
