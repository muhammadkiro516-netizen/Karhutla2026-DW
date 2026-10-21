import type { RichCluster } from "@/types/api";
import type { Confidence } from "@/types/domain";

export type SortKey = "frp" | "eta" | "distance" | "time";

export interface FilterOptions {
  region?: string | null;
  confidence?: Confidence | null;
  query?: string;
  sort?: SortKey;
  fromCityId?: string | null;
}

/** Pure filter + sort for cluster list. Used only by components; never in API routes. */
export function filterClusters(clusters: RichCluster[], opts: FilterOptions = {}): RichCluster[] {
  let result = [...clusters];

  if (opts.region) {
    result = result.filter(c => c.regionId === opts.region);
  }

  if (opts.confidence) {
    const RANK: Record<Confidence, number> = { RENDAH: 0, SEDANG: 1, TINGGI: 2 };
    const minRank = RANK[opts.confidence];
    result = result.filter(c => RANK[c.confidence] >= minRank);
  }

  if (opts.query && opts.query.trim().length > 0) {
    const q = opts.query.trim().toLowerCase();
    result = result.filter(c =>
      c.nearestCityId.toLowerCase().includes(q) ||
      (c.regionId ?? "").toLowerCase().includes(q) ||
      c.satellites.some(s => s.toLowerCase().includes(q))
    );
  }

  const sort = opts.sort ?? "frp";
  if (sort === "frp") {
    result.sort((a, b) => b.maxFrp - a.maxFrp);
  } else if (sort === "eta") {
    result.sort((a, b) => {
      const aEta = a.drift.find(d => !opts.fromCityId || d.cityId === opts.fromCityId)?.etaHours ?? Infinity;
      const bEta = b.drift.find(d => !opts.fromCityId || d.cityId === opts.fromCityId)?.etaHours ?? Infinity;
      return aEta - bEta;
    });
  } else if (sort === "distance") {
    result.sort((a, b) => a.nearestKm - b.nearestKm);
  } else if (sort === "time") {
    result.sort((a, b) => b.latestUtc.localeCompare(a.latestUtc));
  }

  return result;
}
