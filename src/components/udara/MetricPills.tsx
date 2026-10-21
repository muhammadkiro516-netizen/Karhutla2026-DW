import { compassName } from "@/lib/geo";
import { Droplets, Gauge, Wind, Cloud, Thermometer } from "lucide-react";
import type { AirCity, WeatherCity } from "@/types/api";

interface MetricPillsProps {
  air: AirCity | undefined;
  weather: WeatherCity | undefined;
}

function Pill({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center glass rounded-2xl px-3 py-2.5 min-w-[72px] border border-white/40 dark:border-slate-700/40 shadow-sm">
      <Icon size={16} className="text-slate-400 dark:text-slate-500 mb-1" />
      <span className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  );
}

export function MetricPills({ air, weather }: MetricPillsProps) {
  const windDir =
    weather?.windFromDeg != null ? compassName(weather.windFromDeg) : null;
  const windStr =
    weather?.windKmh != null
      ? `${Math.round(weather.windKmh)} km/j${windDir ? ` ${windDir}` : ""}`
      : "—";

  return (
    <div className="flex gap-2 flex-wrap">
      <Pill
        label="PM2.5"
        value={air?.pm25 != null ? `${air.pm25.toFixed(1)} µg` : "—"}
        Icon={Droplets}
      />
      <Pill
        label="PM10"
        value={air?.pm10 != null ? `${air.pm10.toFixed(1)} µg` : "—"}
        Icon={Cloud}
      />
      <Pill
        label="US AQI"
        value={air?.usAqi != null ? String(air.usAqi) : "—"}
        Icon={Gauge}
      />
      <Pill
        label="RH"
        value={weather?.rh != null ? `${Math.round(weather.rh)}%` : "—"}
        Icon={Thermometer}
      />
      <Pill label="Angin" value={windStr} Icon={Wind} />
    </div>
  );
}
