// Client-only: reads EXIF from a File, classifies evidence, returns hash.
// Called from browser only (exifr uses DOM APIs).
import { classifyEvidence, sha256Hex } from "@/lib/evidence";
import type { EvidenceMeta, EvidenceResult, LatLon } from "@/types/domain";

export interface AnalysisResult {
  meta: EvidenceMeta;
  result: EvidenceResult;
  hash: string;
}

export async function analyzeFile(file: File, cityCenter: LatLon): Promise<AnalysisResult> {
  if (file.size > 15 * 1024 * 1024) {
    return {
      meta: {},
      result: { status: "TIDAK_SESUAI", reasons: ["File terlalu besar (maks 15 MB)."] },
      hash: "",
    };
  }

  let meta: EvidenceMeta = {};
  try {
    const exifr = await import("exifr");
    const parsed = await exifr.default.parse(file, { pick: ["DateTimeOriginal", "latitude", "longitude"] }) as Record<string, unknown> | null;
    if (parsed) {
      meta = {
        takenAt: parsed.DateTimeOriginal instanceof Date ? parsed.DateTimeOriginal : undefined,
        gps: parsed.latitude != null && parsed.longitude != null
          ? { lat: parsed.latitude as number, lon: parsed.longitude as number }
          : undefined,
      };
    }
  } catch { /* EXIF parse failure — meta stays empty */ }

  const buf = await file.arrayBuffer();
  const hash = await sha256Hex(new Uint8Array(buf));
  const result = classifyEvidence(meta, cityCenter, new Date());

  return { meta, result, hash };
}

export function buildReportId(hash: string, date: Date): string {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const shortHash = hash.slice(0, 4).toUpperCase();
  return `LPR-${dateStr}-${shortHash}`;
}
