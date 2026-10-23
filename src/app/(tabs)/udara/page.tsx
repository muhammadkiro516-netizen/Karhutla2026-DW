"use client";
import { useAir } from "@/hooks/useAir";
import { useWeather } from "@/hooks/useWeather";
import { useHotspots } from "@/hooks/useHotspots";
import { useCity } from "@/hooks/useCity";
import { useModes } from "@/hooks/useModes";
import { AirHero } from "@/components/udara/AirHero";
import { MetricPills } from "@/components/udara/MetricPills";
import { ActionCard } from "@/components/udara/ActionCard";
import { SmokeHint } from "@/components/udara/SmokeHint";
import { TomorrowCard } from "@/components/udara/TomorrowCard";
import { IspuChartLazy } from "@/components/udara/IspuChartLazy";
import { OtherCities } from "@/components/udara/OtherCities";
import { ReadAloud } from "@/components/udara/ReadAloud";
import { HealthRiskCard } from "@/components/udara/HealthRiskCard";
import { AirTrendSummary } from "@/components/udara/AirTrendSummary";
import { ExposureCalculator } from "@/components/udara/ExposureCalculator";
import { WindCompass } from "@/components/udara/WindCompass";
import { HourlyHeatmap } from "@/components/udara/HourlyHeatmap";
import { IspuGauge } from "@/components/udara/IspuGauge";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function UdaraPage() {
  const { city } = useCity();
  const { data: allAir, envelope: airEnv, isLoading: airLoading, error: airError, retry: airRetry } = useAir();
  const { data: allWeather } = useWeather();
  const { data: hotspots } = useHotspots();

  const airCity = allAir?.find(a => a.cityId === city.id);
  const weatherCity = allWeather?.find(w => w.cityId === city.id);
  const { vulnerable } = useModes();
  const status = vulnerable ? airCity?.statusVulnerable : airCity?.status;

  return (
    <div className="px-4 pt-4 pb-8 max-w-5xl mx-auto">
      <div className="lg:grid lg:grid-cols-[3fr_2fr] lg:gap-6">

        {/* ════════════════ LEFT COLUMN ════════════════ */}
        <div className="flex flex-col gap-4">

          {/* 1. Big ISPU number hero */}
          <AirHero
            city={airCity}
            envelope={airEnv}
            isLoading={airLoading}
            error={airError}
            retry={airRetry}
          />

          {/* 2. PM2.5 / humidity / wind pills */}
          <MetricPills air={airCity} weather={weatherCity} />

          {/* 3. ISPU arc gauge with animated needle */}
          <IspuGauge air={airCity} />

          {/* 4. Personal action steps */}
          <ActionCard
            cityName={city.name}
            status={status}
            weather={weatherCity}
            vulnerable={vulnerable}
          />

          {/* 5. Per-group health risk + WHO / cigarette math */}
          <HealthRiskCard air={airCity} weather={weatherCity} />

          {/* 6. Interactive exposure calculator */}
          <ExposureCalculator pm25={airCity?.pm25 ?? null} />

          {/* 7. Smoke / drift hint */}
          <SmokeHint hotspots={hotspots} air={airCity} cityId={city.id} />

          {/* 8. Tomorrow forecast (shows after 18.00 local) */}
          {airCity && (
            <TomorrowCard tomorrow={airCity.tomorrow} city={city} />
          )}

          {/* 9. Read aloud */}
          <ReadAloud city={airCity} cityName={city.name} />
        </div>

        {/* ════════════════ RIGHT COLUMN ════════════════ */}
        <div className="flex flex-col gap-4 mt-4 lg:mt-0">

          {/* 10. 48-h line chart */}
          <Card>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Grafik ISPU 48 jam
            </p>
            {airCity ? (
              <IspuChartLazy hourly={airCity.hourly} tzLabel={airCity.tzLabel} />
            ) : airLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : null}
          </Card>

          {/* 11. Interactive hourly heatmap */}
          {airCity && (
            <HourlyHeatmap hourly={airCity.hourly} tzLabel={airCity.tzLabel} />
          )}

          {/* 12. Wind compass + speed ring */}
          <WindCompass weather={weatherCity} />

          {/* 13. 24-h trend: best/worst hour, hours unhealthy */}
          <AirTrendSummary air={airCity} />

          {/* 14. All 66 cities grouped by island */}
          <Card>
            <OtherCities allAir={allAir} />
          </Card>

        </div>
      </div>
    </div>
  );
}
