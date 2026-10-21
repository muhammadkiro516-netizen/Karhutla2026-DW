import { NextResponse } from "next/server";
import { z } from "zod";
import { CITIES, getCity } from "@/config/cities";
import { CACHE_SECONDS } from "@/config/thresholds";
import { cached } from "@/server/cache";
import { fetchFacilities } from "@/server/overpass";
import { SEED_HOSPITALS } from "@/data/seed";
import type { Facility } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";


const QuerySchema = z.object({ kota: z.string().optional() });

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lon - a.lon) * Math.PI / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(s));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const { kota } = QuerySchema.parse({ kota: searchParams.get("kota") ?? undefined });
  const cityId = kota ?? CITIES[0].id;
  const city = getCity(cityId);
  if (!city) return NextResponse.json({ error: "Kota tidak dikenal." }, { status: 400 });

  const fetchedAt = new Date().toISOString();
  try {
    const { value: live, stale } = await cached(
      `facilities-${cityId}`,
      CACHE_SECONDS.facilities,
      () => fetchFacilities(city.lat, city.lon)
    );

    // Seed hospitals within 30 km of the city
    const seeds = SEED_HOSPITALS
      .filter(h => haversineKm({ lat: h.lat, lon: h.lon }, city) <= 30)
      .map(h => ({
        ...h,
        distanceKm: Math.round(haversineKm({ lat: h.lat, lon: h.lon }, city) * 10) / 10,
      }));

    // Merge live + seed, dedupe by name or proximity
    const merged: Facility[] = live.map(f => ({
      ...f,
      distanceKm: Math.round(haversineKm({ lat: f.lat, lon: f.lon }, city) * 10) / 10,
      seeded: false,
    }));

    for (const seed of seeds) {
      const dupe = merged.find(
        f =>
          f.name.toLowerCase() === seed.name.toLowerCase() ||
          haversineKm({ lat: f.lat, lon: f.lon }, { lat: seed.lat, lon: seed.lon }) < 0.2
      );
      if (!dupe) merged.push(seed);
    }

    merged.sort((a, b) => a.distanceKm - b.distanceKm);

    const envelope: ApiEnvelope<Facility[]> = {
      data: merged,
      source: "OpenStreetMap Overpass",
      fetchedAt,
      stale,
    };

    return NextResponse.json(envelope, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS.facilities}, stale-while-revalidate=${CACHE_SECONDS.facilities * 6}`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Gagal memuat fasilitas." }, { status: 502 });
  }
}
