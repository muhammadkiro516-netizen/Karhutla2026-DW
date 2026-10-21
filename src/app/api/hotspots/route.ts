import { NextResponse } from "next/server";
import { CITIES, REGIONS } from "@/config/cities";
import { CACHE_SECONDS, HOTSPOT } from "@/config/thresholds";
import { cached } from "@/server/cache";
import { fetchHotspots } from "@/server/firms";
import { clusterHotspots, normalizeRow } from "@/lib/hotspots";
import { simulateDrift } from "@/lib/drift";
import { fetchWindAt } from "@/server/openmeteo";
import { inBbox } from "@/lib/geo";
import type { HotspotPayload, RichCluster } from "@/types/api";
import type { ApiEnvelope, Hotspot, WindHour } from "@/types/domain";
import sampleData from "@/data/sample-hotspots.json";

export const revalidate = CACHE_SECONDS.hotspots;

function nearestCity(lat: number, lon: number) {
  let best: (typeof CITIES)[number] = CITIES[0];
  let bestKm = Infinity;
  for (const c of CITIES) {
    const dLat = (c.lat - lat) * Math.PI / 180;
    const dLon = (c.lon - lon) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat * Math.PI) / 180) * Math.cos((c.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const km = 6371 * 2 * Math.asin(Math.sqrt(a));
    if (km < bestKm) { best = c; bestKm = km; }
  }
  return { city: best, km: bestKm };
}

export async function GET() {
  const fetchedAt = new Date().toISOString();
  const firmKey = process.env.FIRMS_MAP_KEY;
  let isDemo = false;
  let sourcesOk: string[] = [];

  try {
    let hotspots: Hotspot[];

    if (!firmKey) {
      isDemo = true;
      const today = new Date().toISOString().slice(0, 10);
      hotspots = (sampleData as Record<string, string>[])
        .map(r => normalizeRow({ ...r, acq_date: today }, r.satellite ?? "SAMPLE"))
        .filter((h): h is Hotspot => h !== null);
      sourcesOk = ["SAMPLE"];
    } else {
      const { value } = await cached("hotspots", CACHE_SECONDS.hotspots, () => fetchHotspots(firmKey));
      hotspots = value;
      sourcesOk = ["VIIRS_SNPP_NRT", "VIIRS_NOAA20_NRT", "VIIRS_NOAA21_NRT"];
    }

    const clusters = clusterHotspots(hotspots);
    const topClusters = clusters.slice(0, HOTSPOT.driftTopClusters);

    // Fetch wind for top clusters
    let windSeries: WindHour[][] = [];
    try {
      windSeries = await fetchWindAt(topClusters.map(c => ({ lat: c.lat, lon: c.lon })));
    } catch { /* wind fetch optional */ }

    const citiesForDrift = CITIES.map(c => ({ ...c }));

    const richClusters: RichCluster[] = topClusters.map((cluster, i) => {
      const { city, km } = nearestCity(cluster.lat, cluster.lon);
      const regionId =
        REGIONS.find(r => inBbox({ lat: cluster.lat, lon: cluster.lon }, r.bbox))?.id ?? null;
      const wind = windSeries[i] ?? [];
      const drift = wind.length > 0
        ? simulateDrift({ lat: cluster.lat, lon: cluster.lon }, wind, citiesForDrift)
        : [];
      return { ...cluster, nearestCityId: city.id, nearestKm: Math.round(km), regionId, drift, windNow: windSeries[i]?.[0] };
    });

    // Threat ranking per city
    const threatMap = new Map<string, { clusters: number; earliestEtaHours: number | null }>();
    for (const c of richClusters) {
      for (const d of c.drift) {
        const prev = threatMap.get(d.cityId);
        if (!prev) {
          threatMap.set(d.cityId, { clusters: 1, earliestEtaHours: d.etaHours });
        } else {
          prev.clusters++;
          if (prev.earliestEtaHours === null || d.etaHours < prev.earliestEtaHours) {
            prev.earliestEtaHours = d.etaHours;
          }
        }
      }
    }

    const threat = [...threatMap.entries()]
      .map(([cityId, v]) => ({ cityId, ...v }))
      .sort((a, b) => (a.earliestEtaHours ?? 999) - (b.earliestEtaHours ?? 999));

    const latestUtc = hotspots.map(h => h.acqUtc).sort().at(-1) ?? null;

    const payload: HotspotPayload = { clusters: richClusters, threat, latestUtc, sourcesOk };

    const envelope: ApiEnvelope<HotspotPayload> = {
      data: payload,
      source: isDemo ? "FIRMS (Contoh, bukan live)" : "FIRMS VIIRS NRT",
      fetchedAt,
      stale: false,
      demo: isDemo,
    };

    return NextResponse.json(envelope, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS.hotspots}, stale-while-revalidate=${CACHE_SECONDS.hotspots * 6}`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Gagal memuat data titik api." }, { status: 502 });
  }
}
