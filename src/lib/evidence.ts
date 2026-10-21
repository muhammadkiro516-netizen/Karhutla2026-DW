import { EVIDENCE } from "@/config/thresholds";
import { haversineKm } from "@/lib/geo";
import type { EvidenceMeta, EvidenceResult, LatLon } from "@/types/domain";

/** Pure classifier. The browser wrapper reads EXIF with exifr and passes the result here. */
export function classifyEvidence(meta: EvidenceMeta, city: LatLon, now: Date, cfg = EVIDENCE): EvidenceResult {
  const reasons: string[] = [];
  const hasTime = meta.takenAt instanceof Date && !Number.isNaN(meta.takenAt.getTime());
  const hasGps = !!meta.gps && Number.isFinite(meta.gps.lat) && Number.isFinite(meta.gps.lon) && !(meta.gps.lat === 0 && meta.gps.lon === 0);

  if (!hasTime && !hasGps) {
    return { status: "BELUM_TERVERIFIKASI", reasons: ["Foto tidak memuat waktu maupun lokasi (EXIF). Ambil foto langsung dengan kamera dan aktifkan lokasi."] };
  }

  let failed = false;
  let ageHours: number | undefined;
  let distanceKm: number | undefined;

  if (hasTime) {
    ageHours = Math.round(((now.getTime() - meta.takenAt!.getTime()) / 36e5) * 10) / 10;
    if (ageHours < -cfg.futureSkewMinutes / 60) { failed = true; reasons.push("Waktu foto berada di masa depan; jam perangkat mungkin salah."); }
    else if (ageHours > cfg.maxAgeHours) { failed = true; reasons.push(`Foto berumur ${ageHours} jam (> ${cfg.maxAgeHours} jam).`); }
    else reasons.push(`Foto diambil ${Math.max(0, ageHours)} jam lalu.`);
  } else reasons.push("Waktu pengambilan tidak ada.");

  if (hasGps) {
    distanceKm = Math.round(haversineKm(meta.gps!, city));
    if (distanceKm > cfg.radiusKm) { failed = true; reasons.push(`Lokasi foto ${distanceKm} km dari kota yang dipilih (> ${cfg.radiusKm} km).`); }
    else reasons.push(`Lokasi foto ${distanceKm} km dari kota yang dipilih.`);
  } else reasons.push("Koordinat GPS tidak ada.");

  const status = failed ? "TIDAK_SESUAI" : hasTime && hasGps ? "TERVERIFIKASI" : "SEBAGIAN";
  return { status, reasons, ageHours, distanceKm };
}

export async function sha256Hex(data: ArrayBuffer | Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", data as BufferSource);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const EVIDENCE_DISCLAIMER =
  "Metadata foto dapat dipalsukan. Status ini adalah indikator awal; verifikasi akhir dilakukan petugas.";
