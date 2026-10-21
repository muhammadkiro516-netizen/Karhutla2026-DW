"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useHotspots } from "@/hooks/useHotspots";
import { useAir } from "@/hooks/useAir";
import { useCity } from "@/hooks/useCity";
import { filterClusters } from "@/lib/hotspot-filter";
import type { SortKey } from "@/lib/hotspot-filter";
import { HotspotSummary } from "@/components/titik-api/HotspotSummary";
import { ThreatRanking } from "@/components/titik-api/ThreatRanking";
import { RegionChips } from "@/components/titik-api/RegionChips";
import { HotspotFilters } from "@/components/titik-api/HotspotFilters";
import { ClusterList } from "@/components/titik-api/ClusterList";
import { HonestyNote } from "@/components/titik-api/HonestyNote";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { StaleBanner } from "@/components/ui/StaleBanner";
import { Map as MapIcon } from "lucide-react";

// Dynamic import to avoid SSR with Leaflet
const HotspotMap = dynamic(
  () => import("@/components/titik-api/HotspotMap").then(m => m.HotspotMap),
  { ssr: false, loading: () => <Skeleton className="h-[320px] lg:h-[480px] w-full rounded-[--radius-card]" /> },
);

export default function TitikApiPage() {
  const { city } = useCity();
  const { data: payload, envelope, isLoading, error, retry } = useHotspots();
  const { data: allAir } = useAir();
  const [region, setRegion] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("frp");
  const [query, setQuery] = useState("");
  const [filterCity, setFilterCity] = useState<string | null>(null);

  const filtered = filterClusters(payload?.clusters ?? [], {
    region,
    sort,
    query,
    fromCityId: filterCity ?? city.id,
  });

  // Build ISPU color map for city markers on the map
  const ispuByCity: Record<string, string | undefined> = {};
  if (allAir) {
    for (const a of allAir) {
      ispuByCity[a.cityId] = a.ispuNow?.color;
    }
  }

  if (isLoading && !payload) {
    return (
      <div className="p-4 flex flex-col gap-4 max-w-5xl mx-auto">
        <Skeleton className="h-[320px] lg:h-[480px] w-full rounded-[--radius-card]" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error && !payload) {
    return (
      <div className="p-4">
        <ErrorCard message="Gagal memuat data titik api." onRetry={retry} />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {envelope?.stale && (
        <div className="mb-4">
          <StaleBanner
            updatedAt={new Date(envelope.fetchedAt).toLocaleTimeString("id-ID")}
            onRetry={retry}
          />
        </div>
      )}

      {/* Interactive Map */}
      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <MapIcon size={18} className="text-slate-400" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Peta Sebaran Titik Api
          </p>
        </div>
        <HotspotMap payload={payload} ispuByCity={ispuByCity} />
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ background: "#DC2626" }} /> Tinggi
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ background: "#F97316" }} /> Sedang
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ background: "#EAB308" }} /> Rendah
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ background: "#2563EB" }} /> Kota (ISPU)
          </span>
          <span className="ml-auto">© OpenStreetMap • NASA FIRMS</span>
        </div>
      </Card>

      <div className="lg:grid lg:grid-cols-[2fr_3fr] lg:gap-6">
        <div className="flex flex-col gap-4">
          <HotspotSummary payload={payload} envelope={envelope} />
          <ThreatRanking payload={payload} activeCityId={filterCity} onSelectCity={setFilterCity} />
          <RegionChips active={region} onChange={setRegion} />
          <HotspotFilters sort={sort} onSort={setSort} query={query} onQuery={setQuery} />
          <HonestyNote />
        </div>
        <div className="mt-4 lg:mt-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            {filtered.length} klaster ditampilkan
          </p>
          <ClusterList clusters={filtered} highlightCityId={filterCity ?? city.id} />
        </div>
      </div>
    </div>
  );
}
