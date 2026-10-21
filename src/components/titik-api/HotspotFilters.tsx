"use client";
import type { SortKey } from "@/lib/hotspot-filter";

interface HotspotFiltersProps {
  sort: SortKey;
  onSort: (s: SortKey) => void;
  query: string;
  onQuery: (q: string) => void;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "frp", label: "FRP" },
  { key: "eta", label: "ETA" },
  { key: "distance", label: "Jarak" },
  { key: "time", label: "Waktu" },
];

export function HotspotFilters({ sort, onSort, query, onQuery }: HotspotFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="search"
        value={query}
        onChange={e => onQuery(e.target.value)}
        placeholder="Cari kota/wilayah…"
        className="border rounded-lg px-3 py-1.5 text-sm dark:bg-zinc-800 dark:border-zinc-700 w-44"
        aria-label="Cari titik api"
      />
      <div className="flex gap-1">
        {SORT_OPTIONS.map(o => (
          <button
            key={o.key}
            onClick={() => onSort(o.key)}
            className={`text-xs px-2 py-1 rounded-lg transition-colors ${sort === o.key ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
