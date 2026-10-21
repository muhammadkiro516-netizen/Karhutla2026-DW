// Demo seed data — regional hospitals and hospitals near karhutla-prone cities
// Seeded data shows DemoChip in UI per product rules.
import type { Facility } from "@/types/api";

export const SEED_HOSPITALS: Omit<Facility, "distanceKm">[] = [
  { id: "rsud-pekanbaru", type: "RS", name: "RSUD Arifin Achmad", address: "Jl. Diponegoro No.2, Pekanbaru", lat: 0.5022, lon: 101.4497, phone: "(0761) 20214", seeded: true },
  { id: "rsud-palangka", type: "RS", name: "RSUD dr. Doris Sylvanus", address: "Jl. Tambun Bungai, Palangka Raya", lat: -2.2046, lon: 113.9141, phone: "(0536) 3228864", seeded: true },
  { id: "rsud-jambi", type: "RS", name: "RSUD Raden Mattaher", address: "Jl. Let. Jend. Suprapto, Jambi", lat: -1.6046, lon: 103.6213, phone: "(0741) 61692", seeded: true },
  { id: "rsud-pontianak", type: "RS", name: "RSUD Soedarso", address: "Jl. Dr. Soedarso, Pontianak", lat: -0.0544, lon: 109.3441, phone: "(0561) 737701", seeded: true },
  { id: "rsud-banjarmasin", type: "RS", name: "RSUD Ulin Banjarmasin", address: "Jl. A. Yani No.43, Banjarmasin", lat: -3.2899, lon: 114.5871, phone: "(0511) 3252180", seeded: true },
  { id: "rsud-samarinda", type: "RS", name: "RSUD AW Sjahranie Samarinda", address: "Jl. Palang Merah Indonesia, Samarinda", lat: -0.4897, lon: 117.1486, phone: "(0541) 738118", seeded: true },
  { id: "rscm-jakarta", type: "RS", name: "RSUP Dr. Cipto Mangunkusumo", address: "Jl. Diponegoro No.71, Jakarta", lat: -6.1966, lon: 106.8458, phone: "(021) 3910040", seeded: true },
  { id: "rshs-bandung", type: "RS", name: "RSUP Dr. Hasan Sadikin", address: "Jl. Pasteur No.38, Bandung", lat: -6.8964, lon: 107.6054, phone: "(022) 2034953", seeded: true },
];

// Demo seed data — schools for Tab Sekolah
export interface School {
  slug: string;
  name: string;
  cityId: string;
  level: "PAUD" | "SD" | "SMP" | "SMA" | "SLB";
}

export const SCHOOLS: School[] = [
  { slug: "sd-negeri-contoh-1-pekanbaru", name: "SD Negeri Contoh 1 Pekanbaru (demo)", cityId: "pekanbaru", level: "SD" },
  { slug: "smp-negeri-contoh-2-pekanbaru", name: "SMP Negeri Contoh 2 Pekanbaru (demo)", cityId: "pekanbaru", level: "SMP" },
  { slug: "sma-negeri-contoh-3-pekanbaru", name: "SMA Negeri Contoh 3 Pekanbaru (demo)", cityId: "pekanbaru", level: "SMA" },
  { slug: "paud-contoh-pekanbaru", name: "PAUD Contoh Pekanbaru (demo)", cityId: "pekanbaru", level: "PAUD" },
  { slug: "slb-contoh-pekanbaru", name: "SLB Contoh Pekanbaru (demo)", cityId: "pekanbaru", level: "SLB" },
  { slug: "sd-negeri-contoh-1-palangka-raya", name: "SD Negeri Contoh 1 Palangka Raya (demo)", cityId: "palangka-raya", level: "SD" },
  { slug: "smp-negeri-contoh-2-palangka-raya", name: "SMP Negeri Contoh 2 Palangka Raya (demo)", cityId: "palangka-raya", level: "SMP" },
  { slug: "sd-negeri-contoh-1-jambi", name: "SD Negeri Contoh 1 Jambi (demo)", cityId: "jambi", level: "SD" },
  { slug: "smp-negeri-contoh-2-jambi", name: "SMP Negeri Contoh 2 Jambi (demo)", cityId: "jambi", level: "SMP" },
  { slug: "sd-negeri-contoh-1-pontianak", name: "SD Negeri Contoh 1 Pontianak (demo)", cityId: "pontianak", level: "SD" },
  { slug: "smp-negeri-contoh-2-pontianak", name: "SMP Negeri Contoh 2 Pontianak (demo)", cityId: "pontianak", level: "SMP" },
  { slug: "sd-negeri-contoh-1-banjarmasin", name: "SD Negeri Contoh 1 Banjarmasin (demo)", cityId: "banjarmasin", level: "SD" },
  { slug: "slb-contoh-banjarmasin", name: "SLB Contoh Banjarmasin (demo)", cityId: "banjarmasin", level: "SLB" },
  { slug: "sd-negeri-contoh-1-samarinda", name: "SD Negeri Contoh 1 Samarinda (demo)", cityId: "samarinda", level: "SD" },
  { slug: "sma-negeri-contoh-3-samarinda", name: "SMA Negeri Contoh 3 Samarinda (demo)", cityId: "samarinda", level: "SMA" },
];

// Stock types and helpers for Tab Posko
export type StockLevel = "BANYAK" | "MENIPIS" | "HABIS";

export interface StockItem {
  facilityId: string;
  item: string;
  level: StockLevel;
  updatedAt: string; // ISO UTC
}

// Deterministic demo stock: stable across reloads (based on facilityId hash mod)
export function demoStockLevel(facilityId: string, item: string): StockLevel {
  const hash = (facilityId + item).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const levels: StockLevel[] = ["BANYAK", "BANYAK", "MENIPIS", "HABIS"];
  return levels[hash % levels.length];
}

export const STOCK_ITEMS = ["Masker N95", "Masker Medis", "Nebulizer", "Oksigen", "Obat Asma"] as const;
