# EduAir × Kiro Kit — cara pakai

Kit ini menggantikan "satu prompt raksasa". Prompt raksasa membuat Kiro membaca ulang ribuan kata di setiap giliran dan menebak urutan kerja. Di sini konteks dipecah sehingga Kiro hanya memuat yang relevan, dan bagian yang paling rawan salah (rumus ISPU, aturan sekolah, prediksi asap, validasi bukti, log audit) **sudah ditulis dan lulus 55 tes**.

## Isi kit

| Lokasi | Fungsi | Kapan dimuat Kiro |
|---|---|---|
| `src/config`, `src/types`, `src/lib` (+ `__tests__`) | Inti domain siap pakai | Saat diimpor/dibuka |
| `.kiro/steering/product.md`, `tech.md`, `structure.md` | Aturan inti, ringkas | Selalu (≈90 baris total) |
| `.kiro/steering/ui-system.md` | Sistem desain | Hanya saat menyunting file UI (`fileMatch`) |
| `.kiro/steering/api-rules.md` | URL API, cache, envelope | Hanya saat menyunting `api/`, `server/`, `hooks/` |
| `.kiro/steering/domain-rules.md` | Aturan logika inti | Hanya saat menyunting `lib/`, `config/` |
| `.kiro/steering/vibe.md`, `bugfix.md`, `polish.md`, `demo-check.md`, `sync-spec.md` | Mode vibe sebagai slash command | Hanya saat Anda ketik `/vibe`, `/bugfix`, dst. |
| `.kiro/specs/01…07` | Spec bertahap (requirements → design → tasks) | Hanya spec yang sedang dikerjakan |
| `.kiro/hooks/*.json` | Tes, lint, typecheck otomatis | Jalan sendiri; berupa perintah shell, tidak memakai token model kecuali gagal |
| `.kiroignore` | Menyembunyikan `node_modules`, `.next`, `.env` dari agen | Selalu |

## Langkah 1 — siapkan proyek (5 menit, tanpa Kiro)

```bash
npx create-next-app@latest eduair --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
cd eduair
# salin SELURUH isi kit ini ke folder eduair (timpa jika ditanya), termasuk folder tersembunyi .kiro
cp .env.example .env.local   # isi FIRMS_MAP_KEY
git init && git add -A && git commit -m "scaffold + eduair kit"
```
Daftar MAP_KEY gratis di firms.modaps.eosdis.nasa.gov/api/map_key. Tanpa key, aplikasi tetap jalan dengan data contoh berlabel.

## Langkah 2 — kerjakan spec satu per satu (mode Spec)

1. Buka Kiro → panel **Specs** → `01-foundation` → `tasks.md`.
2. Klik **Start task** pada tugas 1. Setelah selesai, hook `gate-after-task` menjalankan typecheck + tes. Lanjut tugas berikutnya hanya kalau hijau.
3. Setelah satu spec selesai: `git commit`, lalu **buka sesi chat baru** untuk spec berikutnya. Sesi baru = konteks bersih = hemat token.
4. Urutan wajib: 01 → 02 → 03 → 04 → 05 → 06 → 07. Spec 03–06 bisa ditukar urutannya.

Karena requirements, design, dan tasks sudah ditulis, **Kiro tidak perlu membuat spec dari nol**. Itu tahap paling boros token di Kiro, dan di kit ini sudah dilewati.

Kalau Kiro meminta konfirmasi untuk regenerasi requirements/design, jawab: *"Spec sudah final. Jangan regenerasi; langsung kerjakan tasks."*

### Prompt pembuka per sesi (salin ke chat jika tidak memakai tombol Start task)

```
Kerjakan .kiro/specs/0X-<nama>/tasks.md tugas N saja.
Baca hanya file yang disebut tugas itu + design.md spec ini.
Inti domain di src/lib sudah selesai dan teruji: impor, jangan tulis ulang.
Selesai = typecheck + tes hijau. Laporkan ≤5 baris.
```

## Langkah 3 — gabungkan dengan mode Vibe

Spec untuk kerangka dan perilaku; vibe untuk poles cepat. Aturan mainnya sudah ditanam di steering:

| Situasi | Ketik di chat |
|---|---|
| Ubah warna, jarak, teks, animasi | `/vibe perbesar angka ISPU di hero dan beri jarak 24px` |
| Ada error/bug | `/bugfix grafik kosong di Samarinda, error: ...` |
| Rapikan satu layar | `/polish sekolah` |
| Setelah beberapa vibe yang mengubah perilaku | `/sync-spec` (mencatat perubahan ke spec, append-only) |
| H-1 presentasi | `/demo-check` |

`/vibe` dilarang menyentuh `src/lib`, `src/config`, ambang, dan aturan kejujuran data. Jika permintaan menyentuh area itu, Kiro akan berhenti dan bilang "butuh spec". Ini mencegah vibe merusak logika yang dipertahankan saat sidang.

## Tips hemat token (yang benar-benar berpengaruh)

1. **Satu tugas per giliran, satu spec per sesi.** Riwayat chat yang panjang adalah pemakan token terbesar.
2. **Supervised mode untuk spec 01–02**, Autopilot boleh untuk 03–07 setelah fondasi stabil. Kesalahan di fondasi mahal untuk diulang.
3. **Pakai checkpoint/rewind** bila hasil melenceng, jangan berdebat panjang di chat.
4. **Jangan tempel file utuh ke chat.** Rujuk dengan `#File` atau path; steering sudah memakai `#[[file:...]]` untuk config.
5. **Kirim screenshot + 1 kalimat** untuk masalah visual, bukan deskripsi panjang.
6. Untuk tugas ringan (copy, warna), pilih model yang lebih ringan bila tersedia di akun Anda; simpan model terkuat untuk spec 02 dan 04.

## Cek mandiri inti domain

```bash
npx vitest run     # harus 55 lulus
```
Tes mencakup batas ISPU (15,5/15,6, 55,4/55,5, dst.), histeresis sekolah, data kosong, mode rentan, prakiraan besok, arah asap termasuk perubahan angin, zona WIB/WITA, deduplikasi 3 satelit, status bukti foto, dan deteksi perubahan log audit. Beberapa tes adalah property-based (fast-check): ribuan input acak untuk memastikan ISPU monoton dan status tidak pernah turun tanpa 3 jam tenang.

## Yang wajib diverifikasi tim sendiri

- Nomor darurat di `src/i18n/id.ts` (112, 119, 117) sebelum presentasi.
- Angka luas karhutla terbaru dari SiPongi untuk slide.
- Bahwa Permen LHK P.14/2020 masih menjadi acuan ISPU yang berlaku.
