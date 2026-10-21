"use client";
import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { StaleBanner } from "@/components/ui/StaleBanner";
import { DemoChip } from "@/components/ui/DemoChip";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AirCity } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";

// Color config — no emoji, just colors and plain words
const CAT_CONFIG: Record<string, { bg: string; text: string; badge: string; label: string; sublabel: string }> = {
  BAIK:              { bg: "from-emerald-500 to-teal-600",   text: "text-white", badge: "bg-white/20", label: "Udara Sehat",          sublabel: "Aman untuk beraktivitas di luar" },
  SEDANG:            { bg: "from-blue-500 to-sky-600",       text: "text-white", badge: "bg-white/20", label: "Udara Cukup Baik",      sublabel: "Bisa keluar, tapi tetap waspada" },
  TIDAK_SEHAT:       { bg: "from-amber-400 to-orange-500",   text: "text-white", badge: "bg-white/20", label: "Udara Tidak Sehat",     sublabel: "Kurangi aktivitas di luar rumah" },
  SANGAT_TIDAK_SEHAT:{ bg: "from-red-500 to-rose-600",       text: "text-white", badge: "bg-white/20", label: "Udara Sangat Buruk",    sublabel: "Hindari keluar rumah jika bisa" },
  BERBAHAYA:         { bg: "from-gray-900 to-red-950",       text: "text-white", badge: "bg-white/15", label: "Udara Berbahaya",       sublabel: "Tetap di dalam, tutup semua ventilasi" },
};

// Minimal canvas fire animation — only for BERBAHAYA & SANGAT_TIDAK_SEHAT
function FireFlicker({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0;
    let id: number;
    const draw = () => {
      const W = canvas.width; const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < 6; i++) {
        const x = (i / 6 + 0.08) * W;
        const h = (0.5 + 0.35 * Math.sin(t * 2.5 + i * 1.3)) * H;
        const g = ctx.createLinearGradient(x, H, x, H - h);
        g.addColorStop(0, "rgba(251,146,60,0.8)");
        g.addColorStop(0.5, "rgba(239,68,68,0.5)");
        g.addColorStop(1, "rgba(239,68,68,0)");
        ctx.beginPath();
        const w = W / 7;
        ctx.moveTo(x - w / 2, H);
        ctx.bezierCurveTo(x - w / 3, H - h * 0.5, x + w * 0.3 * Math.sin(t + i), H - h, x, H - h);
        ctx.bezierCurveTo(x - w * 0.3 * Math.sin(t + i), H - h, x + w / 3, H - h * 0.5, x + w / 2, H);
        ctx.fillStyle = g;
        ctx.fill();
      }
      t += 0.05;
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} width={400} height={60} className="absolute bottom-0 left-0 right-0 w-full h-16 opacity-60 pointer-events-none" />;
}

interface AirHeroProps {
  city: AirCity | undefined;
  envelope: ApiEnvelope<AirCity[]> | undefined;
  isLoading: boolean; error: unknown; retry: () => void;
}

export function AirHero({ city, envelope, isLoading, error, retry }: AirHeroProps) {
  if (isLoading && !city) return <Skeleton className="h-52 w-full rounded-3xl" />;
  if (error && !city) return <ErrorCard message="Gagal memuat data udara." onRetry={retry} />;
  if (!city) return <EmptyState message="Tidak ada data untuk kota ini." icon="" />;

  const ispu = city.ispuNow;
  const cat = ispu?.category ?? "SEDANG";
  const cfg = CAT_CONFIG[cat] ?? CAT_CONFIG.SEDANG;
  const hasFlicker = cat === "BERBAHAYA" || cat === "SANGAT_TIDAK_SEHAT";

  return (
    <div className={`relative rounded-3xl bg-gradient-to-br ${cfg.bg} overflow-hidden shadow-xl`}>
      <FireFlicker active={hasFlicker} />
      <div className="relative z-10 p-6 pb-8">
        {envelope?.stale && <div className="mb-3"><StaleBanner updatedAt={city.updatedLocal} onRetry={retry} /></div>}
        {envelope?.demo && <div className="mb-2"><DemoChip /></div>}

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">
              {city.tzLabel} — Kondisi Sekarang
            </p>
            <p className="text-[80px] font-black leading-none tabular-nums text-white drop-shadow-lg">
              {ispu?.value ?? "—"}
            </p>
            <p className="text-2xl font-bold text-white mt-1">{cfg.label}</p>
            <p className="text-sm text-white/80 mt-1">{cfg.sublabel}</p>
          </div>

          {city.ispu24h && (
            <div className={`${cfg.badge} backdrop-blur-sm rounded-2xl px-4 py-3 text-center flex-shrink-0 border border-white/20`}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">Rata-rata 24 jam</p>
              <p className="text-3xl font-black text-white tabular-nums mt-1">{city.ispu24h.value}</p>
              <p className="text-xs text-white/80 mt-0.5">{city.ispu24h.label}</p>
            </div>
          )}
        </div>

        <p className="text-xs text-white/50 mt-4">
          Data: Open-Meteo CAMS · Diperbarui {city.updatedLocal} · Model atmosfer, bukan alat ukur langsung
        </p>
      </div>
    </div>
  );
}
