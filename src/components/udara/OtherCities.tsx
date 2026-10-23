"use client";
import { useState } from "react";
import { CITIES } from "@/config/cities";
import type { CityId } from "@/config/cities";
import { useCity } from "@/hooks/useCity";
import type { AirCity } from "@/types/api";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * OtherCities — compact design.
 * Default: top 8 worst cities as simple rows.
 * Expand: all cities grouped by island in collapsible sections.
 */

function ispuColor(val: number | undefined | null): string {
  if (val == null) return "#94a3b8";
  if (val <= 50)  return "#22c55e";
  if (val <= 100) return "#3b82f6";
  if (val <= 200) return "#f59e0b";
  if (val <= 300) return "#ef4444";
  return "#1e1e1e";
}
function ispuLabel(val: number | null | undefined): string {
  if (val == null) return "—";
  if (val <= 50)  return "Baik";
  if (val <= 100) return "Sedang";
  if (val <= 200) return "Tdk Sehat";
  if (val <= 300) return "Sgt Tdk Sehat";
  return "Berbahaya";
}
function ispuDot(val: number | null | undefined): string {
  if (val == null) return "bg-slate-200";
  if (val <= 50)  return "bg-emerald-400";
  if (val <= 100) return "bg-blue-400";
  if (val <= 200) return "bg-amber-400";
  if (val <= 300) return "bg-red-500";
  return "bg-gray-900";
}

interface OtherCitiesProps { allAir: AirCity[] | undefined }

export function OtherCities({ allAir }: OtherCitiesProps) {
  const { city, setCity } = useCity();
  const [expanded, setExpanded] = useState(false);

  const enriched = CITIES
    .filter(c => c.id !== city.id)
    .map(c => ({ ...c, air: allAir?.find(a => a.cityId === c.id) }))
    .sort((a, b) => (b.air?.ispuNow?.value ?? -1) - (a.air?.ispuNow?.value ?? -1));

  const loaded = enriched.filter(c => c.air?.ispuNow?.value != null);
  const dangerous = loaded.filter(c => (c.air?.ispuNow?.value ?? 0) > 200).length;
  const unhealthy = loaded.filter(c => { const v = c.air?.ispuNow?.value ?? 0; return v > 100 && v <= 200; }).length;
  const avgIspu = loaded.length
    ? Math.round(loaded.reduce((s, c) => s + (c.air?.ispuNow?.value ?? 0), 0) / loaded.length)
    : null;

  const displayCities = expanded ? enriched : enriched.slice(0, 8);

  return (
    <div className="flex flex-col gap-2.5">
      {/* Header + summary */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Kondisi Kota Lain</p>
        <span className="text-[10px] text-slate-400">{loaded.length}/{CITIES.length - 1} kota</span>
      </div>

      {/* Summary pills */}
      {loaded.length > 0 && (
        <div className="flex gap-1.5">
          <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 px-2 py-1.5 text-center">
            <p className="text-sm font-black text-slate-700 tabular-nums">{avgIspu ?? "—"}</p>
            <p className="text-[9px] text-slate-400">Rata-rata</p>
          </div>
          <div className="flex-1 rounded-xl bg-amber-50 border border-amber-100 px-2 py-1.5 text-center">
            <p className="text-sm font-black text-amber-600 tabular-nums">{unhealthy}</p>
            <p className="text-[9px] text-amber-500">Tdk Sehat</p>
          </div>
          <div className="flex-1 rounded-xl bg-red-50 border border-red-100 px-2 py-1.5 text-center">
            <p className="text-sm font-black text-red-600 tabular-nums">{dangerous}</p>
            <p className="text-[9px] text-red-500">Berbahaya</p>
          </div>
        </div>
      )}

      {/* City rows — compact single-line */}
      <div className="flex flex-col divide-y divide-slate-50">
        {displayCities.map(c => {
          const ispu = c.air?.ispuNow;
          return (
            <button
              key={c.id}
              onClick={() => setCity(c.id as CityId)}
              className="flex items-center gap-2.5 py-2 px-1 text-left hover:bg-slate-50 rounded-xl transition-colors w-full"
            >
              {/* Colour dot */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ispuDot(ispu?.value)}`} />
              {/* Name + province */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{c.name}</p>
                <p className="text-[10px] text-slate-400 truncate leading-none">{c.province}</p>
              </div>
              {/* ISPU value */}
              {ispu ? (
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-black tabular-nums" style={{ color: ispuColor(ispu.value) }}>
                    {ispu.value}
                  </span>
                  <p className="text-[9px] text-slate-400 leading-none">{ispuLabel(ispu.value)}</p>
                </div>
              ) : (
                <span className="text-xs text-slate-300">—</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Show more / less */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center justify-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-700 py-1 transition-colors"
      >
        {expanded
          ? <><ChevronUp size={13} /> Sembunyikan</>
          : <><ChevronDown size={13} /> Lihat semua {enriched.length} kota</>}
      </button>
    </div>
  );
}
