// Single source of truth for cities. Do NOT duplicate coordinates elsewhere.
// tz matters: Kalimantan Selatan & Timur use WITA (UTC+8), not WIB.
export const CITIES = [
  { id: "pekanbaru", name: "Pekanbaru", province: "Riau", lat: 0.5071, lon: 101.4478, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "palangka-raya", name: "Palangka Raya", province: "Kalimantan Tengah", lat: -2.2161, lon: 113.9135, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "jambi", name: "Jambi", province: "Jambi", lat: -1.6101, lon: 103.6131, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "pontianak", name: "Pontianak", province: "Kalimantan Barat", lat: -0.0263, lon: 109.3425, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "banjarmasin", name: "Banjarmasin", province: "Kalimantan Selatan", lat: -3.3194, lon: 114.5908, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "samarinda", name: "Samarinda", province: "Kalimantan Timur", lat: -0.5022, lon: 117.1536, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "jakarta", name: "Jakarta", province: "DKI Jakarta", lat: -6.2088, lon: 106.8456, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "bandung", name: "Bandung", province: "Jawa Barat", lat: -6.9175, lon: 107.6191, tz: "Asia/Jakarta", tzLabel: "WIB" },
] as const;

export type CityId = (typeof CITIES)[number]["id"];
export type City = (typeof CITIES)[number];
export const DEFAULT_CITY: CityId = "pekanbaru";
export const getCity = (id: string): City | undefined => CITIES.find((c) => c.id === id);

// Approximate province bounding boxes [west, south, east, north] for hotspot region chips.
// Labeled "perkiraan" in UI: boxes overlap borders slightly.
export const REGIONS = [
  { id: "riau", name: "Riau", bbox: [100.0, -1.2, 103.9, 2.9] },
  { id: "jambi", name: "Jambi", bbox: [101.1, -2.8, 104.6, -0.7] },
  { id: "sumsel", name: "Sumatera Selatan", bbox: [102.0, -5.0, 106.2, -1.6] },
  { id: "kalbar", name: "Kalimantan Barat", bbox: [108.6, -3.1, 114.2, 2.1] },
  { id: "kalteng", name: "Kalimantan Tengah", bbox: [110.7, -3.6, 115.9, 0.8] },
  { id: "kalsel", name: "Kalimantan Selatan", bbox: [114.3, -4.2, 116.6, -1.3] },
  { id: "kaltim", name: "Kalimantan Timur", bbox: [113.8, -2.6, 119.1, 2.6] },
] as const;

// FIRMS request area (Indonesia) and VIIRS sources merged + de-duplicated.
export const INDONESIA_BBOX = [95, -11, 141, 6] as const;
export const FIRMS_SOURCES = ["VIIRS_SNPP_NRT", "VIIRS_NOAA20_NRT", "VIIRS_NOAA21_NRT"] as const;
