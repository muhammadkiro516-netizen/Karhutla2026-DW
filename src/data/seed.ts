// ─────────────────────────────────────────────────────────────
// Seed data — demo-only, shown with DemoChip per product rules.
// Names are real public institutions; coordinates are approximate.
// ─────────────────────────────────────────────────────────────
import type { Facility } from "@/types/api";

// ══════════════════════════════════════════════════════════════
// HOSPITALS & FACILITIES  (40 entries)
// ══════════════════════════════════════════════════════════════
export const SEED_HOSPITALS: Omit<Facility, "distanceKm">[] = [
  // ── PEKANBARU ──────────────────────────────────────────────
  { id: "rsud-arifin-pekanbaru",  type: "RS", name: "RSUD Arifin Achmad", address: "Jl. Diponegoro No.2, Pekanbaru", lat: 0.5022, lon: 101.4497, phone: "(0761) 20214", seeded: true },
  { id: "rsj-tampan-pekanbaru",   type: "RS", name: "RSJ Tampan", address: "Jl. Tampan, Pekanbaru", lat: 0.5188, lon: 101.4017, phone: "(0761) 64135", seeded: true },
  { id: "rs-santa-maria-pkb",     type: "RS", name: "RS Santa Maria", address: "Jl. Ahmad Yani No.68, Pekanbaru", lat: 0.5091, lon: 101.4441, phone: "(0761) 20272", seeded: true },
  { id: "rs-awal-bros-pkb",       type: "RS", name: "RS Awal Bros Pekanbaru", address: "Jl. Jend. Sudirman No.117, Pekanbaru", lat: 0.5011, lon: 101.4412, phone: "(0761) 47333", seeded: true },
  { id: "pusk-sail-pkb",          type: "PUSKESMAS_KLINIK", name: "Puskesmas Sail", address: "Jl. Sail, Pekanbaru", lat: 0.5071, lon: 101.4612, phone: "(0761) 22073", seeded: true },
  { id: "pusk-senapelan-pkb",     type: "PUSKESMAS_KLINIK", name: "Puskesmas Senapelan", address: "Jl. Senapelan, Pekanbaru", lat: 0.5192, lon: 101.4502, phone: "(0761) 21020", seeded: true },
  { id: "apotek-k24-pkb",         type: "APOTEK", name: "Apotek K-24 Pekanbaru", address: "Jl. Ahmad Yani, Pekanbaru", lat: 0.5082, lon: 101.4455, phone: "(0761) 859393", seeded: true },
  { id: "posko-bpbd-riau",        type: "POSKO", name: "Posko BPBD Provinsi Riau", address: "Jl. Jend. Sudirman, Pekanbaru", lat: 0.5030, lon: 101.4470, phone: "(0761) 27338", seeded: true },

  // ── PALANGKA RAYA ─────────────────────────────────────────
  { id: "rsud-doris-palangka",    type: "RS", name: "RSUD dr. Doris Sylvanus", address: "Jl. Tambun Bungai, Palangka Raya", lat: -2.2046, lon: 113.9141, phone: "(0536) 3228864", seeded: true },
  { id: "rs-betang-pambelum",     type: "RS", name: "RS Betang Pambelum", address: "Jl. Imam Bonjol, Palangka Raya", lat: -2.2110, lon: 113.9070, phone: "(0536) 3237411", seeded: true },
  { id: "rs-bhayangkara-palangka",type: "RS", name: "RS Bhayangkara Palangka Raya", address: "Jl. Tjilik Riwut, Palangka Raya", lat: -2.2180, lon: 113.9210, phone: "(0536) 3221002", seeded: true },
  { id: "pusk-pahandut",          type: "PUSKESMAS_KLINIK", name: "Puskesmas Pahandut", address: "Jl. Tjilik Riwut Km 1, Palangka Raya", lat: -2.2082, lon: 113.9152, phone: "(0536) 3221077", seeded: true },
  { id: "pusk-bukit-hindu",       type: "PUSKESMAS_KLINIK", name: "Puskesmas Bukit Hindu", address: "Jl. Bukit Hindu, Palangka Raya", lat: -2.2260, lon: 113.9020, phone: "(0536) 3226012", seeded: true },
  { id: "apotek-kimia-palangka",  type: "APOTEK", name: "Apotek Kimia Farma Palangka Raya", address: "Jl. Ahmad Yani, Palangka Raya", lat: -2.2145, lon: 113.9098, phone: "(0536) 3227890", seeded: true },
  { id: "posko-bpbd-kalteng",     type: "POSKO", name: "Posko BPBD Kalimantan Tengah", address: "Jl. S. Parman, Palangka Raya", lat: -2.2198, lon: 113.9155, phone: "(0536) 3222345", seeded: true },
  { id: "posko-manggala-agni-plt",type: "POSKO", name: "Posko Manggala Agni Kalteng", address: "Jl. Tjilik Riwut Km 5, Palangka Raya", lat: -2.1890, lon: 113.9300, phone: "(0536) 3240123", seeded: true },

  // ── JAMBI ────────────────────────────────────────────────
  { id: "rsud-mattaher-jambi",    type: "RS", name: "RSUD Raden Mattaher", address: "Jl. Let. Jend. Suprapto, Jambi", lat: -1.6046, lon: 103.6213, phone: "(0741) 61692", seeded: true },
  { id: "rs-st-theresia-jambi",   type: "RS", name: "RS St. Theresia Jambi", address: "Jl. Ahmad Yani No.6, Jambi", lat: -1.6010, lon: 103.6150, phone: "(0741) 61619", seeded: true },
  { id: "rs-bratanata-jambi",     type: "RS", name: "RS Bratanata Jambi", address: "Jl. Let. Jend. Suprapto No.39, Jambi", lat: -1.6085, lon: 103.6198, phone: "(0741) 61584", seeded: true },
  { id: "pusk-rawasari-jambi",    type: "PUSKESMAS_KLINIK", name: "Puskesmas Rawasari", address: "Jl. Rawasari, Jambi", lat: -1.5988, lon: 103.6122, phone: "(0741) 7553116", seeded: true },
  { id: "apotek-k24-jambi",       type: "APOTEK", name: "Apotek K-24 Jambi", address: "Jl. Jend. Sudirman, Jambi", lat: -1.6052, lon: 103.6170, phone: "(0741) 669977", seeded: true },
  { id: "posko-bpbd-jambi",       type: "POSKO", name: "Posko BPBD Provinsi Jambi", address: "Jl. Ahmad Yani, Jambi", lat: -1.6020, lon: 103.6090, phone: "(0741) 40350", seeded: true },

  // ── PONTIANAK ──────────────────────────────────────────────
  { id: "rsud-soedarso-ptk",      type: "RS", name: "RSUD Soedarso", address: "Jl. Dr. Soedarso, Pontianak", lat: -0.0544, lon: 109.3441, phone: "(0561) 737701", seeded: true },
  { id: "rs-santo-antonius-ptk",  type: "RS", name: "RS Santo Antonius", address: "Jl. KH Ahmad Dahlan No.2, Pontianak", lat: -0.0291, lon: 109.3362, phone: "(0561) 734000", seeded: true },
  { id: "rs-yarsi-pontianak",     type: "RS", name: "RS YARSI Pontianak", address: "Jl. Tanjungpura No.73, Pontianak", lat: -0.0222, lon: 109.3328, phone: "(0561) 734388", seeded: true },
  { id: "pusk-perumnas-ptk",      type: "PUSKESMAS_KLINIK", name: "Puskesmas Perumnas I", address: "Jl. Kom Yos Sudarso, Pontianak", lat: -0.0411, lon: 109.3150, phone: "(0561) 887032", seeded: true },
  { id: "posko-bpbd-kalbar",      type: "POSKO", name: "Posko BPBD Kalimantan Barat", address: "Jl. Sutan Syahrir, Pontianak", lat: -0.0280, lon: 109.3415, phone: "(0561) 731999", seeded: true },

  // ── BANJARMASIN ───────────────────────────────────────────
  { id: "rsud-ulin-banjar",       type: "RS", name: "RSUD Ulin Banjarmasin", address: "Jl. A. Yani No.43, Banjarmasin", lat: -3.2899, lon: 114.5871, phone: "(0511) 3252180", seeded: true },
  { id: "rs-suaka-insan-banjar",  type: "RS", name: "RS Suaka Insan", address: "Jl. Intan, Banjarmasin", lat: -3.3102, lon: 114.5814, phone: "(0511) 3255120", seeded: true },
  { id: "rs-sari-mulia-banjar",   type: "RS", name: "RS Sari Mulia Banjarmasin", address: "Jl. Pramuka No.67, Banjarmasin", lat: -3.2977, lon: 114.6012, phone: "(0511) 3260082", seeded: true },
  { id: "pusk-kayu-tangi-banjar", type: "PUSKESMAS_KLINIK", name: "Puskesmas Kayu Tangi", address: "Jl. Kayu Tangi, Banjarmasin", lat: -3.2811, lon: 114.5921, phone: "(0511) 3303412", seeded: true },
  { id: "posko-bpbd-kalsel",      type: "POSKO", name: "Posko BPBD Kalimantan Selatan", address: "Jl. A. Yani Km 3, Banjarmasin", lat: -3.2966, lon: 114.5950, phone: "(0511) 3270011", seeded: true },

  // ── SAMARINDA ─────────────────────────────────────────────
  { id: "rsud-aw-samarinda",      type: "RS", name: "RSUD AW Sjahranie", address: "Jl. Palang Merah Indonesia, Samarinda", lat: -0.4897, lon: 117.1486, phone: "(0541) 738118", seeded: true },
  { id: "rs-dirgahayu-samarinda", type: "RS", name: "RS Dirgahayu", address: "Jl. KH Abul Hasan, Samarinda", lat: -0.5012, lon: 117.1545, phone: "(0541) 733995", seeded: true },
  { id: "rs-pertamina-samarinda", type: "RS", name: "RS Pertamina Balikpapan", address: "Jl. MT Haryono, Samarinda", lat: -0.4788, lon: 117.1411, phone: "(0541) 888765", seeded: true },
  { id: "pusk-samarinda-kota",    type: "PUSKESMAS_KLINIK", name: "Puskesmas Samarinda Kota", address: "Jl. Awang Long, Samarinda", lat: -0.5022, lon: 117.1530, phone: "(0541) 742277", seeded: true },
  { id: "posko-bpbd-kaltim",      type: "POSKO", name: "Posko BPBD Kalimantan Timur", address: "Jl. MT Haryono, Samarinda", lat: -0.5055, lon: 117.1477, phone: "(0541) 736688", seeded: true },

  // ── JAKARTA ───────────────────────────────────────────────
  { id: "rscm-jakarta",           type: "RS", name: "RSUP Dr. Cipto Mangunkusumo", address: "Jl. Diponegoro No.71, Jakarta", lat: -6.1966, lon: 106.8458, phone: "(021) 3910040", seeded: true },
  { id: "rs-persahabatan-jkt",    type: "RS", name: "RSUP Persahabatan Jakarta", address: "Jl. Persahabatan Raya No.1, Jakarta", lat: -6.2194, lon: 106.8957, phone: "(021) 4891708", seeded: true },
  { id: "posko-bnpb-jakarta",     type: "POSKO", name: "Posko BNPB Nasional", address: "Jl. Pramuka Kav.38, Jakarta", lat: -6.2003, lon: 106.8555, phone: "(021) 21281200", seeded: true },

  // ── BANDUNG ───────────────────────────────────────────────
  { id: "rshs-bandung",           type: "RS", name: "RSUP Dr. Hasan Sadikin", address: "Jl. Pasteur No.38, Bandung", lat: -6.8964, lon: 107.6054, phone: "(022) 2034953", seeded: true },
  { id: "rs-borromeus-bandung",   type: "RS", name: "RS Borromeus", address: "Jl. Ir. H. Juanda No.100, Bandung", lat: -6.9022, lon: 107.6170, phone: "(022) 2552221", seeded: true },
];

// ══════════════════════════════════════════════════════════════
// SCHOOLS  (128 entries across 8 cities)
// ══════════════════════════════════════════════════════════════
export interface School {
  slug: string;
  name: string;
  cityId: string;
  level: "PAUD" | "SD" | "SMP" | "SMA" | "SLB";
}

export const SCHOOLS: School[] = [
  // ── PEKANBARU (20) ───────────────────────────────────────
  { slug: "paud-kasih-bunda-pkb",      name: "PAUD Kasih Bunda Pekanbaru",       cityId: "pekanbaru", level: "PAUD" },
  { slug: "paud-teratai-pkb",          name: "PAUD Teratai",                      cityId: "pekanbaru", level: "PAUD" },
  { slug: "slb-negeri-pkb",            name: "SLB Negeri Pekanbaru",              cityId: "pekanbaru", level: "SLB"  },
  { slug: "sdn-001-pkb",               name: "SD Negeri 001 Pekanbaru",           cityId: "pekanbaru", level: "SD"   },
  { slug: "sdn-002-pkb",               name: "SD Negeri 002 Sukajadi",            cityId: "pekanbaru", level: "SD"   },
  { slug: "sdn-003-pkb",               name: "SD Negeri 003 Limapuluh",           cityId: "pekanbaru", level: "SD"   },
  { slug: "sdn-004-pkb",               name: "SD Negeri 004 Bukit Raya",          cityId: "pekanbaru", level: "SD"   },
  { slug: "sdn-005-pkb",               name: "SD Negeri 005 Tampan",              cityId: "pekanbaru", level: "SD"   },
  { slug: "sd-muhammadiyah-pkb",       name: "SD Muhammadiyah 1 Pekanbaru",       cityId: "pekanbaru", level: "SD"   },
  { slug: "sd-al-ulum-pkb",            name: "SD Islam Al-Ulum Terpadu Pekanbaru",cityId: "pekanbaru", level: "SD"   },
  { slug: "smpn-1-pkb",                name: "SMP Negeri 1 Pekanbaru",            cityId: "pekanbaru", level: "SMP"  },
  { slug: "smpn-2-pkb",                name: "SMP Negeri 2 Pekanbaru",            cityId: "pekanbaru", level: "SMP"  },
  { slug: "smpn-4-pkb",                name: "SMP Negeri 4 Pekanbaru",            cityId: "pekanbaru", level: "SMP"  },
  { slug: "smpn-8-pkb",                name: "SMP Negeri 8 Pekanbaru",            cityId: "pekanbaru", level: "SMP"  },
  { slug: "smp-muhammadiyah-pkb",      name: "SMP Muhammadiyah Pekanbaru",        cityId: "pekanbaru", level: "SMP"  },
  { slug: "sman-1-pkb",                name: "SMA Negeri 1 Pekanbaru",            cityId: "pekanbaru", level: "SMA"  },
  { slug: "sman-2-pkb",                name: "SMA Negeri 2 Pekanbaru",            cityId: "pekanbaru", level: "SMA"  },
  { slug: "sman-4-pkb",                name: "SMA Negeri 4 Pekanbaru",            cityId: "pekanbaru", level: "SMA"  },
  { slug: "sman-8-pkb",                name: "SMA Negeri 8 Pekanbaru",            cityId: "pekanbaru", level: "SMA"  },
  { slug: "smk-n-1-pkb",               name: "SMK Negeri 1 Pekanbaru",            cityId: "pekanbaru", level: "SMA"  },

  // ── PALANGKA RAYA (18) ──────────────────────────────────
  { slug: "paud-tunas-bangsa-plt",     name: "PAUD Tunas Bangsa Palangka Raya",   cityId: "palangka-raya", level: "PAUD" },
  { slug: "paud-ceria-plt",            name: "PAUD Ceria",                         cityId: "palangka-raya", level: "PAUD" },
  { slug: "slb-negeri-plt",            name: "SLB Negeri Palangka Raya",           cityId: "palangka-raya", level: "SLB"  },
  { slug: "sdn-1-palangka-raya",       name: "SD Negeri 1 Palangka Raya",          cityId: "palangka-raya", level: "SD"   },
  { slug: "sdn-2-palangka-raya",       name: "SD Negeri 2 Palangka Raya",          cityId: "palangka-raya", level: "SD"   },
  { slug: "sdn-3-pahandut-plt",        name: "SD Negeri 3 Pahandut",               cityId: "palangka-raya", level: "SD"   },
  { slug: "sdn-4-langkai-plt",         name: "SD Negeri 4 Langkai",                cityId: "palangka-raya", level: "SD"   },
  { slug: "sd-lamas-plt",              name: "SD Santa Lucia Palangka Raya",       cityId: "palangka-raya", level: "SD"   },
  { slug: "sdn-6-panarung-plt",        name: "SD Negeri 6 Panarung",               cityId: "palangka-raya", level: "SD"   },
  { slug: "smpn-1-palangka-raya",      name: "SMP Negeri 1 Palangka Raya",         cityId: "palangka-raya", level: "SMP"  },
  { slug: "smpn-2-palangka-raya",      name: "SMP Negeri 2 Palangka Raya",         cityId: "palangka-raya", level: "SMP"  },
  { slug: "smpn-3-palangka-raya",      name: "SMP Negeri 3 Palangka Raya",         cityId: "palangka-raya", level: "SMP"  },
  { slug: "smpn-6-palangka-raya",      name: "SMP Negeri 6 Palangka Raya",         cityId: "palangka-raya", level: "SMP"  },
  { slug: "sman-1-palangka-raya",      name: "SMA Negeri 1 Palangka Raya",         cityId: "palangka-raya", level: "SMA"  },
  { slug: "sman-2-palangka-raya",      name: "SMA Negeri 2 Palangka Raya",         cityId: "palangka-raya", level: "SMA"  },
  { slug: "sman-3-palangka-raya",      name: "SMA Negeri 3 Palangka Raya",         cityId: "palangka-raya", level: "SMA"  },
  { slug: "sman-4-palangka-raya",      name: "SMA Negeri 4 Palangka Raya",         cityId: "palangka-raya", level: "SMA"  },
  { slug: "smk-n-1-palangka-raya",     name: "SMK Negeri 1 Palangka Raya",         cityId: "palangka-raya", level: "SMA"  },

  // ── JAMBI (18) ─────────────────────────────────────────
  { slug: "paud-bintang-cilik-jambi",  name: "PAUD Bintang Cilik Jambi",          cityId: "jambi", level: "PAUD" },
  { slug: "paud-mekar-sari-jambi",     name: "PAUD Mekar Sari Jambi",             cityId: "jambi", level: "PAUD" },
  { slug: "slb-b-prof-dr-sri-jambi",   name: "SLB B Prof Dr Sri Soedewi Jambi",   cityId: "jambi", level: "SLB"  },
  { slug: "sdn-01-jambi",              name: "SD Negeri 01/I Jambi",              cityId: "jambi", level: "SD"   },
  { slug: "sdn-02-jambi",              name: "SD Negeri 02/I Jambi",              cityId: "jambi", level: "SD"   },
  { slug: "sdn-47-jambi",              name: "SD Negeri 47/IV Jambi",             cityId: "jambi", level: "SD"   },
  { slug: "sdn-52-jambi",              name: "SD Negeri 52/IV Jambi",             cityId: "jambi", level: "SD"   },
  { slug: "sd-xaverius-jambi",         name: "SD Xaverius 1 Jambi",               cityId: "jambi", level: "SD"   },
  { slug: "sd-adhyaksa-jambi",         name: "SD Adhyaksa 1 Jambi",               cityId: "jambi", level: "SD"   },
  { slug: "smpn-1-jambi",              name: "SMP Negeri 1 Jambi",                cityId: "jambi", level: "SMP"  },
  { slug: "smpn-5-jambi",              name: "SMP Negeri 5 Jambi",                cityId: "jambi", level: "SMP"  },
  { slug: "smpn-8-jambi",              name: "SMP Negeri 8 Jambi",                cityId: "jambi", level: "SMP"  },
  { slug: "smpn-11-jambi",             name: "SMP Negeri 11 Jambi",               cityId: "jambi", level: "SMP"  },
  { slug: "sman-1-jambi",              name: "SMA Negeri 1 Jambi",                cityId: "jambi", level: "SMA"  },
  { slug: "sman-3-jambi",              name: "SMA Negeri 3 Jambi",                cityId: "jambi", level: "SMA"  },
  { slug: "sman-5-jambi",              name: "SMA Negeri 5 Jambi",                cityId: "jambi", level: "SMA"  },
  { slug: "smk-n-1-jambi",             name: "SMK Negeri 1 Jambi",                cityId: "jambi", level: "SMA"  },
  { slug: "smk-n-3-jambi",             name: "SMK Negeri 3 Jambi",                cityId: "jambi", level: "SMA"  },

  // ── PONTIANAK (17) ─────────────────────────────────────
  { slug: "paud-kasih-ibu-ptk",        name: "PAUD Kasih Ibu Pontianak",          cityId: "pontianak", level: "PAUD" },
  { slug: "paud-pelita-hati-ptk",      name: "PAUD Pelita Hati Pontianak",        cityId: "pontianak", level: "PAUD" },
  { slug: "slb-a-dharma-asih-ptk",     name: "SLB A Dharma Asih Pontianak",       cityId: "pontianak", level: "SLB"  },
  { slug: "sdn-01-pontianak-kota",     name: "SD Negeri 01 Pontianak Kota",       cityId: "pontianak", level: "SD"   },
  { slug: "sdn-02-pontianak-kota",     name: "SD Negeri 02 Pontianak Kota",       cityId: "pontianak", level: "SD"   },
  { slug: "sdn-07-pontianak-tenggara", name: "SD Negeri 07 Pontianak Tenggara",   cityId: "pontianak", level: "SD"   },
  { slug: "sdn-09-pontianak-selatan",  name: "SD Negeri 09 Pontianak Selatan",    cityId: "pontianak", level: "SD"   },
  { slug: "sd-karya-yosef-ptk",        name: "SD Karya Yosef Pontianak",          cityId: "pontianak", level: "SD"   },
  { slug: "smpn-1-pontianak",          name: "SMP Negeri 1 Pontianak",            cityId: "pontianak", level: "SMP"  },
  { slug: "smpn-2-pontianak",          name: "SMP Negeri 2 Pontianak",            cityId: "pontianak", level: "SMP"  },
  { slug: "smpn-7-pontianak",          name: "SMP Negeri 7 Pontianak",            cityId: "pontianak", level: "SMP"  },
  { slug: "smpn-10-pontianak",         name: "SMP Negeri 10 Pontianak",           cityId: "pontianak", level: "SMP"  },
  { slug: "sman-1-pontianak",          name: "SMA Negeri 1 Pontianak",            cityId: "pontianak", level: "SMA"  },
  { slug: "sman-2-pontianak",          name: "SMA Negeri 2 Pontianak",            cityId: "pontianak", level: "SMA"  },
  { slug: "sman-3-pontianak",          name: "SMA Negeri 3 Pontianak",            cityId: "pontianak", level: "SMA"  },
  { slug: "sman-7-pontianak",          name: "SMA Negeri 7 Pontianak",            cityId: "pontianak", level: "SMA"  },
  { slug: "smk-n-1-pontianak",         name: "SMK Negeri 1 Pontianak",            cityId: "pontianak", level: "SMA"  },

  // ── BANJARMASIN (17) ────────────────────────────────────
  { slug: "paud-mekar-banjar",         name: "PAUD Mekar Banjarmasin",            cityId: "banjarmasin", level: "PAUD" },
  { slug: "paud-tunas-muda-banjar",    name: "PAUD Tunas Muda Banjarmasin",       cityId: "banjarmasin", level: "PAUD" },
  { slug: "slb-negeri-banjarmasin",    name: "SLB Negeri Banjarmasin",            cityId: "banjarmasin", level: "SLB"  },
  { slug: "sdn-basirih-banjar",        name: "SD Negeri Basirih Hulu Banjarmasin",cityId: "banjarmasin", level: "SD"   },
  { slug: "sdn-sungai-miai-banjar",    name: "SD Negeri Sungai Miai Banjarmasin", cityId: "banjarmasin", level: "SD"   },
  { slug: "sdn-mawar-banjar",          name: "SD Negeri Mawar 5 Banjarmasin",     cityId: "banjarmasin", level: "SD"   },
  { slug: "sdn-kebun-bunga-banjar",    name: "SD Negeri Kebun Bunga Banjarmasin", cityId: "banjarmasin", level: "SD"   },
  { slug: "sd-muhammadiyah-4-banjar",  name: "SD Muhammadiyah 4 Banjarmasin",     cityId: "banjarmasin", level: "SD"   },
  { slug: "smpn-1-banjarmasin",        name: "SMP Negeri 1 Banjarmasin",          cityId: "banjarmasin", level: "SMP"  },
  { slug: "smpn-3-banjarmasin",        name: "SMP Negeri 3 Banjarmasin",          cityId: "banjarmasin", level: "SMP"  },
  { slug: "smpn-6-banjarmasin",        name: "SMP Negeri 6 Banjarmasin",          cityId: "banjarmasin", level: "SMP"  },
  { slug: "smpn-10-banjarmasin",       name: "SMP Negeri 10 Banjarmasin",         cityId: "banjarmasin", level: "SMP"  },
  { slug: "sman-1-banjarmasin",        name: "SMA Negeri 1 Banjarmasin",          cityId: "banjarmasin", level: "SMA"  },
  { slug: "sman-2-banjarmasin",        name: "SMA Negeri 2 Banjarmasin",          cityId: "banjarmasin", level: "SMA"  },
  { slug: "sman-5-banjarmasin",        name: "SMA Negeri 5 Banjarmasin",          cityId: "banjarmasin", level: "SMA"  },
  { slug: "sman-7-banjarmasin",        name: "SMA Negeri 7 Banjarmasin",          cityId: "banjarmasin", level: "SMA"  },
  { slug: "smk-n-1-banjarmasin",       name: "SMK Negeri 1 Banjarmasin",          cityId: "banjarmasin", level: "SMA"  },

  // ── SAMARINDA (18) ──────────────────────────────────────
  { slug: "paud-bintang-kecil-smr",   name: "PAUD Bintang Kecil Samarinda",      cityId: "samarinda", level: "PAUD" },
  { slug: "paud-permai-smr",          name: "PAUD Permai Samarinda",             cityId: "samarinda", level: "PAUD" },
  { slug: "slb-bc-bina-kasih-smr",    name: "SLB BC Bina Kasih Samarinda",       cityId: "samarinda", level: "SLB"  },
  { slug: "sdn-001-samarinda-kota",   name: "SD Negeri 001 Samarinda Kota",      cityId: "samarinda", level: "SD"   },
  { slug: "sdn-002-samarinda-ilir",   name: "SD Negeri 002 Samarinda Ilir",      cityId: "samarinda", level: "SD"   },
  { slug: "sdn-004-sempaja",          name: "SD Negeri 004 Sempaja",             cityId: "samarinda", level: "SD"   },
  { slug: "sdn-007-lempake",          name: "SD Negeri 007 Lempake",             cityId: "samarinda", level: "SD"   },
  { slug: "sd-muhammadiyah-1-smr",    name: "SD Muhammadiyah 1 Samarinda",       cityId: "samarinda", level: "SD"   },
  { slug: "sd-pgri-smr",              name: "SD PGRI 2 Samarinda",               cityId: "samarinda", level: "SD"   },
  { slug: "smpn-1-samarinda",         name: "SMP Negeri 1 Samarinda",            cityId: "samarinda", level: "SMP"  },
  { slug: "smpn-3-samarinda",         name: "SMP Negeri 3 Samarinda",            cityId: "samarinda", level: "SMP"  },
  { slug: "smpn-6-samarinda",         name: "SMP Negeri 6 Samarinda",            cityId: "samarinda", level: "SMP"  },
  { slug: "smpn-9-samarinda",         name: "SMP Negeri 9 Samarinda",            cityId: "samarinda", level: "SMP"  },
  { slug: "sman-1-samarinda",         name: "SMA Negeri 1 Samarinda",            cityId: "samarinda", level: "SMA"  },
  { slug: "sman-2-samarinda",         name: "SMA Negeri 2 Samarinda",            cityId: "samarinda", level: "SMA"  },
  { slug: "sman-3-samarinda",         name: "SMA Negeri 3 Samarinda",            cityId: "samarinda", level: "SMA"  },
  { slug: "sman-10-samarinda",        name: "SMA Negeri 10 Samarinda",           cityId: "samarinda", level: "SMA"  },
  { slug: "smk-n-7-samarinda",        name: "SMK Negeri 7 Samarinda",            cityId: "samarinda", level: "SMA"  },

  // ── JAKARTA (10) ────────────────────────────────────────
  { slug: "paud-al-hidayah-jkt",      name: "PAUD Al-Hidayah Jakarta",           cityId: "jakarta", level: "PAUD" },
  { slug: "slb-negeri-7-jakarta",     name: "SLB Negeri 7 Jakarta",              cityId: "jakarta", level: "SLB"  },
  { slug: "sdn-kenari-01-jkt",        name: "SD Negeri Kenari 01 Jakarta",       cityId: "jakarta", level: "SD"   },
  { slug: "sdn-cikini-01-jkt",        name: "SD Negeri Cikini 01 Jakarta",       cityId: "jakarta", level: "SD"   },
  { slug: "smpn-1-jakarta",           name: "SMP Negeri 1 Jakarta",              cityId: "jakarta", level: "SMP"  },
  { slug: "smpn-11-jakarta",          name: "SMP Negeri 11 Jakarta",             cityId: "jakarta", level: "SMP"  },
  { slug: "sman-1-jakarta",           name: "SMA Negeri 1 Jakarta",              cityId: "jakarta", level: "SMA"  },
  { slug: "sman-8-jakarta",           name: "SMA Negeri 8 Jakarta",              cityId: "jakarta", level: "SMA"  },
  { slug: "sman-68-jakarta",          name: "SMA Negeri 68 Jakarta",             cityId: "jakarta", level: "SMA"  },
  { slug: "smk-n-1-jakarta",          name: "SMK Negeri 1 Jakarta",              cityId: "jakarta", level: "SMA"  },

  // ── BANDUNG (10) ────────────────────────────────────────
  { slug: "paud-melati-bandung",      name: "PAUD Melati Bandung",               cityId: "bandung", level: "PAUD" },
  { slug: "slb-negeri-cicendo-bdg",   name: "SLB Negeri Cicendo Bandung",        cityId: "bandung", level: "SLB"  },
  { slug: "sdn-coblong-bandung",      name: "SD Negeri Coblong Bandung",         cityId: "bandung", level: "SD"   },
  { slug: "sdn-sekeloa-bandung",      name: "SD Negeri Sekeloa Bandung",         cityId: "bandung", level: "SD"   },
  { slug: "smpn-1-bandung",           name: "SMP Negeri 1 Bandung",              cityId: "bandung", level: "SMP"  },
  { slug: "smpn-5-bandung",           name: "SMP Negeri 5 Bandung",              cityId: "bandung", level: "SMP"  },
  { slug: "sman-1-bandung",           name: "SMA Negeri 1 Bandung",              cityId: "bandung", level: "SMA"  },
  { slug: "sman-3-bandung",           name: "SMA Negeri 3 Bandung",              cityId: "bandung", level: "SMA"  },
  { slug: "sman-5-bandung",           name: "SMA Negeri 5 Bandung",              cityId: "bandung", level: "SMA"  },
  { slug: "smk-n-1-bandung",          name: "SMK Negeri 1 Bandung",              cityId: "bandung", level: "SMA"  },
];

// ══════════════════════════════════════════════════════════════
// STOCK helpers
// ══════════════════════════════════════════════════════════════
export type StockLevel = "BANYAK" | "MENIPIS" | "HABIS";

export interface StockItem {
  facilityId: string;
  item: string;
  level: StockLevel;
  updatedAt: string;
}

/** Deterministic demo stock — stable across reloads */
export function demoStockLevel(facilityId: string, item: string): StockLevel {
  const hash = (facilityId + item).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const levels: StockLevel[] = ["BANYAK", "BANYAK", "MENIPIS", "HABIS"];
  return levels[hash % levels.length];
}

export const STOCK_ITEMS = [
  "Masker N95",
  "Masker Medis",
  "Nebulizer",
  "Oksigen",
  "Obat Asma",
] as const;
