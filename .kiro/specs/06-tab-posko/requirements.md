# 06 Tab Posko — Requirements

## R1 Facilities
1.1 THE SYSTEM SHALL list facilities for the selected city (Overpass + seeded regional hospitals) with type icon, name, address/phone if available, distance (from user if location allowed, else from city centre), "Arahkan" link to Google Maps and "Telepon" `tel:` link when phone exists.
1.2 Filters: jenis (RS, Puskesmas/Klinik, Apotek, Posko masker), ketersediaan (ada N95 / ada ruang bersih), search. Sorted by distance.
1.3 Data from OpenStreetMap SHALL show attribution "© OpenStreetMap contributors".

## R2 Stock (demo, updatable)
2.1 Each facility SHALL show stock chips: Masker N95 (Banyak/Menipis/Habis), Oksigen (Tersedia/Terbatas/Habis), Ruang Udara Bersih (Ada/Tidak), "diperbarui N menit lalu", labeled "Data demo" unless Supabase is configured.
2.2 WHEN role Petugas (PIN) is active THE SYSTEM SHALL allow editing stock in a Sheet, saving via `/api/stock` (passcode header) or localStorage in demo, updating `updated_at`.
2.3 Stock older than 24 h SHALL be greyed with "mungkin tidak akurat".

## R3 Citizen report with evidence
3.1 "Laporkan / Minta Bantuan" opens a Sheet: city, kategori (Asap tebal, Sesak napas, Butuh masker, Butuh evakuasi, Lainnya), deskripsi (≤280 chars), foto (camera capture).
3.2 ON photo select THE SYSTEM SHALL, in the browser only: read EXIF (exifr: DateTimeOriginal, GPS), compute SHA-256, run `classifyEvidence`, and show waktu foto, jarak ke kota, hash (12 chars + copy), status badge, reasons, and `EVIDENCE_DISCLAIMER`. HEIC/no-EXIF → guidance text.
3.3 THE SYSTEM SHALL NOT upload the photo; it stores only category, description, city, status, distance (rounded km), hash, photo time.
3.4 ON submit THE SYSTEM SHALL return a report ID (e.g. `LPR-20261021-4F2A`) and show it in "Laporan terbaru" (no GPS, no photo), plus a WhatsApp share to the posko.
3.5 WHEN category is "Sesak napas" or "Butuh evakuasi" THE SYSTEM SHALL show emergency numbers immediately above the submit button.

## R4 Emergency & self-help
4.1 Emergency card: 112 (darurat terpadu), 119 (ambulans/SPGDT), 117 (BNPB) — read from `src/i18n/id.ts`, with "nomor diverifikasi tim pada {tanggal}".
4.2 Self-help card: cara memilih & memakai masker N95 untuk dewasa/anak, membuat ruang udara bersih di rumah (tutup celah, filter HEPA / kipas + filter (DIY), hindari bakar sampah/obat nyamuk bakar), tanda bahaya yang perlu ke faskes.

## Change log (vibe)
