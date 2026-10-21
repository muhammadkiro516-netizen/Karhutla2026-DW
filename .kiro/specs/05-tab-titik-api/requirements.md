# 05 Tab Titik Api — Requirements

## R1 Overview
1.1 THE SYSTEM SHALL show summary tiles: jumlah kluster titik api (and raw detections), kluster kepercayaan Tinggi, wilayah terbanyak, and "Data satelit terakhir HH.MM" in local time.
1.2 THE SYSTEM SHALL explain in one line that 1 kluster = deteksi berdekatan (~2 km) dari 3 satelit VIIRS digabung agar tidak dihitung ganda.
1.3 IF data is sample THEN a prominent "Contoh, bukan live" chip SHALL appear.

## R2 "Kota paling terancam"
2.1 THE SYSTEM SHALL rank cities by number of clusters whose drift reaches them within 24 h, with earliest ETA ("asap bisa tiba ±3,5 jam lagi"), tap → filter list to those clusters.

## R3 Cluster list
3.1 Region chips: Semua, Riau, Jambi, Sumatera Selatan, Kalimantan Barat/Tengah/Selatan/Timur (approximate bbox, labeled "perkiraan wilayah"). Default: Semua.
3.2 Filters: kepercayaan (Semua/Tinggi/Sedang), sort (Terbaru / FRP tertinggi / Terdekat ke kota terpilih), search by nearest city name.
3.3 Each card: nearest city + distance, local detection time, confidence badge, FRP (MW) with plain explanation ("intensitas panas"), satellites count, and the drift sentence (`driftSentence`) for its earliest impact, or "Tidak mengarah ke kota pantauan dalam 24 jam".
3.4 Lists >100 items SHALL render incrementally (virtualize or "Muat lebih banyak" by 30).
3.5 Zero results SHALL show EmptyState with "Reset filter".

## R4 Honesty
4.1 Always show `DRIFT_DISCLAIMER` and "Titik panas ≠ kebakaran terkonfirmasi; konfirmasi lapangan oleh Manggala Agni/BPBD."

## Change log (vibe)
