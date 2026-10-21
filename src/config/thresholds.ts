// Every decision threshold lives here so a Dinas can tune them in one place.
// Sources: ISPU breakpoints PM2.5 per Permen LHK P.14/MENLHK/SETJEN/KUM.1/7/2020.

export const ISPU_PM25_BREAKPOINTS = [
  // [concLow, concHigh, ispuLow, ispuHigh, category]
  { cLo: 0, cHi: 15.5, iLo: 0, iHi: 50, category: "BAIK" },
  { cLo: 15.6, cHi: 55.4, iLo: 51, iHi: 100, category: "SEDANG" },
  { cLo: 55.5, cHi: 150.4, iLo: 101, iHi: 200, category: "TIDAK_SEHAT" },
  { cLo: 150.5, cHi: 250.4, iLo: 201, iHi: 300, category: "SANGAT_TIDAK_SEHAT" },
  { cLo: 250.5, cHi: 500, iLo: 301, iHi: 500, category: "BERBAHAYA" },
] as const;

export const SCHOOL_RULES = {
  waspada: { above: 100, hours: 1 },
  hybrid: { above: 150, hours: 3 },
  daring: { above: 200, hours: 2 },
  hysteresisHours: 3, // must stay below current level threshold this long to step down
  // Vulnerable mode (asthma, toddlers, pregnant, elderly) lowers every threshold.
  vulnerableOffset: 50,
  schoolHours: { start: 6, end: 13 }, // local hours used for "Rekomendasi Besok"
  tomorrowPublishHour: 18, // recommendation for tomorrow is shown from 18:00 local
} as const;

export const DRIFT = {
  maxHours: 24, // simulate at most 24 hourly steps
  baseHalfWidthKm: 10, // plume half-width at source
  spreadPerKm: 0.25, // half-width grows 0.25 km per km travelled (approx. 14 degree cone)
  minWindKmh: 2, // below this treat as calm (no ETA)
  coneFallbackDeg: 45, // legacy simple cone, used when no hourly wind series is available
  coneFallbackMaxKm: 300,
} as const;

export const HOTSPOT = {
  clusterCellDeg: 0.02, // ~2.2 km grid to merge duplicates across 3 satellites
  driftTopClusters: 40, // only top-N clusters by FRP get a wind trajectory (rate-limit friendly)
} as const;

export const EVIDENCE = {
  maxAgeHours: 24,
  futureSkewMinutes: 10,
  radiusKm: 50,
} as const;

export const CACHE_SECONDS = {
  air: 600,
  weather: 600,
  hotspots: 900,
  facilities: 86400,
} as const;
