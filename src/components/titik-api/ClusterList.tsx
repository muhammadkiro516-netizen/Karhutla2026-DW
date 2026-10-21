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

  if (clusters.length === 0) {
    return <EmptyState message="Tidak ada titik api yang cocok dengan filter." icon="🌿" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {clusters.slice(0, shown).map(c => (
        <ClusterCard key={c.id} cluster={c} highlightCityId={highlightCityId} />
      ))}
      {shown < clusters.length && (
        <button
          onClick={() => setShown(s => s + PAGE_SIZE)}
          className="text-sm text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-600 rounded-lg py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          Muat lebih banyak ({clusters.length - shown} tersisa)
        </button>
      )}
    </div>
  );
}
