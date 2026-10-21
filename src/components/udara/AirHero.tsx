"use client";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { StaleBanner } from "@/components/ui/StaleBanner";
import { DemoChip } from "@/components/ui/DemoChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { SourceTag } from "@/components/ui/SourceTag";
import type { AirCity } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";

const CAT_EMOJI: Record<string, string> = {
  BAIK: "🌿", SEDANG: "🌤️", TIDAK_SEHAT: "😷",
  SANGAT_TIDAK_SEHAT: "⚠️", BERBAHAYA: "🔥",
};

// Soft pastel gradients that feel weather-app-like (light version always visible)
const CAT_GRADIENT: Record<string, string> = {
  BAIK:              "from-emerald-400 to-teal-500",
  SEDANG:            "from-blue-400 to-sky-500",
  TIDAK_SEHAT:       "from-yellow-400 to-amber-500",
  SANGAT_TIDAK_SEHAT:"from-orange-500 to-red-500",
  BERBAHAYA:         "from-gray-800 to-gray-900",
};

interface AirHeroProps {
  city: AirCity | undefined;
  envelope: ApiEnvelope<AirCity[]> | undefined;
  isLoading: boolean;
  error: unknown;
  retry: () => void;
}

export function AirHero({ city, envelope, isLoading, error, retry }: AirHeroProps) {
  if (isLoading && !city) return <Skeleton className="h-52 w-full rounded-3xl" />;
  if (error && !city) return <ErrorCard message="Gagal memuat data udara." onRetry={retry} />;
  if (!city) return <EmptyState message="Tidak ada data udara untuk kota ini." icon="💨" />;

  const ispu = city.ispuNow;
  const cat = ispu?.category ?? "SEDANG";
  const grad = CAT_GRADIENT[cat] ?? "from-slate-400 to-slate-600";

  return (
    <div className={`relative rounded-3xl bg-gradient-to-br ${grad} text-white overflow-hidden shadow-2xl`}>
      {/* Decorative circle */}
      <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-12 -left-8 w-40 h-40 rounded-full bg-black/10 pointer-events-none" />

      <div className="relative z-10 p-6">
        {envelope?.stale && <div className="mb-3"><StaleBanner updatedAt={city.updatedLocal} onRetry={retry} /></div>}
        {envelope?.demo && <div className="mb-2"><DemoChip /></div>}

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium opacity-75 uppercase tracking-wide">ISPU per jam (indikatif)</p>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-[88px] font-thin leading-none tabular-nums drop-shadow-lg">
                {ispu?.value ?? "—"}
              </span>
              <span className="text-5xl mb-2">{CAT_EMOJI[cat] ?? "💨"}</span>
            </div>
            <p className="text-2xl font-semibold mt-1">{ispu?.label ?? "Tidak ada data"}</p>
          </div>

          {city.ispu24h && (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-4 text-center flex-shrink-0">
              <p className="text-xs opacity-70 uppercase tracking-wide">24 Jam</p>
              <p className="text-4xl font-light tabular-nums mt-1">{city.ispu24h.value}</p>
              <p className="text-sm mt-1 opacity-90">{city.ispu24h.label}</p>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-white/20">
          <SourceTag source="Open-Meteo (CAMS)" time={city.updatedLocal} tz={city.tzLabel} />
          <p className="text-xs mt-1 opacity-50">CAMS ≈ model 40 km, bukan pengukuran stasiun.</p>
        </div>
      </div>
    </div>
  );
}
