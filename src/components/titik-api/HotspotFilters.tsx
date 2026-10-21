"use client";
import type { SortKey } from "@/lib/hotspot-filter";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "frp", label: "FRP" },
  { key: "eta", label: "ETA" },
  { key: "distance", label: "Jarak" },
  { key: "time", label: "Waktu" },
];

interface HotspotFiltersProps {
  sort: SortKey; onSort: (s: SortKey) => void;
  query: string; onQuery: (q: string) => void;
}

export function HotspotFilters({ sort, onSort, query, onQuery }: HotspotFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input type="search" value={query} onChange={e => onQuery(e.target.value)}
        placeholder="Cari kota/wilayah…"
        className="border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-1.5 text-sm bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-44"
        aria-label="Cari titik api" />
      <div className="flex gap-1">
        {SORT_OPTIONS.map(o => (
          <button key={o.key} onClick={() => onSort(o.key)}
            className={`text-xs px-3 py-1.5 rounded-xl transition-all font-medium ${
              sort === o.key
                ? "bg-blue-500 text-white shadow-sm shadow-blue-400/30"
                : "bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-blue-300"
            }`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
