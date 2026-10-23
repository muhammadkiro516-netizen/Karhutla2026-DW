"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { DemoChip } from "@/components/ui/DemoChip";
import { StatusBadge } from "./StatusBadge";
import { WhySheet } from "./WhySheet";
import { SCHOOLS } from "@/data/seed";
import { evaluateSchoolStatus } from "@/lib/school-status";
import { buildAnnouncement, waShareUrl } from "@/lib/advice";
import { Search, MessageCircle } from "lucide-react";
import type { AirCity } from "@/types/api";
import type { SchoolStatus } from "@/types/domain";

type Level = "SEMUA" | "PAUD" | "SD" | "SMP" | "SMA" | "SLB";
const LEVELS: Level[] = ["SEMUA", "SD", "SMP", "SMA", "PAUD", "SLB"];

const STATUS_ORDER = { DARING_DARURAT: 0, HYBRID: 1, WASPADA: 2, NORMAL: 3 };

interface SchoolListProps {
  cityId: string;
  air: AirCity | undefined;
  officialDecisions: Record<string, SchoolStatus>;
}

export function SchoolList({ cityId, air, officialDecisions }: SchoolListProps) {
  const [whyOpen, setWhyOpen] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<Level>("SEMUA");
  const [query, setQuery] = useState("");

  const schools = SCHOOLS.filter(s => s.cityId === cityId);
  const ispuSeries = (air?.hourly ?? []).filter(h => !h.forecast).map(h => h.ispu);

  if (schools.length === 0) return null;

  // Enrich
  const enriched = schools.map(school => {
    const isVulnerable = school.level === "PAUD" || school.level === "SLB";
    const recommended = evaluateSchoolStatus(ispuSeries, isVulnerable);
    const official = officialDecisions[school.slug];
    const displayStatus = official ?? recommended;
    return { ...school, isVulnerable, recommended, official, displayStatus };
  });

  // Filter
  const filtered = enriched
    .filter(s => levelFilter === "SEMUA" || s.level === levelFilter)
    .filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      (STATUS_ORDER[a.displayStatus.code] ?? 99) - (STATUS_ORDER[b.displayStatus.code] ?? 99)
    );

  // Counts per level
  const counts: Partial<Record<Level, number>> = { SEMUA: schools.length };
  for (const s of schools) counts[s.level as Level] = (counts[s.level as Level] ?? 0) + 1;

  // Urgent count
  const urgentCount = enriched.filter(s => s.displayStatus.code === "DARING_DARURAT" || s.displayStatus.code === "HYBRID").length;

  const now = new Date();
  const cityName = cityId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const dateLabel = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(now);
  const timeLabel = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now) + " WIB";

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Daftar Sekolah</p>
          <DemoChip />
        </div>
        {urgentCount > 0 && (
          <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
            {urgentCount} perlu perhatian
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Cari nama sekolah…"
          className="w-full pl-8 pr-3 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
      </div>

      {/* Level filter tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        {LEVELS.map(level => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              levelFilter === level
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {level} {counts[level] != null ? `(${counts[level]})` : ""}
          </button>
        ))}
      </div>

      {/* School cards */}
      {filtered.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-4">Tidak ada sekolah ditemukan.</p>
      )}
      {filtered.map(school => {
        const isUrgent = school.displayStatus.code === "DARING_DARURAT";
        const isWarn = school.displayStatus.code === "HYBRID" || school.displayStatus.code === "WASPADA";
        const announcement = buildAnnouncement({
          school: school.name,
          city: cityName,
          ispu: air?.ispuNow?.value ?? 0,
          status: school.displayStatus,
          timeLabel,
          dateLabel,
        });

        return (
          <Card
            key={school.slug}
            className={`flex flex-col gap-2.5 transition-all ${
              isUrgent ? "border-red-200 bg-red-50/40" : isWarn ? "border-amber-200 bg-amber-50/30" : ""
            }`}
          >
            {/* School info */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-slate-800">{school.name}</p>
                <p className="text-xs text-slate-400">
                  {school.level}
                  {school.isVulnerable && <span className="ml-1 text-amber-500 font-semibold">(Kelompok Rentan)</span>}
                  {" · "}
                  {school.official ? (
                    <span className="text-emerald-600 font-semibold">Resmi ✓</span>
                  ) : (
                    <span className="text-slate-400">Rekomendasi mesin</span>
                  )}
                </p>
              </div>
              <StatusBadge status={school.displayStatus} vulnerable={school.isVulnerable} size="sm" />
            </div>

            {/* Action row */}
            <div className="flex gap-2">
              <button
                onClick={() => setWhyOpen(school.slug)}
                className="flex-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl py-2 transition-colors"
              >
                Kenapa?
              </button>
              <a
                href={waShareUrl(announcement)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl py-2 transition-colors"
              >
                <MessageCircle size={12} />
                Bagikan
              </a>
            </div>

            {whyOpen === school.slug && (
              <WhySheet open onClose={() => setWhyOpen(null)} status={school.displayStatus} schoolName={school.name} />
            )}
          </Card>
        );
      })}

      {/* Total */}
      <p className="text-[10px] text-slate-400 text-center">
        Menampilkan {filtered.length} dari {schools.length} sekolah di {cityName}
      </p>
    </div>
  );
}
