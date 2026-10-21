"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { DemoChip } from "@/components/ui/DemoChip";
import { StatusBadge } from "./StatusBadge";
import { WhySheet } from "./WhySheet";
import { SCHOOLS } from "@/data/seed";
import { evaluateSchoolStatus } from "@/lib/school-status";
import type { AirCity } from "@/types/api";
import type { SchoolStatus } from "@/types/domain";

interface SchoolListProps {
  cityId: string;
  air: AirCity | undefined;
  officialDecisions: Record<string, SchoolStatus>;
}

export function SchoolList({ cityId, air, officialDecisions }: SchoolListProps) {
  const [whyOpen, setWhyOpen] = useState<string | null>(null);
  const schools = SCHOOLS.filter((s) => s.cityId === cityId);
  const ispuSeries = (air?.hourly ?? [])
    .filter((h) => !h.forecast)
    .map((h) => h.ispu);

  if (schools.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Daftar Sekolah
        </p>
        <DemoChip />
      </div>
      {schools.map((school) => {
        const isVulnerable = school.level === "PAUD" || school.level === "SLB";
        const recommended = evaluateSchoolStatus(ispuSeries, isVulnerable);
        const official = officialDecisions[school.slug];
        const displayStatus = official ?? recommended;

        return (
          <Card key={school.slug} className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{school.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {school.level} {official ? "• Resmi" : "• Rekomendasi mesin"}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusBadge
                status={displayStatus}
                vulnerable={isVulnerable}
                size="sm"
              />
              <button
                onClick={() => setWhyOpen(school.slug)}
                className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline"
              >
                Kenapa?
              </button>
            </div>
            {whyOpen === school.slug && (
              <WhySheet
                open
                onClose={() => setWhyOpen(null)}
                status={displayStatus}
                schoolName={school.name}
              />
            )}
          </Card>
        );
      })}
    </div>
  );
}
