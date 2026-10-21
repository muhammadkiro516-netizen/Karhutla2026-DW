import { compassName } from "@/lib/geo";
import type { AirCity, WeatherCity } from "@/types/api";

interface MetricPillsProps {
  air: AirCity | undefined;
  weather: WeatherCity | undefined;
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center bg-white/80 dark:bg-zinc-800/80 rounded-xl px-3 py-2 min-w-[64px]">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
  );
}

export function MetricPills({ air, weather }: MetricPillsProps) {
  const windDir =
    weather?.windFromDeg != null ? compassName(weather.windFromDeg) : null;
  const windStr =
    weather?.windKmh != null
      ? `${Math.round(weather.windKmh)} km/j${windDir ? ` dari ${windDir}` : ""}`
      : "—";

  return (
    <div className="flex gap-2 flex-wrap">
      <Pill
        label="PM2.5"
        value={air?.pm25 != null ? `${air.pm25.toFixed(1)} µg` : "—"}
      />
      <Pill
        label="PM10"
        value={air?.pm10 != null ? `${air.pm10.toFixed(1)} µg` : "—"}
      />
      <Pill
        label="US AQI"
        value={air?.usAqi != null ? String(air.usAqi) : "—"}
      />
      <Pill
        label="RH"
        value={weather?.rh != null ? `${Math.round(weather.rh)}%` : "—"}
      />
      <Pill label="Angin" value={windStr} />
    </div>
  );
}
