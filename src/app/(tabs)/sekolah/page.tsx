"use client";
import { useState } from "react";
import { useAir } from "@/hooks/useAir";
import { useCity } from "@/hooks/useCity";
import { useModes } from "@/hooks/useModes";
import { useDecisions } from "@/hooks/useDecisions";
import { useLocalStore } from "@/hooks/useLocalStore";
import { SchoolList } from "@/components/sekolah/SchoolList";
import { TomorrowStrip } from "@/components/sekolah/TomorrowStrip";
import { RoleSwitch } from "@/components/sekolah/RoleSwitch";
import { ApproveSheet } from "@/components/sekolah/ApproveSheet";
import { AuditLog } from "@/components/sekolah/AuditLog";
import { AnnouncementCard } from "@/components/sekolah/AnnouncementCard";
import { QrPoster } from "@/components/sekolah/QrPoster";
import { SimulationPanel } from "@/components/sekolah/SimulationPanel";
import { RuleCard } from "@/components/sekolah/RuleCard";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { StaleBanner } from "@/components/ui/StaleBanner";
import { SCHOOLS } from "@/data/seed";
import { evaluateSchoolStatus } from "@/lib/school-status";
import type { SchoolStatus } from "@/types/domain";
import type { DecisionPayload } from "@/lib/audit";

export default function SekolahPage() {
  const { city } = useCity();
  const { vulnerable } = useModes();
  const { data: allAir, envelope, isLoading, error, retry } = useAir();
  const { log, chainValid, addDecision, getLatest } = useDecisions();
  const [isAdmin] = useLocalStore("eduair-role-admin", false);
  const [approveSchool, setApproveSchool] = useState<string | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState<string | null>(null);
  const [showQr, setShowQr] = useState<string | null>(null);

  const airCity = allAir?.find((a) => a.cityId === city.id);
  const ispuSeries = (airCity?.hourly ?? [])
    .filter((h) => !h.forecast)
    .map((h) => h.ispu);
  const citySchools = SCHOOLS.filter((s) => s.cityId === city.id);

  const officialDecisions: Record<string, SchoolStatus> = {};
  for (const school of citySchools) {
    const latest = getLatest(school.slug);
    if (latest) {
      officialDecisions[school.slug] = {
        level: 0,
        code: latest.decided as SchoolStatus["code"],
        label: (
          {
            NORMAL: "Normal",
            WASPADA: "Waspada",
            HYBRID: "Hybrid",
            DARING_DARURAT: "Daring Darurat",
          } as Record<string, string>
        )[latest.decided] ?? latest.decided,
        reason: latest.note ?? `Diputuskan oleh ${latest.approver}.`,
      };
    }
  }

  const approveSchoolObj = approveSchool
    ? citySchools.find((s) => s.slug === approveSchool)
    : null;
  const approveRecommended = approveSchoolObj
    ? evaluateSchoolStatus(
        ispuSeries,
        approveSchoolObj.level === "PAUD" || approveSchoolObj.level === "SLB",
      )
    : null;

  const handleApprove = async (payload: DecisionPayload) => {
    await addDecision(payload);
    setApproveSchool(null);
  };

  const todayStr = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: city.tz,
  }).format(new Date());

  if (isLoading && !airCity) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error && !airCity) {
    return (
      <div className="p-4">
        <ErrorCard message="Gagal memuat data udara." onRetry={retry} />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {envelope?.stale && (
        <div className="mb-4">
          <StaleBanner
            updatedAt={airCity?.updatedLocal ?? "-"}
            onRetry={retry}
          />
        </div>
      )}
      <div className="lg:grid lg:grid-cols-[3fr_2fr] lg:gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <TomorrowStrip air={airCity} city={city} />
          <RoleSwitch />
          <SchoolList
            cityId={city.id}
            air={airCity}
            officialDecisions={officialDecisions}
          />
          {isAdmin &&
            citySchools.map((school) => {
              const isVulnerable =
                school.level === "PAUD" || school.level === "SLB";
              const official = officialDecisions[school.slug];
              return (
                <div
                  key={school.slug}
                  className="flex flex-wrap gap-2 items-center"
                >
                  <button
                    onClick={() => setApproveSchool(school.slug)}
                    className="text-sm bg-blue-500 text-white px-4 py-1.5 rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Setujui {school.level}
                  </button>
                  {official && (
                    <>
                      <button
                        onClick={() => setShowAnnouncement(prev => prev === school.slug ? null : school.slug)}
                        className="text-sm border border-slate-200 dark:border-slate-600 px-4 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        Pengumuman
                      </button>
                      <button
                        onClick={() => setShowQr(prev => prev === school.slug ? null : school.slug)}
                        className="text-sm border border-slate-200 dark:border-slate-600 px-4 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        QR Poster
                      </button>
                    </>
                  )}
                  {showAnnouncement === school.slug && official && (
                    <AnnouncementCard
                      schoolName={school.name}
                      cityName={city.name}
                      status={official}
                      date={todayStr}
                      ispu={airCity?.ispuNow?.value ?? null}
                    />
                  )}
                  {showQr === school.slug && official && (
                    <QrPoster
                      schoolSlug={school.slug}
                      schoolName={school.name}
                      status={official}
                    />
                  )}
                  {/* suppress unused isVulnerable lint if school has no official */}
                  {isVulnerable && null}
                </div>
              );
            })}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 mt-4 lg:mt-0">
          <SimulationPanel vulnerable={vulnerable} />
          <RuleCard vulnerable={vulnerable} />
          <Card>
            <AuditLog log={log} chainValid={chainValid} />
          </Card>
        </div>
      </div>

      {approveSchool && approveSchoolObj && approveRecommended && (
        <ApproveSheet
          open
          onClose={() => setApproveSchool(null)}
          schoolSlug={approveSchool}
          schoolName={approveSchoolObj.name}
          cityId={city.id}
          recommended={approveRecommended}
          ispu={airCity?.ispuNow?.value ?? null}
          onApprove={handleApprove}
        />
      )}
    </div>
  );
}
