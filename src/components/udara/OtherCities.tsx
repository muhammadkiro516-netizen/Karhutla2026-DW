"use client";
import { useState } from "react";
import { CITIES, cityIsland } from "@/config/cities";
import type { CityId } from "@/config/cities";
import { useCity } from "@/hooks/useCity";
import type { AirCity } from "@/types/api";
import { ChevronDown, ChevronUp } from "lucide-react";

const ISLAND_ORDER = [
  "Sumatera", "Jawa", "Kalimantan",
  "Bali & Nusa Tenggara", "Sulawesi", "Maluku & Papua",
];

// ISPU colour tokens matching the KLHK official scheme
function ispuColor(val: number | undefined | null): string {
  if (val == null) return "#94a3b8";
  if (val <= 50) return "#22c55e";
  if (val <= 100) return "#3b82f6";
  if (val <= 200) return "#f59e0b";
  if (val <= 300) return "#ef4444";
  return "#1e1e1e";
}
function ispuBg(val: number | undefined | null): string {
  if (val == null) return "bg-slate-50";
  if (val <= 50) return "bg-emerald-50";
  if (val <= 100) return "bg-blue-50";
  if (val <= 200) return "bg-amber-50";
  if (val <= 300) return "bg-red-50";
  return "bg-gray-100";
}

interface OtherCitiesProps { allAir: AirCity[] | undefined }

export function OtherCities({ allAir }: OtherCitiesProps) {
  const { city, setCity } = useCity();
  const [expandedIslands, setExpandedIslands] = useState<Set<string>>(new Set(["Kalimantan", "Sumatera"]));
  const [showAll, setShowAll] = useState(false);

  // Build enriched city list sorted by ISPU descending
  const enriched = CITIES
    .filter(c => c.id !== city.id)
    .map(c => ({
      ...c,
      air: allAir?.find(a => a.cityId === c.id),
      island: cityIsland(c),
    }))
    .sort((a, b) => (b.air?.ispuNow?.value ?? -1) - (a.air?.ispuNow?.value ?? -1));

  // Group by island in order
  const grouped = new Map<string, typeof enriched>();
  for (const k of ISLAND_ORDER) grouped.set(k, []);
  for (const c of enriched) {
    const g = grouped.get(c.island);
    if (g) g.push(c); else grouped.set(c.island, [c]);
  }

  // Summary stats
  const loaded = enriched.filter(c => c.air?.ispuNow?.value != null);
  const dangerous = loaded.filter(c => (c.air?.ispuNow?.value ?? 0) > 200).length;
  const unhealthy = loaded.filter(c => {
    const v = c.air?.ispuNow?.value ?? 0;
    return v > 100 && v <= 200;
  }).length;
  const avgIspu = loaded.length
    ? Math.round(loaded.reduce((s, c) => s + (c.air?.ispuNow?.value ?? 0), 0) / loaded.length)
    : null;

  const toggleIsland = (island: string) => {
    setExpandedIslands(prev => {
      const next = new Set(prev);
      next.has(island) ? next.delete(island) : next.add(island);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Kondisi Kota Lain
        </p>
        <span className="text-[10px] text-slate-400 font-medium">
          {loaded.length}/{CITIES.length - 1} kota
        </span>
      </div>

      {/* Summary strip */}
      {loaded.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-1">
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-2 py-2 text-center">
            <p className="text-base font-black text-slate-800 tabular-nums">{avgIspu ?? "—"}</p>
            <p className="text-[10px] text-slate-400">Rata-rata ISPU</p>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-100 px-2 py-2 text-center">
            <p className="text-base font-black text-amber-600 tabular-nums">{unhealthy}</p>
            <p className="text-[10px] text-amber-400">Tidak Sehat</p>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-100 px-2 py-2 text-center">
            <p className="text-base font-black text-red-600 tabular-nums">{dangerous}</p>
            <p className="text-[10px] text-red-400">Berbahaya</p>
          </div>
        </div>
      )}

      {/* Islands */}
      {[...grouped.entries()].map(([island, cities]) => {
        if (!cities.length) return null;
        const expanded = expandedIslands.has(island) || showAll;
        const worstInIsland = cities[0]?.air?.ispuNow?.value;
        const alertCount = cities.filter(c => (c.air?.ispuNow?.value ?? 0) > 100).length;

        return (
          <div key={island} className="rounded-2xl border border-slate-100 overflow-hidden">
            {/* Island header */}
            <button
              onClick={() => toggleIsland(island)}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">{island}</span>
                <span className="text-[10px] text-slate-400">{cities.length} kota</span>
                {alertCount > 0 && (
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-full">
                    {alertCount} waspada
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {worstInIsland != null && (
                  <span
                    className="text-xs font-black tabular-nums"
                    style={{ color: ispuColor(worstInIsland) }}
                  >
                    {worstInIsland}
                  </span>
                )}
                {expanded ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
              </div>
            </button>

            {/* City rows */}
            {expanded && (
              <div className="divide-y divide-slate-50">
                {cities.map(c => {
                  const ispu = c.air?.ispuNow;
                  const pm25 = c.air?.pm25;
                  const windKmh = allAir; // unused — just city row
                  void windKmh;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCity(c.id as CityId)}
                      className={`flex items-center justify-between px-3 py-2.5 text-left w-full transition-colors hover:bg-slate-50 ${ispuBg(ispu?.value)}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{c.province} · {c.tzLabel}</p>
                      </div>
                      {ispu ? (
                        <div className="text-right flex-shrink-0 ml-2">
                          <span
                            className="block text-base font-black tabular-nums"
                            style={{ color: ispuColor(ispu.value) }}
                          >
                            {ispu.value}
                          </span>
                          <div className="flex items-center gap-1 justify-end">
                            <span className="text-[10px] text-slate-400">{ispu.label}</span>
                            {pm25 != null && (
                              <span className="text-[10px] text-slate-300">· {pm25.toFixed(0)} µg</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 ml-2">—</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Expand all / collapse */}
      <button
        onClick={() => setShowAll(v => !v)}
        className="text-xs font-semibold text-blue-500 hover:text-blue-700 py-1.5 transition-colors flex items-center justify-center gap-1"
      >
        {showAll ? <><ChevronUp size={13} /> Sembunyikan</>  : <><ChevronDown size={13} /> Tampilkan semua pulau</>}
      </button>
    </div>
  );
}
