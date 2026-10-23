// Single source of truth for cities. Do NOT duplicate coordinates elsewhere.
// tz matters: Kalimantan Selatan & Timur use WITA (UTC+8), not WIB.
// Original 8 cities kept first (tests reference index 0 and 2).
export const CITIES = [
  // ── Original 8 (fire-prone priority) ──
  { id: "pekanbaru", name: "Pekanbaru", province: "Riau", lat: 0.5071, lon: 101.4478, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "palangka-raya", name: "Palangka Raya", province: "Kalimantan Tengah", lat: -2.2161, lon: 113.9135, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "jambi", name: "Jambi", province: "Jambi", lat: -1.6101, lon: 103.6131, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "pontianak", name: "Pontianak", province: "Kalimantan Barat", lat: -0.0263, lon: 109.3425, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "banjarmasin", name: "Banjarmasin", province: "Kalimantan Selatan", lat: -3.3194, lon: 114.5908, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "samarinda", name: "Samarinda", province: "Kalimantan Timur", lat: -0.5022, lon: 117.1536, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "jakarta", name: "Jakarta", province: "DKI Jakarta", lat: -6.2088, lon: 106.8456, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "bandung", name: "Bandung", province: "Jawa Barat", lat: -6.9175, lon: 107.6191, tz: "Asia/Jakarta", tzLabel: "WIB" },

  // ── Sumatera (WIB) ──
  { id: "banda-aceh", name: "Banda Aceh", province: "Aceh", lat: 5.5483, lon: 95.3238, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "lhokseumawe", name: "Lhokseumawe", province: "Aceh", lat: 5.1850, lon: 97.1400, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "medan", name: "Medan", province: "Sumatera Utara", lat: 3.5952, lon: 98.6722, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "pematangsiantar", name: "Pematangsiantar", province: "Sumatera Utara", lat: 2.9596, lon: 99.0613, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "padang", name: "Padang", province: "Sumatera Barat", lat: -0.9471, lon: 100.4172, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "bukittinggi", name: "Bukittinggi", province: "Sumatera Barat", lat: -0.3054, lon: 100.3692, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "dumai", name: "Dumai", province: "Riau", lat: 1.6667, lon: 101.3833, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "tanjung-pinang", name: "Tanjung Pinang", province: "Kepulauan Riau", lat: 0.9187, lon: 104.4538, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "batam", name: "Batam", province: "Kepulauan Riau", lat: 1.0482, lon: 104.0306, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "palembang", name: "Palembang", province: "Sumatera Selatan", lat: -2.9761, lon: 104.7755, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "lubuklinggau", name: "Lubuklinggau", province: "Sumatera Selatan", lat: -3.2950, lon: 102.8600, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "bengkulu", name: "Bengkulu", province: "Bengkulu", lat: -3.8004, lon: 102.2655, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "bandar-lampung", name: "Bandar Lampung", province: "Lampung", lat: -5.4284, lon: 105.2580, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "metro", name: "Metro", province: "Lampung", lat: -5.1070, lon: 105.3068, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "pangkal-pinang", name: "Pangkal Pinang", province: "Bangka Belitung", lat: -2.1319, lon: 106.1127, tz: "Asia/Jakarta", tzLabel: "WIB" },

  // ── Jawa (WIB) ──
  { id: "bogor", name: "Bogor", province: "Jawa Barat", lat: -6.5950, lon: 106.7897, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "depok", name: "Depok", province: "Jawa Barat", lat: -6.4096, lon: 106.8166, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "bekasi", name: "Bekasi", province: "Jawa Barat", lat: -6.2383, lon: 106.9756, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "tangerang", name: "Tangerang", province: "Banten", lat: -6.1783, lon: 106.6317, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "serang", name: "Serang", province: "Banten", lat: -6.1200, lon: 106.1503, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "cirebon", name: "Cirebon", province: "Jawa Barat", lat: -6.7333, lon: 108.5500, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "tasikmalaya", name: "Tasikmalaya", province: "Jawa Barat", lat: -7.3274, lon: 108.2027, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "semarang", name: "Semarang", province: "Jawa Tengah", lat: -6.9667, lon: 110.4167, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "solo", name: "Solo", province: "Jawa Tengah", lat: -7.5755, lon: 110.8243, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "tegal", name: "Tegal", province: "Jawa Tengah", lat: -6.8706, lon: 109.1400, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "yogyakarta", name: "Yogyakarta", province: "DI Yogyakarta", lat: -7.7956, lon: 110.3664, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "surabaya", name: "Surabaya", province: "Jawa Timur", lat: -7.2575, lon: 112.7521, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "malang", name: "Malang", province: "Jawa Timur", lat: -7.9666, lon: 112.6326, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "kediri", name: "Kediri", province: "Jawa Timur", lat: -7.8272, lon: 112.0200, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "madiun", name: "Madiun", province: "Jawa Timur", lat: -7.6298, lon: 111.5239, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "jember", name: "Jember", province: "Jawa Timur", lat: -8.3394, lon: 113.8184, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "banyuwangi", name: "Banyuwangi", province: "Jawa Timur", lat: -8.2192, lon: 114.3691, tz: "Asia/Jakarta", tzLabel: "WIB" },

  // ── Kalimantan (WIB / WITA) ──
  { id: "sampit", name: "Sampit", province: "Kalimantan Tengah", lat: -2.5333, lon: 113.1000, tz: "Asia/Jakarta", tzLabel: "WIB" },
  { id: "banjarbaru", name: "Banjarbaru", province: "Kalimantan Selatan", lat: -3.4500, lon: 114.8000, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "balikpapan", name: "Balikpapan", province: "Kalimantan Timur", lat: -1.2379, lon: 116.8529, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "nusantara", name: "Nusantara", province: "Kalimantan Timur", lat: -0.9733, lon: 116.7089, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "tarakan", name: "Tarakan", province: "Kalimantan Utara", lat: 3.3000, lon: 117.6333, tz: "Asia/Makassar", tzLabel: "WITA" },

  // ── Bali & Nusa Tenggara (WITA) ──
  { id: "denpasar", name: "Denpasar", province: "Bali", lat: -8.6705, lon: 115.2126, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "mataram", name: "Mataram", province: "Nusa Tenggara Barat", lat: -8.5833, lon: 116.1167, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "bima", name: "Bima", province: "Nusa Tenggara Barat", lat: -8.4600, lon: 118.7267, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "kupang", name: "Kupang", province: "Nusa Tenggara Timur", lat: -10.1772, lon: 123.6097, tz: "Asia/Makassar", tzLabel: "WITA" },

  // ── Sulawesi (WITA) ──
  { id: "makassar", name: "Makassar", province: "Sulawesi Selatan", lat: -5.1477, lon: 119.4327, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "palopo", name: "Palopo", province: "Sulawesi Selatan", lat: -2.9833, lon: 120.2000, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "palu", name: "Palu", province: "Sulawesi Tengah", lat: -0.8917, lon: 119.8707, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "kendari", name: "Kendari", province: "Sulawesi Tenggara", lat: -3.9985, lon: 122.5130, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "baubau", name: "Bau-Bau", province: "Sulawesi Tenggara", lat: -5.4833, lon: 122.6000, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "gorontalo", name: "Gorontalo", province: "Gorontalo", lat: 0.5435, lon: 123.0568, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "manado", name: "Manado", province: "Sulawesi Utara", lat: 1.4748, lon: 124.8421, tz: "Asia/Makassar", tzLabel: "WITA" },
  { id: "mamuju", name: "Mamuju", province: "Sulawesi Barat", lat: -2.6748, lon: 118.8885, tz: "Asia/Makassar", tzLabel: "WITA" },

  // ── Maluku (WIT) ──
  { id: "ambon", name: "Ambon", province: "Maluku", lat: -3.6954, lon: 128.1814, tz: "Asia/Jayapura", tzLabel: "WIT" },
  { id: "ternate", name: "Ternate", province: "Maluku Utara", lat: 0.7733, lon: 127.3722, tz: "Asia/Jayapura", tzLabel: "WIT" },

  // ── Papua (WIT) ──
  { id: "jayapura", name: "Jayapura", province: "Papua", lat: -2.5916, lon: 140.6690, tz: "Asia/Jayapura", tzLabel: "WIT" },
  { id: "manokwari", name: "Manokwari", province: "Papua Barat", lat: -0.8615, lon: 134.0620, tz: "Asia/Jayapura", tzLabel: "WIT" },
  { id: "sorong", name: "Sorong", province: "Papua Barat", lat: -0.8787, lon: 131.2550, tz: "Asia/Jayapura", tzLabel: "WIT" },
  { id: "nabire", name: "Nabire", province: "Papua Tengah", lat: -3.3742, lon: 135.5028, tz: "Asia/Jayapura", tzLabel: "WIT" },
  { id: "timika", name: "Timika", province: "Papua Tengah", lat: -4.5289, lon: 136.8869, tz: "Asia/Jayapura", tzLabel: "WIT" },
  { id: "merauke", name: "Merauke", province: "Papua Selatan", lat: -8.4932, lon: 140.4019, tz: "Asia/Jayapura", tzLabel: "WIT" },
] as const;

export type CityId = (typeof CITIES)[number]["id"];
export type City = (typeof CITIES)[number];
export const DEFAULT_CITY: CityId = "pekanbaru";
export const getCity = (id: string): City | undefined => CITIES.find((c) => c.id === id);

// Cities shown as quick-access chips (horizontal scroll). The rest are accessible via search.
export const POPULAR_CITY_IDS = [
  "pekanbaru", "jambi", "palangka-raya", "pontianak", "banjarmasin",
  "samarinda", "medan", "jakarta", "bandung", "surabaya", "makassar", "denpasar",
] as const;
export const POPULAR_CITIES = POPULAR_CITY_IDS
  .map(id => getCity(id))
  .filter((c): c is City => c !== undefined);

// Map province → island group for search UI grouping.
const ISLAND_PROVINCES: Record<string, string> = {};
const _islandGroups: Record<string, string[]> = {
  "Sumatera": ["Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi", "Sumatera Selatan", "Bengkulu", "Lampung", "Bangka Belitung"],
  "Jawa": ["DKI Jakarta", "Jawa Barat", "Banten", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur"],
  "Kalimantan": ["Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara"],
  "Bali & Nusa Tenggara": ["Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur"],
  "Sulawesi": ["Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Utara", "Sulawesi Barat"],
  "Maluku & Papua": ["Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Tengah", "Papua Selatan"],
};
for (const [island, provinces] of Object.entries(_islandGroups)) {
  for (const p of provinces) ISLAND_PROVINCES[p] = island;
}
export function cityIsland(city: City): string {
  return ISLAND_PROVINCES[city.province] ?? "Lainnya";
}

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
