"use client";
import { useState } from "react";
import { useHotspots } from "@/hooks/useHotspots";
import { useCity } from "@/hooks/useCity";
import { filterClusters } from "@/lib/hotspot-filter";
import type { SortKey } from "@/lib/hotspot-filter";
import { HotspotSummary } from "@/components/titik-api/HotspotSummary";
import { ThreatRanking } from "@/components/titik-api/ThreatRanking";
import { RegionChips } from "@/components/titik-api/RegionChips";
import { HotspotFilters } from "@/components/titik-api/HotspotFilters";
import { ClusterList } from "@/components/titik-api/ClusterList";
import { HonestyNote } from "@/components/titik-api/HonestyNote";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { StaleBanner } from "@/components/ui/StaleBanner";

export default function TitikApiPage() {
  const { city } = useCity();
  const { data: payload, envelope, isLoading, error, retry } = useHotspots();
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

  if (isLoading && !payload) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
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
      <div className="lg:grid lg:grid-cols-[2fr_3fr] lg:gap-6">
        <div className="flex flex-col gap-4">
          <HotspotSummary payload={payload} envelope={envelope} />
          <ThreatRanking payload={payload} activeCityId={filterCity} onSelectCity={setFilterCity} />
          <RegionChips active={region} onChange={setRegion} />
          <HotspotFilters sort={sort} onSort={setSort} query={query} onQuery={setQuery} />
          <HonestyNote />
        </div>
        <div className="mt-4 lg:mt-0">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            {filtered.length} klaster ditampilkan
          </p>
          <ClusterList clusters={filtered} highlightCityId={filterCity ?? city.id} />
        </div>
      </div>
    </div>
  );
}
