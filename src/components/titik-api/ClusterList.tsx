"use client";
import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClusterCard } from "./ClusterCard";
import type { RichCluster } from "@/types/api";

const PAGE_SIZE = 10;

interface ClusterListProps {
  clusters: RichCluster[];
  highlightCityId?: string | null;
}

export function ClusterList({ clusters, highlightCityId }: ClusterListProps) {
  const [shown, setShown] = useState(PAGE_SIZE);

  if (!clusters.length) {
    return <EmptyState message="Tidak ada titik api yang cocok dengan filter." icon="🌿" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {clusters.slice(0, shown).map(c => (
        <ClusterCard key={c.id} cluster={c} highlightCityId={highlightCityId} />
      ))}
      {shown < clusters.length && (
        <button onClick={() => setShown(s => s + PAGE_SIZE)}
          className="text-sm text-slate-500 border border-slate-200 dark:border-slate-600 rounded-2xl py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium">
          Muat lebih banyak ({clusters.length - shown} tersisa)
        </button>
      )}
    </div>
  );
}
