# EduAir — Status Udara & Sekolah Karhutla

Web app Indonesia yang mengubah data satelit titik api + kualitas udara + angin menjadi keputusan: status sekolah (Normal/Waspada/Hybrid/Daring Darurat), ETA asap menuju kota, fasilitas kesehatan terdekat, dan laporan warga terverifikasi.

## Fitur Utama

- **Tab Udara** — ISPU per jam + 24 jam, saran hari ini, prakiraan besok (ab 18.00 lokal), grafik, kota lain
- **Tab Sekolah** — status per sekolah dengan engine otomatis, persetujuan Kepala Sekolah, log audit hash-chain, QR poster, pengumuman WhatsApp
- **Tab Titik Api** — klaster FIRMS VIIRS, simulasi sebaran asap, ranking ancaman per kota
- **Tab Posko** — fasilitas kesehatan OSM, stok alat bantu napas, laporan warga + verifikasi EXIF
- **PWA** — offline-ready dengan service worker, installable

## Stack

- Next.js 15 App Router + TypeScript strict
- Tailwind CSS v4 (CSS-first `@theme`)
- SWR + Zod + Recharts + Framer Motion
- Data: Open-Meteo CAMS, NASA FIRMS VIIRS, OpenStreetMap Overpass
- Opsional: Supabase untuk persistence

## Setup

```bash
cp .env.example .env.local
# Isi FIRMS_MAP_KEY dari https://firms.modaps.eosdis.nasa.gov/api/map_key/

npm install
npm run dev
```

Tanpa `FIRMS_MAP_KEY`, hotspot menggunakan data contoh sintetis dengan chip "Contoh, bukan live".

## Variabel Lingkungan

| Variabel | Wajib | Keterangan |
|---|---|---|
| `FIRMS_MAP_KEY` | Tidak | Key NASA FIRMS. Tanpa ini → demo mode |
| `NEXT_PUBLIC_SUPABASE_URL` | Tidak | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tidak | Supabase anon key |
| `ADMIN_PASSCODE` | Tidak | Passcode update stok posko |
| `OPENAQ_API_KEY` | Tidak | Opsional, tidak digunakan saat ini |

## Perintah

```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Vitest (62 tests)
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run backtest -- --city jambi --from 2023-09-01 --to 2023-10-31 --out hasil.csv
```

## Keterbatasan (Jujur)

- CAMS ≈ model 40 km, bukan stasiun pengukuran
- Titik panas ≠ kebakaran terkonfirmasi
- Model sebaran asap sangat sederhana, bukan prakiraan BMKG/BNPB
- EXIF foto dapat dipalsukan
- **Bukan pengganti sistem resmi BMKG, BNPB, atau Dinas Kesehatan**

## Lisensi

MIT — untuk penggunaan riset dan pendidikan.
