# 04 Tab Sekolah — Requirements

## R1 School list & live status
1.1 THE SYSTEM SHALL list 3–4 seeded schools per city (labeled "Data demo") with level (SD/SMP/SMA/SLB) and a status badge computed from the city's real hourly ISPU via the school engine. SLB and PAUD/TK SHALL use vulnerable thresholds automatically.
1.2 Badges: Normal (hijau), Waspada (kuning), Hybrid (oranye), "🚨 DARURAT ASAP – SEKOLAH DARING" (merah, pulse). Each badge has icon + text.
1.3 WHEN a badge is tapped THE SYSTEM SHALL show "Kenapa?" with the engine `reason`, the last 6 hourly ISPU values, and the rule thresholds.

## R2 Tomorrow
2.1 THE SYSTEM SHALL show per city "Rekomendasi untuk besok" (from 18.00 local) so schools can decide the evening before.

## R3 Human approval & audit
3.1 A role switch (Orang Tua / Kepala Sekolah / Dinas; demo PIN for non-parent roles) SHALL control who can approve.
3.2 WHEN Kepala Sekolah taps "Setujui" THE SYSTEM SHALL record {time, city, school, ISPU, recommended, decided, approver, note} via `appendDecision`; the approver MAY override the level but SHALL then enter a reason.
3.3 THE SYSTEM SHALL show the audit log with "Rantai log utuh ✓" from `verifyChain`, or highlight the first broken entry.
3.4 Parents SHALL see "Status resmi" (last approved) separately from "Rekomendasi sistem".

## R4 Announcement & distribution
4.1 THE SYSTEM SHALL generate the formal announcement (`buildAnnouncement`) with buttons Salin, Bagikan ke WhatsApp (`waShareUrl`), Cetak/PDF (print stylesheet: A4, logo-less, large status).
4.2 THE SYSTEM SHALL generate a QR code poster linking to `/s/{school}` — a public, lightweight page showing official status, recommendation, time and advice, readable on low-end phones.

## R5 Simulation sandbox
5.1 A slider "Simulasi ISPU (0–400)" and "durasi (jam)" SHALL feed a synthetic series into the SAME engine, under a visible "Mode Simulasi" banner with Reset; simulated decisions SHALL NOT be written to the real audit log (separate list labeled simulasi).
5.2 Crossing >200 for ≥2 h SHALL instantly show the red state, pulse and announcement.

## R6 Explain the rule
6.1 A "Cara kerja" card SHALL show the 3 thresholds, durations, hysteresis and vulnerable offset, read from `thresholds.ts`.

## Change log (vibe)
