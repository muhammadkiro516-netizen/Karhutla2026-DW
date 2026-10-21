import { compassName } from "@/lib/geo";
import { Droplets, Wind, Thermometer } from "lucide-react";
import type { AirCity, WeatherCity } from "@/types/api";

function Pill({ label, value, sub, Icon }: {
  label: string; value: string; sub?: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="flex flex-col bg-white rounded-2xl px-3 py-3 shadow-sm border border-slate-100 flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={13} className="text-slate-300 flex-shrink-0" />
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 truncate">{label}</span>
      </div>
      <span className="text-base font-bold text-slate-800 tabular-nums leading-tight">{value}</span>
      {sub && <span className="text-[10px] text-slate-400 mt-0.5 leading-snug">{sub}</span>}
    </div>
  );
}

interface MetricPillsProps {
  air: AirCity | undefined;
  weather: WeatherCity | undefined;
}

export function MetricPills({ air, weather }: MetricPillsProps) {
  const windDir = weather?.windFromDeg != null ? compassName(weather.windFromDeg) : null;
  const windVal = weather?.windKmh != null ? `${Math.round(weather.windKmh)} km/j` : "—";
  const windSub = windDir ? `dari ${windDir}` : undefined;

  const pm25Sub = air?.pm25 != null
    ? air.pm25 > 55 ? "Berbahaya di luar" : air.pm25 > 15 ? "Perlu diperhatikan" : "Bagus"
    : undefined;

  return (
    <div className="flex gap-2">
      <Pill label="Debu halus" value={air?.pm25 != null ? `${air.pm25.toFixed(0)} µg` : "—"} sub={pm25Sub} Icon={Droplets} />
      <Pill label="Kelembaban" value={weather?.rh != null ? `${Math.round(weather.rh)}%` : "—"}
        sub={weather?.rh != null ? (weather.rh > 70 ? "Lembab" : weather.rh < 40 ? "Kering" : "Normal") : undefined} Icon={Thermometer} />
      <Pill label="Angin" value={windVal} sub={windSub} Icon={Wind} />
    </div>
  );
}
