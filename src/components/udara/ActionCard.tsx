"use client";
import { AlertTriangle, CheckCircle, Info, ShieldAlert, Wind } from "lucide-react";
import { compassName } from "@/lib/geo";
import type { WeatherCity } from "@/types/api";
import type { SchoolStatus } from "@/types/domain";

// Plain Indonesian action steps per level
const LEVEL_ACTIONS: Record<string, { title: string; steps: string[]; border: string; bg: string; iconColor: string }> = {
  NORMAL: {
    title: "Kondisi Aman",
    steps: [
      "Kamu bisa beraktivitas normal di luar ruangan.",
      "Tetap minum air putih yang cukup.",
      "Pantau terus udara, kondisi bisa berubah sewaktu-waktu.",
    ],
    border: "border-emerald-200", bg: "bg-emerald-50", iconColor: "text-emerald-600",
  },
  WASPADA: {
    title: "Sebaiknya Hati-hati",
    steps: [
      "Batasi kegiatan berat di luar seperti olahraga atau berlari.",
      "Gunakan masker jika harus keluar lebih dari 30 menit.",
      "Anak-anak dan lansia sebaiknya bermain di dalam rumah.",
    ],
    border: "border-blue-200", bg: "bg-blue-50", iconColor: "text-blue-600",
  },
  HYBRID: {
    title: "Kurangi Waktu di Luar",
    steps: [
      "Tutup jendela dan pintu rumah sekarang.",
      "Pakai masker N95 atau KN95 jika terpaksa keluar.",
      "Anak-anak, lansia, penderita asma — tetap di dalam.",
      "Matikan kipas angin jendela agar asap tidak masuk.",
    ],
    border: "border-amber-200", bg: "bg-amber-50", iconColor: "text-amber-600",
  },
  DARING_DARURAT: {
    title: "Tetap di Dalam Rumah",
    steps: [
      "Tutup semua jendela dan pintu rapat-rapat sekarang.",
      "Nyalakan air purifier atau AC filter jika ada.",
      "Jangan keluar kecuali sangat mendesak.",
      "Jika sesak napas atau mata perih, hubungi dokter atau Puskesmas.",
      "Gunakan masker N95 bahkan di dalam rumah jika ada.",
    ],
    border: "border-red-200", bg: "bg-red-50", iconColor: "text-red-600",
  },
};

const ICON_MAP = { NORMAL: CheckCircle, WASPADA: Info, HYBRID: AlertTriangle, DARING_DARURAT: ShieldAlert };

interface ActionCardProps {
  cityName: string;
  status: SchoolStatus | undefined;
  weather: WeatherCity | undefined;
  vulnerable: boolean;
}

export function ActionCard({ cityName, status, weather, vulnerable }: ActionCardProps) {
  if (!status) return null;
  const lvl = status.code;
  const cfg = LEVEL_ACTIONS[lvl] ?? LEVEL_ACTIONS.NORMAL;
  const Icon = ICON_MAP[lvl as keyof typeof ICON_MAP] ?? Info;

  // Wind info in plain words
  const windKmh = weather?.windKmh != null ? Math.round(weather.windKmh) : null;
  const windDir = weather?.windFromDeg != null ? compassName(weather.windFromDeg) : null;
  const windDesc = windKmh != null
    ? windKmh < 5 ? "Angin hampir tidak bergerak"
    : windKmh < 15 ? `Angin pelan dari arah ${windDir ?? "—"} (${windKmh} km/jam)`
    : windKmh < 30 ? `Angin sedang dari arah ${windDir ?? "—"} (${windKmh} km/jam) — asap bisa menyebar cepat`
    : `Angin kencang dari arah ${windDir ?? "—"} (${windKmh} km/jam) — asap menyebar sangat cepat`
    : null;

  // Humidity info
  const rh = weather?.rh != null ? Math.round(weather.rh) : null;
  const rhDesc = rh != null
    ? rh < 40 ? `Udara kering (${rh}%) — partikel debu mudah beterbangan`
    : rh < 70 ? `Kelembaban normal (${rh}%)`
    : `Udara lembab (${rh}%) — sedikit mengurangi debu`
    : null;

  return (
    <div className={`rounded-3xl border-2 ${cfg.border} ${cfg.bg} p-5`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className={cfg.iconColor} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Yang harus kamu lakukan di {cityName} sekarang
          </p>
          <p className="text-base font-bold text-slate-800">{cfg.title}</p>
        </div>
      </div>

      {/* Steps */}
      <ul className="flex flex-col gap-2 mb-4">
        {cfg.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
            <span className="w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0 mt-px">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
        {vulnerable && lvl !== "NORMAL" && (
          <li className="flex items-start gap-2.5 text-sm text-slate-700">
            <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-700 flex-shrink-0 mt-px">!</span>
            Karena Mode Rentan aktif: anak kecil, lansia, penderita asma, ibu hamil perlu lebih ketat menjaga diri.
          </li>
        )}
      </ul>

      {/* Wind + humidity detail */}
      {(windDesc || rhDesc) && (
        <div className="border-t border-current/10 pt-3 flex flex-col gap-1.5">
          {windDesc && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Wind size={13} className="flex-shrink-0 text-slate-400" />
              <span>{windDesc}</span>
            </div>
          )}
          {rhDesc && (
            <p className="text-xs text-slate-500 pl-5">{rhDesc}</p>
          )}
        </div>
      )}
    </div>
  );
}
