# 03 Tab Udara — Requirements

## R1 Hero (5-second answer)
1.1 THE SYSTEM SHALL show for the selected city: ISPU per jam (big number, count-up), category label + icon, one advice sentence (`adviceFor`, vulnerable-aware), and a gradient from the official ISPU colour.
1.2 THE SYSTEM SHALL show a secondary line "ISPU 24 jam: N (kategori) • US AQI: N" with an info button explaining the difference.
1.3 THE SYSTEM SHALL show 4 pills: PM2.5 (µg/m³), Suhu, Kelembapan, Angin (km/jam + arrow rotated to the direction the wind blows TOWARD + "dari {compassName}").
1.4 THE SYSTEM SHALL show SourceTag "Open-Meteo CAMS • HH.MM WIB/WITA".

## R2 Today & tomorrow recommendations
2.1 THE SYSTEM SHALL show "Rekomendasi Hari Ini": 3 icon lines (Sekolah, Aktivitas luar, Masker).
2.2 WHEN local time ≥ 18.00 THE SYSTEM SHALL show a "Besok" card with the forecast school status, peak ISPU during 06–13 and the label "berdasarkan prakiraan model".

## R3 Smoke attribution hint
3.1 WHEN the hotspot threat for this city has a drift ETA ≤ 12 h OR clusters within 150 km, AND PM2.5 rose over the last 6 h, THE SYSTEM SHALL show "Kemungkinan dipengaruhi asap karhutla" with a link to Tab Titik Api; otherwise nothing. Label as indikasi.

## R4 Chart
4.1 THE SYSTEM SHALL plot past 24 h (solid) and next 24 h (dashed) with ISPU colour bands, a "sekarang" marker, tooltip with local time, toggle ISPU / PM2.5. Lazy-loaded; hidden in Mode Hemat Data (replaced by min/max/now text).

## R5 Other cities
5.1 THE SYSTEM SHALL list all other cities sorted by worst ISPU now, each with dot colour, value, label; tapping switches city.

## R6 Read aloud
6.1 WHEN the user taps "Dengarkan" THE SYSTEM SHALL read the hero sentence with the Web Speech API (`id-ID`) if available; hide the button otherwise.

## Change log (vibe)
