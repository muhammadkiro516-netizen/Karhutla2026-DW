<div align="center">

# 🔥 PyroAlert Karhutla '26

**Aplikasi web peringatan dini kebakaran hutan & lahan Indonesia**

> Tiap musim kemarau, Sumatera dan Kalimantan diselimuti asap.  
> Ratusan sekolah tutup mendadak. Warga bingung harus ngapain.  
> PyroAlert hadir untuk menjawab satu pertanyaan paling penting:
>
> ***"Hari ini sekolah masuk atau tidak?"***

[![Live Demo](https://img.shields.io/badge/🌐_Coba_Langsung-eduair.vercel.app-orange?style=for-the-badge)](https://eduair.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tests](https://img.shields.io/badge/Tests-62_lulus-brightgreen?style=for-the-badge)](https://vitest.dev)

</div>

---

## 🤔 Masalahnya Apa?

Setiap tahun, kebakaran gambut di Kalimantan dan Sumatera menghasilkan asap tebal yang menyebar ke kota-kota. PM2.5 (partikel berbahaya di udara) bisa melonjak sampai **500 µg/m³** — padahal batas aman WHO hanya 15 µg/m³.

Yang terjadi selama ini:
- Orang tua tidak tahu apakah udara aman buat anak pergi sekolah
- Kepala sekolah membuat keputusan sendiri-sendiri tanpa dasar yang sama
- Tidak ada sistem yang menggabungkan data titik api + kualitas udara + rekomendasi sekolah dalam satu tempat

**PyroAlert menjawab ini** dengan membaca data satelit NASA secara otomatis, menghitung kualitas udara berdasarkan regulasi Indonesia (Permen LHK P.14/2020), dan langsung mengeluarkan rekomendasi: *Normal, Waspada, Hybrid, atau Daring Darurat.*

---

## 🗺️ Cara Kerjanya (4 Langkah)

```
1. Satelit NASA (3 unit VIIRS) mendeteksi titik api di seluruh Indonesia
         ↓
2. Model udara Copernicus CAMS menghitung PM2.5 per jam untuk 66 kota
         ↓
3. Engine PyroAlert mengkonversi PM2.5 → ISPU → Status Sekolah
   (mengikuti aturan resmi Permen LHK P.14/2020)
         ↓
4. Hasilnya ditampilkan: status sekolah, ETA asap, fasilitas kesehatan terdekat
```

Semua data diperbarui otomatis — udara setiap 10 menit, titik api setiap 15 menit.

---

## 📱 Apa Saja yang Ada di Aplikasi?

Aplikasi dibagi jadi 4 tab:

---

### 🌬️ Tab Udara — *"Seberapa berbahaya udara sekarang?"*

Ini halaman utama. Begitu dibuka, langsung terlihat angka ISPU hari ini dengan warna yang jelas:
- 🟢 Hijau = Baik
- 🔵 Biru = Sedang
- 🟡 Kuning = Tidak Sehat
- 🔴 Merah = Sangat Tidak Sehat
- ⚫ Hitam = Berbahaya

Yang tersedia di tab ini:

| Fitur | Fungsinya |
|-------|-----------|
| Angka ISPU + warna | Kondisi udara saat ini secara sekilas |
| Grafik 48 jam | Lihat tren udara kemarin, hari ini, dan prakiraan besok |
| Heatmap per jam | Jam berapa udara paling buruk hari ini? |
| Kalkulator paparan | "Saya boleh di luar berapa lama?" |
| Risiko per kelompok | Anak-anak, lansia, ibu hamil punya risiko berbeda |
| Rekomendasi besok | Muncul tiap hari mulai jam 18.00 |
| Kompas angin | Dari mana arah asap datang? |
| Rekap bulanan | Seberapa parah dibanding bulan lalu? |
| Semua 66 kota | Lihat kondisi kota lain sekaligus |

---

### 🏫 Tab Sekolah — *"Sekolah masuk atau tidak?"*

Ini inti dari PyroAlert. Engine secara otomatis menghitung status untuk setiap sekolah.

**4 level status:**

| Status | Artinya |
|--------|---------|
| ✅ Normal | Aman, sekolah seperti biasa |
| ⚠️ Waspada | Mulai waspada, pantau terus |
| 🟡 Hybrid | Sebagian masuk, sebagian online |
| 🔴 Daring Darurat | Semua belajar dari rumah |

**Alur keputusan untuk Kepala Sekolah:**
1. Engine memberi rekomendasi otomatis
2. Kepala Sekolah bisa approve dengan PIN
3. Muncul teks pengumuman resmi siap kirim ke WhatsApp
4. QR code per sekolah bisa ditempel di pintu — orang tua scan untuk cek status

Semua keputusan tersimpan di **audit log hash-chain** — tidak bisa diedit diam-diam, tercatat permanen.

**Mode Rentan** tersedia untuk PAUD dan SLB — semua ambang diturunkan 50 poin ISPU karena anak kecil dan penyandang disabilitas lebih rentan.

---

### 🛰️ Tab Titik Api — *"Di mana kebakaran sekarang?"*

Peta interaktif yang menampilkan titik api aktif dari 3 satelit NASA VIIRS secara real-time.

| Fitur | Fungsinya |
|-------|-----------|
| Peta Leaflet | Lihat posisi titik api dan kota sekaligus |
| Simulasi sebaran asap | Asap dari titik api ini akan sampai ke kota mana? Berapa jam? |
| Ranking ancaman | Kota mana yang paling terancam saat ini? |
| Filter per provinsi | Fokus ke Riau, Kalbar, Kalteng, dll. |

> **Catatan jujur:** Titik api di peta belum tentu kebakaran sungguhan — bisa juga gas flare industri atau artefak data satelit. Kami tampilkan disclaimer ini langsung di aplikasi.

---

### 🏥 Tab Posko — *"Kalau sudah sesak napas, ke mana?"*

Direktori fasilitas kesehatan terdekat saat kondisi darurat.

| Fitur | Fungsinya |
|-------|-----------|
| Daftar RS, Puskesmas, Apotek, Posko BPBD | Fasilitas terdekat dari kota yang dipilih |
| Stok APD | Masker N95, nebulizer, oksigen — sudah ada atau habis? |
| Laporan warga | Foto kondisi udara bisa dikirim + diverifikasi via EXIF |
| Nomor darurat | 112, 119, 117 ditampilkan besar saat kondisi kritis |

---

## ⚙️ Bagaimana Engine Menghitung Status Sekolah?

Ini yang membedakan PyroAlert dari sekadar menampilkan data. Kami mengimplementasikan **aturan resmi Permen LHK P.14/MENLHK/SETJEN/KUM.1/7/2020** dalam kode.

### Konversi PM2.5 → ISPU

PM2.5 adalah satuan partikel berbahaya (µg/m³). ISPU adalah indeks resmi Indonesia. Konversinya:

| PM2.5 (µg/m³) | ISPU | Kategori |
|---------------|------|----------|
| 0 – 15.5 | 0 – 50 | 🟢 Baik |
| 15.6 – 55.4 | 51 – 100 | 🔵 Sedang |
| 55.5 – 150.4 | 101 – 200 | 🟡 Tidak Sehat |
| 150.5 – 250.4 | 201 – 300 | 🔴 Sangat Tidak Sehat |
| 250.5 – 500 | 301 – 500 | ⚫ Berbahaya |

### Kapan Status Sekolah Berubah?

| Ke level ini | Butuh ISPU | Selama berapa jam berturut-turut |
|-------------|-----------|----------------------------------|
| Waspada | > 100 | 1 jam |
| Hybrid | > 150 | 3 jam |
| Daring Darurat | > 200 | 2 jam |

**Histeresis (perlindungan status):** Setelah status naik, tidak langsung turun begitu udara membaik. Harus 3 jam berturut-turut di bawah ambang baru status turun. Ini mencegah status bolak-balik yang membingungkan.

---

## 🌍 Data dari Mana?

Semua sumber data yang digunakan **gratis dan terbuka**:

| Sumber | Untuk apa | Perlu daftar? |
|--------|-----------|---------------|
| NASA FIRMS VIIRS | Titik api aktif (3 satelit) | Gratis, butuh key |
| Open-Meteo CAMS | Kualitas udara (PM2.5, PM10) untuk 66 kota | Gratis, langsung |
| Open-Meteo Forecast | Data angin dan cuaca | Gratis, langsung |
| OpenStreetMap Overpass | Fasilitas kesehatan sekitar kota | Gratis, langsung |
| Supabase | Simpan laporan warga & stok APD | Opsional |

> Kalau tidak punya NASA API key pun tidak masalah — aplikasi tetap jalan dengan data contoh berlabel **"Demo"**.

---

## 🛠️ Teknologi yang Dipakai

Tidak perlu hafal ini semua, tapi buat yang penasaran:

| Kategori | Teknologi |
|----------|-----------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript strict |
| Styling | Tailwind CSS v4 |
| Data fetching | SWR — otomatis refresh, cache offline |
| Validasi data | Zod — pastikan data dari API sesuai format |
| Peta | Leaflet — interaktif, zoom, klik cluster |
| Grafik | Recharts — grafik garis & batang |
| Animasi | Framer Motion |
| Database | Supabase (opsional) |
| Testing | Vitest + fast-check (property-based) |
| PWA | Service Worker — bisa dipakai offline |

---

## 📊 Apakah Engine-nya Akurat?

Kami menguji engine dengan data historis nyata. Script `backtest` memutar ulang PM2.5 historis September–Oktober 2023 melalui engine dan melihat hasilnya.

### Hasil Backtest Sep–Okt 2023

| Kota | Normal | Waspada | Hybrid | Daring Darurat |
|------|--------|---------|--------|----------------|
| **Palangka Raya** | 770 jam | 355 jam | 86 jam | **253 jam** |
| Pekanbaru | 1.403 jam | 61 jam | 0 jam | 0 jam |
| Jambi | 1.452 jam | 12 jam | 0 jam | 0 jam |

**Palangka Raya mengalami Daring Darurat selama 253 jam (~10,5 hari)** di periode itu — sesuai dengan catatan kebakaran gambut masif Kalimantan Tengah 2023 yang memang sangat parah.

Jalankan sendiri:
```bash
npm run backtest
# atau spesifik kota:
npx tsx scripts/backtest.ts --city palangka-raya --from 2023-09-01 --to 2023-10-31
```

---

## 🚀 Cara Menjalankan

```bash
# 1. Clone dan masuk folder
git clone https://github.com/muhammadkiro516-netizen/Karhutla2026-DW.git
cd Karhutla2026-DW

# 2. Install paket
npm install

# 3. Buat file .env.local
cp .env.example .env.local
# Isi FIRMS_MAP_KEY (gratis dari NASA) — atau biarkan kosong untuk mode demo

# 4. Jalankan
npm run dev
# Buka http://localhost:3000
```

### Variabel Lingkungan

| Variabel | Wajib? | Keterangan |
|----------|--------|-----------|
| `FIRMS_MAP_KEY` | Disarankan | Key NASA FIRMS — gratis di [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov/api/map_key) |
| `NEXT_PUBLIC_SUPABASE_URL` | Tidak | Untuk nyimpan laporan & stok (pakai Supabase) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tidak | Pasangannya URL Supabase |
| `ADMIN_PASSCODE` | Tidak | Password update stok posko (default: `change-me`) |
| `NEXT_PUBLIC_DEMO_PIN` | Tidak | PIN kepala sekolah demo (default: `2026`) |

### Perintah Lain

```bash
npm run build        # Build untuk produksi
npm run test         # Jalankan 62 tes otomatis
npm run typecheck    # Cek tipe TypeScript
npm run lint         # Cek kualitas kode
npm run backtest     # Backtest engine vs data historis
```

---

## ☁️ Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login dan deploy
vercel login
vercel --prod --yes

# Set variabel lingkungan
vercel env add FIRMS_MAP_KEY production
vercel env add ADMIN_PASSCODE production
```

Atau lebih mudah: connect repo GitHub ke [vercel.com/new](https://vercel.com/new) → otomatis deploy setiap push.

---

## ⚠️ Yang Perlu Diingat

Kami percaya bahwa jujur soal keterbatasan itu lebih penting dari terlihat sempurna.

| Keterbatasan | Penjelasannya |
|-------------|---------------|
| Data CAMS bukan alat ukur fisik | Open-Meteo CAMS adalah model matematika resolusi 40 km, bukan stasiun ISPU resmi BMKG |
| Titik api ≠ konfirmasi kebakaran | Satelit mendeteksi panas — bisa kebakaran, bisa juga gas flare atau artefak |
| Simulasi asap sangat sederhana | Kami pakai model cone linier, bukan model dispersi BMKG/BNPB yang sesungguhnya |
| EXIF bisa dimanipulasi | Verifikasi foto hanya membantu, bukan jaminan keaslian |
| **Bukan sistem resmi** | PyroAlert **tidak menggantikan** keputusan resmi dari BMKG, BNPB, atau Dinas Kesehatan |

---

## 📜 Lisensi Data

| Sumber | Lisensi |
|--------|---------|
| Open-Meteo | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| NASA FIRMS VIIRS | Domain Publik |
| OpenStreetMap | [ODbL 1.0](https://opendatacommons.org/licenses/odbl/) |
| Kode proyek ini | MIT |

---

<div align="center">

Dibuat oleh **Muhammad Salman Al Farisi** sebagai proyek riset sistem informasi kebencanaan berbasis data terbuka.

*Engine merekomendasikan. Manusia memutuskan.*

**🌐 [eduair.vercel.app](https://eduair.vercel.app)**

</div>
