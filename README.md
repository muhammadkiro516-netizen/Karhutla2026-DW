# EduAir — Status Udara & Sekolah Karhutla

> **Demo live:** [https://eduair.vercel.app](https://eduair.vercel.app)

Web app Indonesia yang mengubah data satelit titik api + kualitas udara + angin menjadi **satu keputusan**: status sekolah (Normal / Waspada / Hybrid / Daring Darurat), ETA asap menuju kota, fasilitas kesehatan terdekat, dan laporan warga terverifikasi.

---

## Fitur Utama

| Tab | Isi |
|-----|-----|
| **Udara** | ISPU per jam (PM2.5 CAMS), prakiraan 2 hari, grafik, 8 kota |
| **Sekolah** | Engine status otomatis, persetujuan Kepala Sekolah, log audit hash-chain, QR poster, WhatsApp |
| **Titik Api** | NASA FIRMS VIIRS (3 satelit), peta Leaflet interaktif, simulasi sebaran asap |
| **Posko** | Fasilitas kesehatan OSM + seed (40 entri), stok APD, laporan warga EXIF |

**Landing page** di `/` dengan animasi kebakaran cartoon + penjelasan cara kerja.

---

## Stack

- **Next.js 16** App Router · TypeScript strict · Tailwind CSS v4
- **SWR** + **Zod** + **Recharts** + **Framer Motion** + **Leaflet**
- Data: Open-Meteo CAMS, NASA FIRMS VIIRS, OpenStreetMap Overpass
- Opsional: Supabase untuk persistence laporan & stok

---

## Setup

```bash
cp .env.example .env.local
# Isi FIRMS_MAP_KEY dari https://firms.modaps.eosdis.nasa.gov/api/map_key/

npm install
npm run dev        # http://localhost:3000
```

Tanpa `FIRMS_MAP_KEY` → hotspot pakai data contoh sintetis dengan chip "Contoh, bukan live".

---

## Variabel Lingkungan

| Variabel | Wajib | Keterangan |
|---|---|---|
| `FIRMS_MAP_KEY` | Disarankan | Key NASA FIRMS gratis. Tanpa ini → demo mode |
| `NEXT_PUBLIC_SUPABASE_URL` | Tidak | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tidak | Supabase anon key |
| `ADMIN_PASSCODE` | Tidak | Passcode update stok posko (default: `change-me`) |
| `NEXT_PUBLIC_DEMO_PIN` | Tidak | PIN demo Kepala Sekolah (default: `2026`) |
| `NEXT_PUBLIC_BASE_URL` | Tidak | URL untuk server-side fetch `/s/[school]` |

---

## Perintah

```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Vitest — 62 tests
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint (0 errors)
npm run backtest     # Lihat bagian Backtest di bawah
```

---

## Deploy ke Vercel

```bash
# Login sekali
npx vercel login

# Deploy production
npx vercel --prod --yes

# Set env vars
npx vercel env add FIRMS_MAP_KEY production
npx vercel env add ADMIN_PASSCODE production
```

Atau connect repo GitHub ke Vercel dashboard → auto-deploy setiap push ke `master`.

---

## Backtest Evaluasi Engine

Replay data historis PM2.5 melalui engine status sekolah:

```bash
# Default: Jambi, Sep–Okt 2023
npm run backtest

# Custom city & periode
npx tsx scripts/backtest.ts --city palangka-raya --from 2023-09-01 --to 2023-10-31 --out docs/backtest-palangka-raya.csv

# Kota tersedia: pekanbaru, palangka-raya, jambi, pontianak, banjarmasin, samarinda, jakarta, bandung
```

### Hasil Backtest Sep–Okt 2023 (1.464 jam/kota)

| Kota | Normal | Waspada | Hybrid | Daring | Perubahan status |
|------|--------|---------|--------|--------|-----------------|
| **Palangka Raya** | 770j | 355j | 86j | **253j** | 145 |
| Jambi | 1.452j | 12j | 0j | 0j | 4 |
| Pekanbaru | 1.403j | 61j | 0j | 0j | 22 |

> Palangka Raya mengalami Daring Darurat 253 jam (≈10,5 hari) — konsisten dengan kebakaran gambut masif Kalteng 2023.
> CSV lengkap tersedia di `docs/backtest-*.csv`.

**Catatan keterbatasan proxy forecast:**
- Proxy forecast = seri aktual digeser — tidak merepresentasikan akurasi prakiraan nyata.
- Engine ini bukan model meteorologi; hanya replay ISPU berdasarkan aturan Permen LHK P.14/2020.

---

## Data Seed (Demo)

| Entitas | Jumlah |
|---------|--------|
| Sekolah | **128** (8 kota × 10–20 sekolah, semua jenjang) |
| Fasilitas kesehatan | **40** (RS, Puskesmas, Apotek, Posko BPBD) |

Semua seed data ditampilkan dengan chip "Data demo" — tidak mengklaim sebagai data resmi.

---

## Keterbatasan (Jujur)

- CAMS ≈ model 40 km, bukan stasiun pengukuran
- Titik panas ≠ kebakaran terkonfirmasi
- Model sebaran asap sangat sederhana, bukan prakiraan BMKG/BNPB
- EXIF foto dapat dipalsukan
- **Bukan pengganti sistem resmi BMKG, BNPB, atau Dinas Kesehatan**

---

## Lisensi Data

- Open-Meteo (CAMS): CC BY 4.0
- NASA FIRMS VIIRS: Domain publik
- OpenStreetMap: ODbL
- Kode: MIT

---

*EduAir adalah proyek riset pendidikan. Engine merekomendasikan; manusia memutuskan.*
