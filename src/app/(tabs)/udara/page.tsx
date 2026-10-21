"use client";
import { useAir } from "@/hooks/useAir";
import { useWeather } from "@/hooks/useWeather";
import { useHotspots } from "@/hooks/useHotspots";
import { useCity } from "@/hooks/useCity";
import { useModes } from "@/hooks/useModes";
import { AirHero } from "@/components/udara/AirHero";
import { MetricPills } from "@/components/udara/MetricPills";
import { TodayAdvice } from "@/components/udara/TodayAdvice";
import { TomorrowCard } from "@/components/udara/TomorrowCard";
import { SmokeHint } from "@/components/udara/SmokeHint";
import { IspuChartLazy } from "@/components/udara/IspuChartLazy";
import { OtherCities } from "@/components/udara/OtherCities";
import { ReadAloud } from "@/components/udara/ReadAloud";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function UdaraPage() {
  const { city } = useCity();
  const {
    data: allAir,
    envelope: airEnv,
    isLoading: airLoading,
    error: airError,
    retry: airRetry,
  } = useAir();
  const { data: allWeather } = useWeather();
  const { data: hotspots } = useHotspots();

  const airCity = allAir?.find((a) => a.cityId === city.id);
  const weatherCity = allWeather?.find((w) => w.cityId === city.id);
  const { vulnerable } = useModes();
  const status = vulnerable ? airCity?.statusVulnerable : airCity?.status;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="lg:grid lg:grid-cols-[3fr_2fr] lg:gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <AirHero
            city={airCity}
            envelope={airEnv}
            isLoading={airLoading}
            error={airError}
            retry={airRetry}
          />
          <MetricPills air={airCity} weather={weatherCity} />
          <SmokeHint hotspots={hotspots} air={airCity} cityId={city.id} />
          <Card>
            <TodayAdvice status={status} vulnerable={vulnerable} />
            {airCity && <TomorrowCard tomorrow={airCity.tomorrow} city={city} />}
          </Card>
          <ReadAloud city={airCity} cityName={city.name} />
        </div>

        {/* Right column (desktop) / below on mobile */}
        <div className="flex flex-col gap-4 mt-4 lg:mt-0">
          <Card>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              Grafik ISPU
            </p>
            {airCity ? (
              <IspuChartLazy hourly={airCity.hourly} tzLabel={airCity.tzLabel} />
            ) : airLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : null}
          </Card>
          <OtherCities allAir={allAir} />
        </div>
      </div>
    </div>
  );
}
