import { NextResponse } from "next/server";
import { CITIES } from "@/config/cities";
import { CACHE_SECONDS } from "@/config/thresholds";
import { cached } from "@/server/cache";
import { fetchAirAll } from "@/server/openmeteo";
import { toIspuSeries, ispu24h, pm25ToIspu } from "@/lib/ispu";
import { evaluateSchoolStatus, forecastSchoolDay, statusOf } from "@/lib/school-status";
import type { AirCity, AirHourly } from "@/types/api";
import type { ApiEnvelope, HourlyPoint } from "@/types/domain";


export async function GET() {
  const ttl = CACHE_SECONDS.air;
  const fetchedAt = new Date().toISOString();

  try {
    const { value: blocks, at, stale } = await cached("air", ttl, fetchAirAll);

    const cities: AirCity[] = CITIES.map((city, i) => {
      const block = blocks[i];
      if (!block) return fallbackCity(city.id, city.tzLabel);

      const tz = block.timezone ?? city.tz;
      const now = new Date();
      const nowLocalStr = new Intl.DateTimeFormat("sv-SE", {
        timeZone: tz,
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now).replace(" ", "T");

      const times = block.hourly.time;
      const pm25Arr = block.hourly.pm2_5;
      const pm10Arr = block.hourly.pm10 ?? [];
      const usAqiArr = block.hourly.us_aqi ?? [];

      const hourlyPoints: HourlyPoint[] = times.map((t, idx) => ({ time: t, value: pm25Arr[idx] ?? null }));
      const ispuSeries = toIspuSeries(hourlyPoints);

      // Split forecast vs observed
      const hourly: AirHourly[] = times.map((t, idx) => ({
        time: t,
        pm25: pm25Arr[idx] ?? null,
        ispu: ispuSeries[idx]?.value ?? null,
        usAqi: usAqiArr[idx] ?? null,
        forecast: t > nowLocalStr.slice(0, 16),
      }));

      const observedIspu = ispuSeries
        .filter((_p, idx) => !hourly[idx].forecast)
        .map(p => p.value);
      const status = evaluateSchoolStatus(observedIspu);
      const statusVulnerable = evaluateSchoolStatus(observedIspu, true);

      // Tomorrow's date in local tz
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = new Intl.DateTimeFormat("sv-SE", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(tomorrow);

      const tomorrowForecast = forecastSchoolDay(
        hourlyPoints.filter(p => p.time.startsWith(tomorrowDate)),
        tomorrowDate
      );

      const current = block.current;
      const pm25Now = current?.pm2_5 ?? pm25Arr[pm25Arr.length - 1] ?? null;

      const updatedLocal =
        new Intl.DateTimeFormat("id-ID", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date(at)) + " " + city.tzLabel;

      return {
        cityId: city.id,
        tzLabel: city.tzLabel,
        updatedLocal,
        pm25: pm25Now,
        pm10: current?.pm10 ?? pm10Arr[pm10Arr.length - 1] ?? null,
        usAqi: current?.us_aqi ?? null,
        ispuNow: pm25ToIspu(pm25Now),
        ispu24h: ispu24h(hourlyPoints),
        hourly,
        status,
        statusVulnerable,
        tomorrow: tomorrowForecast
          ? {
              date: tomorrowDate,
              status: tomorrowForecast.status,
              peakIspu: tomorrowForecast.peakIspu,
              window: tomorrowForecast.window,
            }
          : null,
      };
    });

    const envelope: ApiEnvelope<AirCity[]> = {
      data: cities,
      source: "Open-Meteo (CAMS)",
      fetchedAt,
      stale,
    };

    return NextResponse.json(envelope, {
      headers: {
        "Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=${ttl * 6}`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Gagal memuat data udara." }, { status: 502 });
  }
}

function fallbackCity(cityId: string, tzLabel: string): AirCity {
  return {
    cityId,
    tzLabel,
    updatedLocal: "-",
    pm25: null,
    pm10: null,
    usAqi: null,
    ispuNow: null,
    ispu24h: null,
    hourly: [],
    status: statusOf(0, "Tidak ada data."),
    statusVulnerable: statusOf(0, "Tidak ada data."),
    tomorrow: null,
  };
}
