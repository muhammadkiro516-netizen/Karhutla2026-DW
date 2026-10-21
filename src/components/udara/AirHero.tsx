"use client";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { StaleBanner } from "@/components/ui/StaleBanner";
import { DemoChip } from "@/components/ui/DemoChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { SourceTag } from "@/components/ui/SourceTag";
import type { AirCity } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";

// Weather-style icon for each ISPU category
const CATEGORY_ICON: Record<string, string> = {
  BAIK: "🌿",
  SEDANG: "☁️",
  TIDAK_SEHAT: "😷",
  SANGAT_TIDAK_SEHAT: "⚠️",
  BERBAHAYA: "🔥",
};

interface AirHeroProps {
  city: AirCity | undefined;
  envelope: ApiEnvelope<AirCity[]> | undefined;
  isLoading: boolean;
  error: unknown;
  retry: () => void;
}

export function AirHero({ city, envelope, isLoading, error, retry }: AirHeroProps) {
  if (isLoading && !city) {
    return <Skeleton className="h-52 w-full rounded-[--radius-card]" />;
  }
  if (error && !city) {
    return <ErrorCard message="Gagal memuat data udara." onRetry={retry} />;
  }
  if (!city) {
    return <EmptyState message="Tidak ada data udara untuk kota ini." icon="💨" />;
  }

  const ispu = city.ispuNow;
  const bgColor = ispu?.color ?? "#6b7280";
  const isBerbahaya = ispu?.category === "BERBAHAYA";

  return (
    <div
      className={`hero-grad rounded-[--radius-card] p-6 text-white relative overflow-hidden transition-all duration-[600ms] shadow-xl ${isBerbahaya ? "ring-2 ring-white/40" : ""}`}
      style={{
        background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 40%, ${bgColor}aa 100%)`,
      }}
    >
      {envelope?.stale && (
        <div className="mb-3 relative z-10">
          <StaleBanner updatedAt={city.updatedLocal} onRetry={retry} />
        </div>
      )}
      {envelope?.demo && (
        <div className="mb-2 relative z-10">
          <DemoChip />
        </div>
      )}

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80">ISPU per jam (indikatif)</p>
          <div className="flex items-baseline gap-3 mt-1">
            <p className="text-[80px] font-extralight leading-none tabular-nums">
              {ispu?.value != null ? ispu.value : "—"}
            </p>
            <span className="text-4xl">{CATEGORY_ICON[ispu?.category ?? ""] ?? "💨"}</span>
          </div>
          <p className="text-xl font-semibold mt-2">{ispu?.label ?? "Tidak ada data"}</p>
        </div>
        <div className="text-right">
          {city.ispu24h && (
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs opacity-70">ISPU 24 jam</p>
              <p className="text-3xl font-light tabular-nums">{city.ispu24h.value}</p>
              <p className="text-sm opacity-90">{city.ispu24h.label}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 relative z-10 opacity-80">
        <SourceTag source="Open-Meteo (CAMS)" time={city.updatedLocal} tz={city.tzLabel} />
        <p className="text-xs mt-1 opacity-60">CAMS ≈ model 40 km, bukan pengukuran stasiun.</p>
      </div>
    </div>
  );
}
