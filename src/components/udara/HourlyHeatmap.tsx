"use client";
/**
 * HourlyHeatmap — 7 rows × 24 cols grid.
 * Each row = one day in the 48-h window.
 * Each cell = one hour, coloured by ISPU category.
 * Tap/hover a cell shows exact ISPU + time.
 */
import { useState } from "react";
import type { AirHourly } from "@/types/api";

// ISPU → cell colour (tailwind bg)
function ispuBg(v: number | null, forecast: boolean): string {
  const opacity = forecast ? "/40" : "";
  if (v == null) return "bg-slate-100";
  if (v <= 50)  return `bg-emerald-400${opacity}`;
  if (v <= 100) return `bg-blue-400${opacity}`;
  if (v <= 200) return `bg-amber-400${opacity}`;
  if (v <= 300) return `bg-red-500${opacity}`;
  return `bg-gray-900${opacity}`;
}
function ispuLabel(v: number | null): string {
  if (v == null) return "Tidak ada data";
  if (v <= 50)  return "Baik";
  if (v <= 100) return "Sedang";
  if (v <= 200) return "Tidak Sehat";
  if (v <= 300) return "Sangat Tidak Sehat";
  return "Berbahaya";
}
function ispuTextColor(v: number | null): string {
  if (v == null) return "text-slate-400";
  if (v <= 50)  return "text-emerald-600";
  if (v <= 100) return "text-blue-600";
  if (v <= 200) return "text-amber-600";
  if (v <= 300) return "text-red-600";
  return "text-gray-800";
}

interface Cell {
  hour: number; // 0–23
  date: string; // "YYYY-MM-DD"
  ispu: number | null;
  pm25: number | null;
  forecast: boolean;
  time: string; // display "HH:mm"
}

function buildGrid(hourly: AirHourly[]): { days: string[]; grid: Map<string, Cell> } {
  const days = new Set<string>();
  const grid = new Map<string, Cell>();
  for (const h of hourly) {
    const date = h.time.slice(0, 10);
    const hour = parseInt(h.time.slice(11, 13), 10);
    days.add(date);
    grid.set(`${date}-${hour}`, {
      hour, date, ispu: h.ispu, pm25: h.pm25, forecast: h.forecast,
      time: h.time.slice(11, 16),
    });
  }
  return { days: [...days].sort(), grid };
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface HourlyHeatmapProps {
  hourly: AirHourly[];
  tzLabel: string;
}

export function HourlyHeatmap({ hourly, tzLabel }: HourlyHeatmapProps) {
  const [active, setActive] = useState<Cell | null>(null);
  const { days, grid } = buildGrid(hourly);

  if (!days.length) return null;

  const today = new Date();
  const todayStr = today.toLocaleDateString("sv-SE");

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Peta Panas ISPU per Jam
        </p>
        <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-full">
          {tzLabel}
        </span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {[
          { bg: "bg-emerald-400", label: "Baik" },
          { bg: "bg-blue-400", label: "Sedang" },
          { bg: "bg-amber-400", label: "Tdk Sehat" },
          { bg: "bg-red-500", label: "Sgt Tdk Sehat" },
          { bg: "bg-gray-900", label: "Bahaya" },
          { bg: "bg-slate-100", label: "Tdk ada data" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-sm ${l.bg}`} />
            <span className="text-[10px] text-slate-400">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Hour labels */}
          <div className="flex mb-1 pl-16">
            {HOURS.filter(h => h % 3 === 0).map(h => (
              <div key={h} className="text-center text-[9px] text-slate-400 font-medium"
                style={{ width: `${100 / 8}%` }}>
                {String(h).padStart(2, "0")}
              </div>
            ))}
          </div>

          {/* Rows */}
          {days.map(day => {
            const isToday = day === todayStr;
            const label = isToday ? "Hari ini" : day.slice(5); // MM-DD
            return (
              <div key={day} className="flex items-center gap-1 mb-0.5">
                <div className={`w-14 flex-shrink-0 text-[10px] font-semibold text-right pr-2 ${isToday ? "text-blue-600" : "text-slate-400"}`}>
                  {label}
                </div>
                <div className="flex gap-px flex-1">
                  {HOURS.map(h => {
                    const cell = grid.get(`${day}-${h}`);
                    const bg = ispuBg(cell?.ispu ?? null, cell?.forecast ?? false);
                    const isActive = active?.date === day && active?.hour === h;
                    return (
                      <button
                        key={h}
                        onMouseEnter={() => cell && setActive(cell)}
                        onFocus={() => cell && setActive(cell)}
                        onMouseLeave={() => setActive(null)}
                        onBlur={() => setActive(null)}
                        onClick={() => setActive(prev => prev?.date === day && prev?.hour === h ? null : (cell ?? null))}
                        className={`flex-1 h-6 rounded-sm transition-all cursor-pointer ${bg} ${isActive ? "ring-2 ring-slate-600 ring-offset-1 scale-110" : "hover:scale-105"}`}
                        aria-label={`${day} ${String(h).padStart(2, "0")}:00 — ISPU ${cell?.ispu ?? "tidak ada data"}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active cell tooltip */}
      {active ? (
        <div className={`rounded-2xl px-3 py-2.5 border flex items-center gap-3 transition-all ${
          active.ispu != null
            ? active.ispu <= 50 ? "bg-emerald-50 border-emerald-100"
            : active.ispu <= 100 ? "bg-blue-50 border-blue-100"
            : active.ispu <= 200 ? "bg-amber-50 border-amber-100"
            : "bg-red-50 border-red-100"
            : "bg-slate-50 border-slate-100"
        }`}>
          <div className="flex-1">
            <p className={`text-sm font-bold ${ispuTextColor(active.ispu)}`}>
              {active.date} {active.time} {tzLabel}
            </p>
            <p className="text-xs text-slate-500">
              ISPU {active.ispu ?? "—"} · {ispuLabel(active.ispu)}
              {active.pm25 != null && ` · PM2.5 ${active.pm25.toFixed(1)} µg/m³`}
            </p>
            {active.forecast && (
              <p className="text-[10px] text-slate-400 mt-0.5">Prakiraan (belum terukur)</p>
            )}
          </div>
          {active.ispu != null && (
            <span className={`text-2xl font-black tabular-nums ${ispuTextColor(active.ispu)}`}>
              {active.ispu}
            </span>
          )}
        </div>
      ) : (
        <p className="text-[10px] text-slate-300 text-center">
          Sentuh sel untuk melihat detail · Warna lebih terang = prakiraan
        </p>
      )}
    </div>
  );
}
