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

          {/* Personal action card — what to do RIGHT NOW */}
          <ActionCard
            cityName={city.name}
            status={status}
            weather={weatherCity}
            vulnerable={vulnerable}
          />

          <SmokeHint hotspots={hotspots} air={airCity} cityId={city.id} />

          {airCity && (
            <TomorrowCard tomorrow={airCity.tomorrow} city={city} />
          )}

          <ReadAloud city={airCity} cityName={city.name} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 mt-4 lg:mt-0">
          <Card>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Grafik Kualitas Udara
            </p>
            {airCity ? (
              <IspuChartLazy hourly={airCity.hourly} tzLabel={airCity.tzLabel} />
            ) : airLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : null}
          </Card>

          <Card>
            <OtherCities allAir={allAir} />
          </Card>
        </div>
      </div>
    </div>
  );
}
