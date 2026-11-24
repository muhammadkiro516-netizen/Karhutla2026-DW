<div align="center">

# 🔥 PyroAlert Karhutla '26

### Sistem Peringatan Dini Kebakaran Hutan & Lahan Indonesia

> **Mengubah data satelit + kualitas udara menjadi satu keputusan nyata:**  
> *Apakah sekolah boleh masuk hari ini?*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-eduair.vercel.app-orange?style=for-the-badge)](https://eduair.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tests](https://img.shields.io/badge/Tests-62_passing-brightgreen?style=for-the-badge&logo=vitest)](https://vitest.dev)
[![License](https://img.shields.io/badge/Kode-MIT-purple?style=for-the-badge)](LICENSE)

---

**Proyek ini dibangun sebagai sistem peringatan dini karhutla berbasis web untuk Indonesia.**  
Mengintegrasikan data satelit NASA, model udara Copernicus CAMS, dan cuaca real-time  
menjadi **satu antarmuka terpadu** untuk warga, kepala sekolah, dan petugas posko.

</div>

---

## 📋 Daftar Isi

1. [Latar Belakang & Urgensi](#-latar-belakang--urgensi)
2. [Gambaran Sistem](#-gambaran-sistem)
3. [Fitur Lengkap (4 Modul)](#-fitur-lengkap-4-modul)
4. [Arsitektur & Alur Data](#-arsitektur--alur-data)
5. [Engine Status Sekolah](#-engine-status-sekolah)
6. [Sumber Data](#-sumber-data)
7. [Tech Stack](#-tech-stack)
8. [Struktur Proyek](#-struktur-proyek)
9. [API Routes](#-api-routes)
10. [Validasi & Backtest](#-validasi--backtest)
11. [Setup & Menjalankan](#-setup--menjalankan)
12. [Konfigurasi Lingkungan](#-konfigurasi-lingkungan)
13. [Deployment](#-deployment)
14. [Keterbatasan & Kejujuran Data](#-keterbatasan--kejujuran-data)
15. [Lisensi Data](#-lisensi-data)

---

## 🌋 Latar Belakang & Urgensi

Indonesia menghadapi krisis karhutla berulang setiap musim kemarau, terutama di **Sumatera dan Kalimantan**. Dampaknya langsung terasa pada kualitas udara kota-kota besar di sekitarnya.

| Dampak | Realita |
|--------|---------|
| 💨 Kualitas udara | PM2.5 bisa melampaui **500 µg/m³** saat puncak kebakaran gambut — 50× batas aman WHO |
| 🏫 Sekolah | Ratusan sekolah terpaksa diliburkan tanpa sistem notifikasi yang terstandar |
| 🏥 Kesehatan | ISPA massal, beban fasilitas kesehatan meningkat drastis |
| 📡 Informasi | Tidak ada platform terpadu yang menggabungkan titik api + kualitas udara + rekomendasi sekolah |

**PyroAlert Karhutla '26** menjawab celah ini: satu aplikasi yang membaca data satelit secara otomatis dan langsung memberi jawaban — *Normal, Waspada, Hybrid, atau Daring Darurat*.

---

## 🗺️ Gambaran Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                    PyroAlert Karhutla '26                       │
│                                                                 │
│  🌍 Data Satelit      ⚙️ Engine               📱 Antarmuka      │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────┐    │
│  │ NASA FIRMS  │───▶│  Clustering  │───▶│  Peta Titik    │    │
│  │ VIIRS 3-sat │    │  Wind Drift  │    │  Api Interaktif│    │
│  └─────────────┘    └──────────────┘    └────────────────┘    │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────┐    │
│  │ Open-Meteo  │───▶│  ISPU Engine │───▶│  Status        │    │
│  │ CAMS PM2.5  │    │  Permen LHK  │    │  Sekolah       │    │
│  └─────────────┘    │  P.14/2020   │    └────────────────┘    │
│  ┌─────────────┐    └──────────────┘    ┌────────────────┐    │
│  │ OSM Overpass│                        │  Posko &       │    │
│  │ Fasilitas   │───────────────────────▶│  Faskes        │    │
│  └─────────────┘                        └────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Cakupan

| Dimensi | Detail |
|---------|--------|
| 🏙️ Kota tercakup | **66 kota** dari Banda Aceh sampai Merauke (semua zona waktu: WIB, WITA, WIT) |
| 🛰️ Satelit pemantau | **3 satelit VIIRS** — SNPP, NOAA-20, NOAA-21 |
| 🏫 Sekolah seed | **128 sekolah** (PAUD, SD, SMP, SMA, SLB) di 8 kota rawan karhutla |
| 🏥 Fasilitas kesehatan | **40+ fasilitas** (RS, Puskesmas, Apotek, Posko BPBD) di 8 kota |
| 📏 Regulasi acuan | **Permen LHK P.14/MENLHK/SETJEN/KUM.1/7/2020** (ISPU PM2.5 resmi Indonesia) |

---

## 🧩 Fitur Lengkap (4 Modul)

### 🌬️ Tab 1 — Udara (`/udara`)

Dashboard kualitas udara real-time dengan analisis mendalam per kota.

| Komponen | Fungsi |
|----------|--------|
| **AirHero** | Angka ISPU besar dengan latar warna per kategori + status sekolah |
| **MetricPills** | PM2.5 · PM10 · US AQI · suhu · kelembapan · kecepatan angin |
| **IspuGauge** | Gauge arc SVG animasi dengan jarum bergerak |
| **IspuChart** | Grafik garis 48 jam (Recharts), area terobservasi vs prakiraan berbeda warna |
| **HourlyHeatmap** | Grid 24 kolom per jam, warna per kategori ISPU |
| **WindCompass** | Kompas arah angin dengan ring kecepatan |
| **TomorrowCard** | Rekomendasi hari esok (muncul mulai pukul 18.00 waktu lokal) |
| **HealthRiskCard** | Risiko kesehatan per kelompok + ekuivalen rokok WHO |
| **ExposureCalculator** | Kalkulator "berapa lama boleh di luar?" interaktif |
| **SmokeHint** | Banner ETA asap jika titik api mengarah ke kota ini |
| **ReadAloud** | Text-to-speech status saat ini (Web Speech API) |
| **MonthlyRecap** | Grafik batang PM2.5 bulanan historis (3 bulan terakhir) |
| **OtherCities** | 66 kota dikelompokkan per pulau dengan titik warna ISPU |
| **ActionCard** | Panduan tindakan personal berdasarkan level ISPU + mode rentan |
| **ShareCard** | Bagikan status via Web Share API atau clipboard |

---

### 🏫 Tab 2 — Sekolah (`/sekolah`)

Sistem keputusan status sekolah dengan alur persetujuan resmi dan log audit.

| Komponen | Fungsi |
|----------|--------|
| **TomorrowStrip** | Strip rekomendasi besok di bagian atas |
| **RoleSwitch** | Toggle peran: Orang Tua / Kepala Sekolah (admin) |
| **SchoolList** | 128 sekolah dengan status per jenjang (PAUD/SD/SMP/SMA/SLB) |
| **ApproveSheet** | Form persetujuan kepala sekolah dengan PIN, simpan ke audit log |
| **AuditLog** | Log keputusan hash-chain (SHA-256), integritas rantai tervalidasi |
| **SimulationPanel** | Slider ISPU 0–300 untuk eksplorasi "bagaimana jika PM2.5 = X?" |
| **RuleCard** | Tabel ambang batas aturan engine (Waspada / Hybrid / Daring) |
| **AnnouncementCard** | Teks pengumuman formal siap kirim + tombol WhatsApp |
| **QrPoster** | Poster QR code per sekolah → `/s/[slug]` |

**Halaman publik** `GET /s/[school]` — server-side rendered, bisa dibuka tanpa login, dipakai untuk QR di pintu sekolah.

---

### 🛰️ Tab 3 — Titik Api (`/titik-api`)

Visualisasi hotspot NASA FIRMS dengan simulasi sebaran asap.

| Komponen | Fungsi |
|----------|--------|
| **HotspotMap** | Peta Leaflet interaktif: cluster merah/oranye/kuning per FRP + kota ber-ISPU |
| **HotspotSummary** | Total cluster, total FRP, usia data, badge sumber satelit |
| **ThreatRanking** | Peringkat kota berdasarkan ETA asap tercepat |
| **RegionChips** | Filter per provinsi rawan (7 provinsi: Riau, Jambi, Sumsel, Kalbar, Kalteng, Kalsel, Kaltim) |
| **HotspotFilters** | Urutan & pencarian teks cluster |
| **ClusterList** | Daftar cluster dengan detail: FRP, satelit, kota terdekat, dampak sebaran |
| **HonestyNote** | Disclaimer: titik panas ≠ kebakaran terkonfirmasi |

**Pipeline sebaran asap** (simulasi fisika sederhana):
```
Cluster FRP → Wind series (Open-Meteo) → simulateDrift() 
→ Adveksi per jam (maks. 24 jam) → Cone dengan lebar melebar 
→ Cek interseksi dengan tiap kota → ETA + jarak
```

---

### 🏥 Tab 4 — Posko (`/posko`)

Pusat koordinasi kesehatan: fasilitas, stok APD, dan laporan warga.

| Komponen | Fungsi |
|----------|--------|
| **EmergencyCard** | Nomor darurat (112, 119, 117) prominent saat status ≥ Hybrid |
| **FacilityFilters** | Filter: SEMUA / RS / Puskesmas_Klinik / Apotek / Posko |
| **FacilityCard** | Nama, tipe, jarak, link telepon, link peta per fasilitas |
| **StockChips** | Level stok 5 item APD: Masker N95 · Masker Medis · Nebulizer · Oksigen · Obat Asma |
| **StockEditSheet** | Form update stok (admin) → POST `/api/stock` |
| **ReportSheet** | Form laporan warga: deskripsi + foto, analisis EXIF otomatis |
| **EvidencePanel** | Hasil verifikasi EXIF foto (waktu, koordinat GPS, radius 50 km) |
| **SelfHelpCard** | Tips mandiri untuk paparan asap |

---

## ⚙️ Arsitektur & Alur Data

### Diagram Alur

```
Browser (React + SWR)
│
├── useAir()        ──GET /api/air──────────▶ Open-Meteo CAMS (PM2.5 + AQI)
├── useWeather()    ──GET /api/weather──────▶ Open-Meteo Forecast (angin + suhu)
├── useHotspots()   ──GET /api/hotspots─────▶ NASA FIRMS VIIRS (3 satelit)
├── useFacilities() ──GET /api/facilities───▶ OSM Overpass + Seed Data
│
│   [ Semua di-cache server-side, dikembalikan via ApiEnvelope<T> ]
│
├── useDecisions()  ──localStorage──────────▶ Audit log hash-chain (SHA-256)
├── useLocalStore() ──localStorage──────────▶ Laporan warga (offline-first)
└── useModes()      ──localStorage──────────▶ Mode Rentan + Hemat Data

POST /api/reports   ──────────────────────▶ Supabase (opsional) | demo mode
POST /api/stock     ──────────────────────▶ Supabase (opsional) | demo mode
```

### Cache Strategy

| Route | TTL | Stale-While-Revalidate |
|-------|-----|------------------------|
| `/api/air` | 10 menit | 60 menit |
| `/api/weather` | 10 menit | 60 menit |
| `/api/hotspots` | 15 menit | 90 menit |
| `/api/facilities` | 24 jam | 6 hari |
| `/api/monthly` | 1 jam (in-memory) | — |

Saat sumber data gagal: server mengembalikan data lama dengan flag `stale: true`, UI menampilkan `StaleBanner` dengan tombol retry.

### PWA & Offline

- **Service Worker** (`public/sw.js`) dikonfigurasi secara manual
- Precache 4 route tab saat instalasi
- Strategi `/api/*`: **Network-first** dengan timeout 10 detik, fallback ke cache
- Strategi app shell: **Cache-first**
- Root `/` sengaja tidak di-cache (kompatibilitas iOS Safari)

---

## 🧠 Engine Status Sekolah

Ini adalah inti intelektual proyek. Engine mengimplementasikan **Permen LHK P.14/MENLHK/SETJEN/KUM.1/7/2020** secara deterministik.

### Ambang Batas Resmi

| Status | Kode | Pemicu | Jam Berturut-turut |
|--------|------|--------|-------------------|
| ✅ Normal | `NORMAL` | ISPU ≤ 100 | — |
| ⚠️ Waspada | `WASPADA` | ISPU **> 100** | **1 jam** |
| 🟡 Hybrid | `HYBRID` | ISPU **> 150** | **3 jam** |
| 🔴 Daring Darurat | `DARING_DARURAT` | ISPU **> 200** | **2 jam** |

**Histeresis:** setelah eskalasi, status baru turun setelah **3 jam berturut-turut** di bawah ambang level saat ini.

### Mode Rentan (PAUD, SLB, Asma, Lansia)

Semua ambang diturunkan **50 ISPU** otomatis:

| Status | Ambang Normal | Ambang Mode Rentan |
|--------|--------------|-------------------|
| Waspada | > 100 | > 50 |
| Hybrid | > 150 | > 100 |
| Daring Darurat | > 200 | > 150 |

### Konversi PM2.5 → ISPU

Menggunakan interpolasi linear per breakpoint resmi Permen LHK P.14/2020:

| PM2.5 (µg/m³) | ISPU | Kategori |
|---------------|------|----------|
| 0 – 15.5 | 0 – 50 | 🟢 Baik |
| 15.6 – 55.4 | 51 – 100 | 🔵 Sedang |
| 55.5 – 150.4 | 101 – 200 | 🟡 Tidak Sehat |
| 150.5 – 250.4 | 201 – 300 | 🔴 Sangat Tidak Sehat |
| 250.5 – 500 | 301 – 500 | ⚫ Berbahaya |

### Kode Engine (Lokasi)

```
src/lib/school-status.ts   ← deriveStatusTimeline(), evaluateSchoolStatus(), forecastSchoolDay()
src/lib/ispu.ts            ← pm25ToIspu(), ispu24h(), toIspuSeries(), rollingMean()
src/config/thresholds.ts   ← SEMUA nilai ambang (satu sumber kebenaran)
```

### Alur Komputasi Status

```
PM2.5 hourly series (Open-Meteo CAMS)
        │
        ▼
  pm25ToIspu() — interpolasi per breakpoint Permen LHK
        │
        ▼
  toIspuSeries() — seri ISPU per jam
        │
        ▼
  deriveStatusTimeline() — replay jam demi jam:
        │   - Hitung streak jam di atas tiap ambang
        │   - Eskalasi segera saat streak terpenuhi
        │   - Turun hanya setelah hysteresis 3 jam
        │
        ▼
  evaluateSchoolStatus() → SchoolStatus terakhir
        │
        ├─▶ Tab Sekolah (status per sekolah)
        ├─▶ /api/air (dikirim ke klien)
        └─▶ /s/[school] (server-rendered, QR poster)
```

---

## 📡 Sumber Data

| Sumber | Data | Lisensi | Kunci API |
|--------|------|---------|-----------|
| [Open-Meteo CAMS](https://open-meteo.com/en/docs/air-quality-api) | PM2.5, PM10, US AQI (66 kota, 48 jam) | CC BY 4.0 | Gratis |
| [Open-Meteo Forecast](https://open-meteo.com/en/docs) | Angin, suhu, kelembapan | CC BY 4.0 | Gratis |
| [Open-Meteo Historical](https://open-meteo.com/en/docs/historical-api) | PM2.5 historis untuk rekap bulanan | CC BY 4.0 | Gratis |
| [NASA FIRMS VIIRS](https://firms.modaps.eosdis.nasa.gov/) | Titik api aktif (SNPP + NOAA-20 + NOAA-21) | Domain Publik | `FIRMS_MAP_KEY` (gratis) |
| [OpenStreetMap Overpass](https://overpass-api.de/) | Fasilitas kesehatan radius 15 km | ODbL | Gratis |
| [Supabase](https://supabase.com/) | Laporan warga + stok APD (opsional) | — | URL + anon key |

> Tanpa `FIRMS_MAP_KEY`, aplikasi tetap berjalan menggunakan **data contoh sintetis** berlabel `Demo`.

---

## 🛠️ Tech Stack

### Core

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| [Next.js](https://nextjs.org) | 16.4.2 | Framework (App Router, SSR, Route Handlers) |
| [React](https://react.dev) | 19.3.0 | UI library |
| [TypeScript](https://typescriptlang.org) | 5.x strict | Bahasa pemrograman (strict mode) |
| [Tailwind CSS](https://tailwindcss.com) | v4 | Styling (via PostCSS plugin, tanpa config file) |

### Data & State

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| [SWR](https://swr.vercel.app) | 2.5.1 | Data fetching + caching klien (10–15 menit refresh) |
| [Zod](https://zod.dev) | 4.6.7 | Validasi schema API request + response |
| [Supabase](https://supabase.com) | 2.118.0 | Persistence opsional (laporan + stok) |

### Visualisasi

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| [Recharts](https://recharts.org) | 3.10.1 | Grafik garis + grafik batang |
| [Leaflet](https://leafletjs.com) | 1.9.4 | Peta interaktif hotspot (dynamic import, SSR off) |
| [Framer Motion](https://www.framer.com/motion) | 14.x | Animasi UI (landing page, transisi) |
| [Lucide React](https://lucide.dev) | 1.60 | Ikon |

### Utility

| Teknologi | Fungsi |
|-----------|--------|
| [exifr](https://github.com/MikeKovarik/exifr) | Baca metadata EXIF foto (waktu + GPS) di browser |
| [qrcode](https://github.com/soldair/node-qrcode) | Generate QR code poster sekolah |
| [PapaParse](https://www.papaparse.com) | Parse CSV data NASA FIRMS |
| Web Crypto API | SHA-256 hash untuk audit log + hash bukti foto |
| Web Speech API | Text-to-speech status udara |

### Testing & Quality

| Teknologi | Fungsi |
|-----------|--------|
| [Vitest](https://vitest.dev) | Test runner (62 tes, deterministic) |
| [fast-check](https://fast-check.io) | Property-based testing (ribuan input acak) |
| `tsc --noEmit` | TypeScript strict typecheck |
| ESLint | Linting (0 error) |
| tsx | Jalankan script TypeScript (`backtest.ts`) |

---

## 📁 Struktur Proyek

```
Karhutla2026-DW/
├── src/
│   ├── app/
│   │   ├── (tabs)/                  # Layout + 4 tab utama
│   │   │   ├── layout.tsx           # AppShell wrapper
│   │   │   ├── udara/page.tsx       # Tab Kualitas Udara
│   │   │   ├── sekolah/page.tsx     # Tab Status Sekolah
│   │   │   ├── titik-api/page.tsx   # Tab Hotspot / Titik Api
│   │   │   └── posko/page.tsx       # Tab Posko & Fasilitas
│   │   ├── api/
│   │   │   ├── air/route.ts         # GET — data udara 66 kota
│   │   │   ├── weather/route.ts     # GET — angin + cuaca
│   │   │   ├── hotspots/route.ts    # GET — FIRMS + clustering + drift
│   │   │   ├── facilities/route.ts  # GET — faskes OSM + seed
│   │   │   ├── monthly/route.ts     # GET — rekap bulanan PM2.5
│   │   │   ├── reports/route.ts     # POST — laporan warga
│   │   │   └── stock/route.ts       # POST — update stok APD
│   │   ├── s/[school]/page.tsx      # Halaman publik per sekolah (QR target)
│   │   ├── about/page.tsx           # Halaman tentang proyek
│   │   ├── page.tsx                 # Landing page
│   │   ├── layout.tsx               # Root layout (font, metadata)
│   │   └── manifest.ts              # PWA manifest
│   │
│   ├── components/
│   │   ├── landing/                 # LandingPage, FireScene (canvas animasi)
│   │   ├── shell/                   # AppShell, FloatingNav, CityChips, CitySearch
│   │   ├── udara/                   # ~18 komponen kualitas udara
│   │   ├── sekolah/                 # ~11 komponen status sekolah
│   │   ├── titik-api/               # ~7 komponen peta hotspot
│   │   ├── posko/                   # ~9 komponen fasilitas & laporan
│   │   └── ui/                      # Primitif: Card, Badge, Sheet, Skeleton, dll.
│   │
│   ├── lib/                         # Logic domain murni (pure functions)
│   │   ├── ispu.ts                  # Konversi PM2.5 ↔ ISPU
│   │   ├── school-status.ts         # Engine status sekolah
│   │   ├── hotspots.ts              # Clustering titik api
│   │   ├── drift.ts                 # Simulasi sebaran asap
│   │   ├── audit.ts                 # Hash-chain audit log
│   │   ├── evidence.ts              # Verifikasi EXIF foto (server)
│   │   ├── evidence-browser.ts      # Baca EXIF di browser (exifr)
│   │   ├── advice.ts                # Generator teks panduan + pengumuman
│   │   ├── attribution.ts           # Atribusi sumber asap ke kota
│   │   └── geo.ts                   # Utilitas geometri (bbox, haversine)
│   │
│   ├── server/                      # Fetcher server-side
│   │   ├── openmeteo.ts             # Fetch Open-Meteo (udara + cuaca + historis)
│   │   ├── firms.ts                 # Fetch NASA FIRMS CSV
│   │   ├── overpass.ts              # Fetch OSM Overpass
│   │   └── cache.ts                 # In-memory TTL cache (stale-on-failure)
│   │
│   ├── hooks/                       # React hooks (SWR wrappers)
│   │   ├── useAir.ts                # Data udara + status sekolah
│   │   ├── useWeather.ts            # Data cuaca
│   │   ├── useHotspots.ts           # Data titik api
│   │   ├── useFacilities.ts         # Data fasilitas kesehatan
│   │   ├── useCity.ts               # City selection (URL param + localStorage)
│   │   ├── useDecisions.ts          # Audit log (localStorage, hash-chain)
│   │   ├── useLocalStore.ts         # Laporan warga lokal
│   │   └── useModes.ts              # Mode Rentan + Hemat Data
│   │
│   ├── config/
│   │   ├── thresholds.ts            # SEMUA ambang: ISPU, sekolah, drift, cache
│   │   └── cities.ts                # 66 kota: koordinat, timezone, provinsi
│   │
│   ├── types/
│   │   ├── domain.ts                # Tipe domain: SchoolStatus, HourlyPoint, dll.
│   │   └── api.ts                   # Tipe API: AirCity, HotspotPayload, dll.
│   │
│   ├── data/
│   │   ├── seed.ts                  # 40 faskes + 128 sekolah (seed demo)
│   │   └── sample-hotspots.json     # Data titik api contoh (tanpa FIRMS key)
│   │
│   └── i18n/
│       └── id.ts                    # Semua string UI (Bahasa Indonesia)
│
├── scripts/
│   └── backtest.ts                  # CLI backtest engine vs data historis
│
├── docs/
│   ├── backtest-pekanbaru.csv       # Hasil backtest Sep–Okt 2023
│   ├── backtest-palangka-raya.csv   # Hasil backtest Sep–Okt 2023
│   └── backtest-jambi.csv           # Hasil backtest Sep–Okt 2023
│
├── public/
│   ├── sw.js                        # Service worker (PWA offline)
│   └── icons/                       # PWA icons 192px + 512px
│
└── __tests__/                       # 62 tes Vitest + fast-check
```

---

## 🔌 API Routes

Semua route mengembalikan `ApiEnvelope<T>`:
```typescript
{ data: T, source: string, fetchedAt: string, stale: boolean, demo?: boolean }
```

### GET `/api/air`

Mengambil kualitas udara dari Open-Meteo CAMS untuk **semua 66 kota sekaligus** (batch per 50).

```typescript
// Response per kota
{
  cityId: string,
  pm25: number | null,         // µg/m³ saat ini
  ispuNow: IspuResult | null,  // ISPU jam ini
  ispu24h: IspuResult | null,  // ISPU 24-jam rolling mean
  status: SchoolStatus,        // Normal / Waspada / Hybrid / Daring
  statusVulnerable: SchoolStatus, // Versi mode rentan
  tomorrow: { date, status, peakIspu, window } | null,
  hourly: Array<{ time, pm25, ispu, forecast: boolean }>
}
```

### GET `/api/hotspots`

```typescript
// Response
{
  clusters: RichCluster[],  // Cluster titik api + drift + nearestCity
  threat: Array<{ cityId, clusters, earliestEtaHours }>, // Ranking kota terancam
  latestUtc: string,
  sourcesOk: string[]       // ["VIIRS_SNPP_NRT", "VIIRS_NOAA20_NRT", "VIIRS_NOAA21_NRT"]
}
```

### GET `/api/facilities?kota=pekanbaru`

Gabungan OSM Overpass + 40 seed facilities, deduplikasi by name/proximity (<0.2 km), sort by distance.

### POST `/api/reports`

Rate-limit: 5 req/menit per IP. Validasi Zod. Tidak menyimpan koordinat GPS mentah.

```typescript
body: { cityId, description, evidenceHash, status, reportId }
```

### POST `/api/stock`

Rate-limit: 5 req/menit per IP. Memerlukan `ADMIN_PASSCODE`.

```typescript
body: { facilityId, updates: Record<string, "BANYAK"|"MENIPIS"|"HABIS">, passcode }
```

---

## 📊 Validasi & Backtest

### Pengujian Unit & Property-Based

```
62 tes lulus — zero failure
```

Cakupan tes mencakup:

| Area | Jenis Tes |
|------|-----------|
| Batas ISPU (15.5/15.6, 55.4/55.5, 150.4/150.5) | Unit tes per breakpoint |
| Histeresis sekolah (3 jam hysteresis) | Unit tes urutan jam |
| Data kosong / `null` | Boundary tes |
| Mode rentan (offset 50 ISPU) | Unit tes |
| Prakiraan besok (forecastSchoolDay) | Unit tes jam sekolah 06.00–13.00 |
| Arah asap + perubahan angin (simulateDrift) | Unit tes + property-based |
| Zona waktu (WIB / WITA / WIT) | Unit tes per timezone |
| Deduplikasi 3 satelit | Unit tes overlap grid |
| Status bukti foto (EXIF) | Unit tes timestamp + radius GPS |
| Integritas audit log hash-chain | Unit tes chain break detection |
| ISPU monoton + status tidak turun tanpa hysteresis | Property-based (fast-check, ribuan input) |

```bash
npm run test       # Jalankan 62 tes
npm run typecheck  # TypeScript strict check
npm run lint       # ESLint (0 error)
```

---

### Backtest Historis (Sep–Okt 2023)

Script `scripts/backtest.ts` memutar ulang data PM2.5 historis Open-Meteo melalui engine status sekolah untuk memvalidasi logika terhadap kejadian nyata.

```bash
# Default: Jambi, Sep–Okt 2023
npm run backtest

# Custom kota dan periode
npx tsx scripts/backtest.ts \
  --city palangka-raya \
  --from 2023-09-01 \
  --to 2023-10-31 \
  --out docs/backtest-palangka-raya.csv
```

**Kota tersedia:** `pekanbaru` · `palangka-raya` · `jambi` · `pontianak` · `banjarmasin` · `samarinda` · `jakarta` · `bandung`

#### Hasil Backtest Sep–Okt 2023 (masing-masing 1.464 jam)

| Kota | 🟢 Normal | ⚠️ Waspada | 🟡 Hybrid | 🔴 Daring Darurat | Perubahan Status |
|------|----------|-----------|---------|-----------------|-----------------|
| **Palangka Raya** | 770 jam | 355 jam | 86 jam | **253 jam** | 145 kali |
| Pekanbaru | 1.403 jam | 61 jam | 0 jam | 0 jam | 22 kali |
| Jambi | 1.452 jam | 12 jam | 0 jam | 0 jam | 4 kali |

> **Palangka Raya mengalami Daring Darurat selama 253 jam (~10,5 hari)** — konsisten dengan kebakaran gambut masif Kalimantan Tengah September–Oktober 2023 yang tercatat secara historis.

**Format output CSV:**

| Kolom | Keterangan |
|-------|-----------|
| `time` | Waktu lokal ISO (`YYYY-MM-DDTHH:mm`) |
| `pm25` | PM2.5 µg/m³ dari Open-Meteo CAMS historis |
| `ispu_now` | ISPU jam tersebut |
| `ispu_24h` | ISPU rolling mean 24 jam |
| `status_normal` | Status sekolah (ambang standar) |
| `status_vulnerable` | Status sekolah (mode rentan, offset −50 ISPU) |

---

## 🚀 Setup & Menjalankan

### Prasyarat

- Node.js 20+
- npm

### Instalasi

```bash
# 1. Clone repositori
git clone <url-repo>
cd Karhutla2026-DW

# 2. Install dependensi
npm install

# 3. Setup variabel lingkungan
cp .env.example .env.local
# Buka .env.local dan isi nilai yang diperlukan (lihat seksi berikutnya)

# 4. Jalankan development server
npm run dev
# → http://localhost:3000
```

### Perintah Tersedia

```bash
npm run dev          # Development server (http://localhost:3000)
npm run build        # Build produksi
npm run start        # Jalankan build produksi
npm run test         # Vitest — 62 tes (single run)
npm run typecheck    # TypeScript strict check
npm run lint         # ESLint
npm run backtest     # Backtest engine vs data historis (Jambi default)
```

> Tanpa `FIRMS_MAP_KEY`, hotspot menggunakan data contoh sintetis berlabel **"Contoh, bukan live"** — semua fitur lain berjalan penuh.

---

## 🔑 Konfigurasi Lingkungan

| Variabel | Wajib | Default | Keterangan |
|----------|-------|---------|-----------|
| `FIRMS_MAP_KEY` | Disarankan | — | Key NASA FIRMS (gratis di [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov/api/map_key)). Tanpa ini → mode demo |
| `NEXT_PUBLIC_SUPABASE_URL` | Tidak | — | Supabase project URL untuk persistence laporan & stok |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tidak | — | Supabase anon key |
| `ADMIN_PASSCODE` | Tidak | `change-me` | Passcode untuk update stok posko |
| `NEXT_PUBLIC_DEMO_PIN` | Tidak | `2026` | PIN demo kepala sekolah untuk persetujuan |
| `NEXT_PUBLIC_BASE_URL` | Tidak | — | URL base untuk server-side fetch `/s/[school]` di Vercel |

---

## ☁️ Deployment

### Vercel (Disarankan)

**Opsi A — via CLI:**
```bash
# Install dan login
npm i -g vercel
vercel login

# Deploy ke produksi
vercel --prod --yes

# Set environment variables
vercel env add FIRMS_MAP_KEY production
vercel env add ADMIN_PASSCODE production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

**Opsi B — via Dashboard:**
1. Push ke GitHub
2. Connect repo di [vercel.com/new](https://vercel.com/new)
3. Tambahkan env vars di Settings → Environment Variables
4. Setiap push ke `master` akan auto-deploy

---

## ⚠️ Keterbatasan & Kejujuran Data

Proyek ini dibangun dengan **kejujuran data sebagai prinsip utama**. Setiap keterbatasan ditampilkan langsung di UI.

| Keterbatasan | Penjelasan |
|-------------|-----------|
| **Resolusi CAMS** | Open-Meteo CAMS adalah model 40 km — bukan pengukuran stasiun fisik. Nilai PM2.5 adalah estimasi model, bukan data ISPU resmi BMKG. |
| **Titik panas ≠ Kebakaran** | Hotspot FIRMS mendeteksi anomali termal. Bisa berupa kebakaran aktif, gas flare industri, atau artefak data. |
| **Simulasi asap sangat sederhana** | Model adveksi plume adalah cone linier sederhana — jauh dari akurasi model dispersi BMKG/BNPB. |
| **EXIF bisa dipalsukan** | Metadata foto bisa diedit. Sistem hanya membantu verifikasi, bukan menjamin keaslian. |
| **Bukan sistem resmi** | PyroAlert **bukan pengganti** keputusan resmi BMKG, BNPB, atau Dinas Kesehatan. Engine merekomendasikan; pejabat yang berwenang memutuskan. |

---

## 📜 Lisensi Data

| Sumber Data | Lisensi |
|-------------|---------|
| Open-Meteo (CAMS, Forecast, Historical) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| NASA FIRMS VIIRS | Domain Publik |
| OpenStreetMap Overpass | [ODbL 1.0](https://opendatacommons.org/licenses/odbl/) |
| Kode sumber proyek | MIT |

---

## 👨‍💻 Tentang Proyek

Proyek ini dibuat oleh **Muhammad Salman Al Farisi** (`@avlfarizii`) sebagai proyek riset dan edukasi mengenai sistem informasi kebencanaan berbasis data terbuka.

Desain sistem mengutamakan:
- **Transparansi** — setiap keputusan bisa ditelusuri sumbernya
- **Offline-first** — bekerja saat koneksi buruk via PWA + SWR cache
- **Kejujuran data** — keterbatasan ditampilkan, bukan disembunyikan
- **Dapat diaudit** — log keputusan sekolah menggunakan hash-chain SHA-256

---

<div align="center">

*PyroAlert Karhutla '26 adalah proyek riset pendidikan.*  
*Engine merekomendasikan; manusia memutuskan.*

**🌐 [eduair.vercel.app](https://eduair.vercel.app)**

</div>
