import "server-only";
import Papa from "papaparse";
import { FIRMS_SOURCES, INDONESIA_BBOX } from "@/config/cities";
import { normalizeRow } from "@/lib/hotspots";
import type { FirmsRow } from "@/lib/hotspots";
import type { Hotspot } from "@/types/domain";

export async function fetchHotspots(key: string): Promise<Hotspot[]> {
  const results = await Promise.allSettled(
    FIRMS_SOURCES.map(async (source) => {
      const [w, s, e, n] = INDONESIA_BBOX;
      const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/${source}/${w},${s},${e},${n}/2`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`FIRMS ${source} HTTP ${res.status}`);
      const text = await res.text();
      const parsed = Papa.parse<FirmsRow>(text, { header: true, skipEmptyLines: true });
      return parsed.data
        .map(row => normalizeRow(row, source))
        .filter((h): h is Hotspot => h !== null);
    })
  );

  const all: Hotspot[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value);
  }
  return all;
}
