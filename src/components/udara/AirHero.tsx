"use client";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { StaleBanner } from "@/components/ui/StaleBanner";
import { DemoChip } from "@/components/ui/DemoChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { SourceTag } from "@/components/ui/SourceTag";
import type { AirCity } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";

interface AirHeroProps {
  city: AirCity | undefined;
  envelope: ApiEnvelope<AirCity[]> | undefined;
  isLoading: boolean;
  error: unknown;
  retry: () => void;
}

export function AirHero({ city, envelope, isLoading, error, retry }: AirHeroProps) {
  if (isLoading && !city) {
    return <Skeleton className="h-40 w-full rounded-[--radius-card]" />;
  }
  if (error && !city) {
    return <ErrorCard message="Gagal memuat data udara." onRetry={retry} />;
  }
  if (!city) {
    return <EmptyState message="Tidak ada data udara untuk kota ini." icon="💨" />;
  }

  const ispu = city.ispuNow;
  const bgColor = ispu?.color ?? "#6b7280";

  return (
    <div
      className="rounded-[--radius-card] p-6 text-white relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {envelope?.stale && (
        <div className="mb-3">
          <StaleBanner updatedAt={city.updatedLocal} onRetry={retry} />
        </div>
      )}
      {envelope?.demo && (
        <div className="mb-2">
          <DemoChip />
        </div>
      )}

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium opacity-80">ISPU per jam (indikatif)</p>
          <p className="text-7xl font-bold leading-none mt-1 tabular-nums">
            {ispu?.value != null ? ispu.value : "—"}
          </p>
          <p className="text-xl font-semibold mt-2">{ispu?.label ?? "Tidak ada data"}</p>
        </div>
        <div className="text-right">
          {city.ispu24h && (
            <div className="opacity-90">
              <p className="text-xs opacity-70">ISPU 24 jam</p>
              <p className="text-2xl font-bold tabular-nums">{city.ispu24h.value}</p>
              <p className="text-sm">{city.ispu24h.label}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 opacity-80">
        <SourceTag source="Open-Meteo (CAMS)" time={city.updatedLocal} tz={city.tzLabel} />
        <p className="text-xs mt-1 opacity-60">CAMS ≈ model 40 km, bukan pengukuran stasiun.</p>
      </div>
    </div>
  );
}
