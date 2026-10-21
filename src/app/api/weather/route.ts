import { NextResponse } from "next/server";
import { CITIES } from "@/config/cities";
import { CACHE_SECONDS } from "@/config/thresholds";
import { cached } from "@/server/cache";
import { fetchWeatherAll } from "@/server/openmeteo";
import type { WeatherCity } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";

export const revalidate = CACHE_SECONDS.weather;

export async function GET() {
  const fetchedAt = new Date().toISOString();
  try {
    const { value: blocks, stale } = await cached("weather", CACHE_SECONDS.weather, fetchWeatherAll);

    const cities: WeatherCity[] = CITIES.map((city, i) => {
      const block = blocks[i];
      if (!block) {
        return { cityId: city.id, temp: null, rh: null, windKmh: null, windFromDeg: null, hourlyWind: [] };
      }
      const cur = block.current;
      return {
        cityId: city.id,
        temp: cur?.temperature_2m ?? null,
        rh: cur?.relative_humidity_2m ?? null,
        windKmh: cur?.wind_speed_10m ?? null,
        windFromDeg: cur?.wind_direction_10m ?? null,
        hourlyWind: block.hourly.time.map((t, idx) => ({
          time: t,
          windKmh: block.hourly.wind_speed_10m[idx] ?? 0,
          windFromDeg: block.hourly.wind_direction_10m[idx] ?? 0,
        })),
      };
    });

    const envelope: ApiEnvelope<WeatherCity[]> = {
      data: cities,
      source: "Open-Meteo",
      fetchedAt,
      stale,
    };
    return NextResponse.json(envelope, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS.weather}, stale-while-revalidate=${CACHE_SECONDS.weather * 6}`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Gagal memuat data cuaca." }, { status: 502 });
  }
}
