// Shared contract. UI, API handlers and lib functions all import from here.
export type IspuCategory = "BAIK" | "SEDANG" | "TIDAK_SEHAT" | "SANGAT_TIDAK_SEHAT" | "BERBAHAYA";

export interface IspuResult {
  value: number; // integer 0..500
  category: IspuCategory;
  label: string; // Indonesian label, e.g. "Sangat Tidak Sehat"
  color: string; // hex token, also used for hero gradient
  capped: boolean; // true when concentration exceeded the top breakpoint
}

export type SchoolLevel = 0 | 1 | 2 | 3; // Normal, Waspada, Hybrid, Daring Darurat

export interface SchoolStatus {
  level: SchoolLevel;
  code: "NORMAL" | "WASPADA" | "HYBRID" | "DARING_DARURAT";
  label: string;
  reason: string; // human explanation incl. hours & values, shown in "Kenapa?"
}

export interface LatLon { lat: number; lon: number }

export interface HourlyPoint { time: string; value: number | null } // ISO local time from API

export interface WindHour { windFromDeg: number; windKmh: number }

export type Confidence = "RENDAH" | "SEDANG" | "TINGGI";

export interface Hotspot extends LatLon {
  acqUtc: string; // ISO UTC
  confidence: Confidence;
  frp: number; // MW
  satellite: string;
}

export interface HotspotCluster extends LatLon {
  id: string;
  count: number;
  maxFrp: number;
  sumFrp: number;
  confidence: Confidence; // highest in cluster
  latestUtc: string;
  satellites: string[];
}

export interface DriftImpact {
  cityId: string;
  etaHours: number;
  distanceKm: number;
}

export type EvidenceStatus = "TERVERIFIKASI" | "SEBAGIAN" | "TIDAK_SESUAI" | "BELUM_TERVERIFIKASI";

export interface EvidenceMeta { takenAt?: Date; gps?: LatLon }

export interface EvidenceResult {
  status: EvidenceStatus;
  reasons: string[];
  ageHours?: number;
  distanceKm?: number;
}

// Every API route returns this envelope.
export interface ApiEnvelope<T> {
  data: T;
  source: string; // e.g. "Open-Meteo (CAMS)"
  fetchedAt: string; // ISO UTC
  stale: boolean; // true when served from fallback cache after upstream failure
  demo?: boolean; // true when data is seeded/sample
}
