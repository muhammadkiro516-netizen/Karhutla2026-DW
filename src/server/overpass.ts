import "server-only";
import { z } from "zod";
import type { Facility } from "@/types/api";

const OverpassElement = z.object({
  id: z.number(),
  type: z.enum(["node", "way", "relation"]),
  lat: z.number().optional(),
  lon: z.number().optional(),
  center: z.object({ lat: z.number(), lon: z.number() }).optional(),
  tags: z.record(z.string(), z.string()).optional(),
});

const OverpassResult = z.object({
  elements: z.array(OverpassElement),
});

function mapType(tags: Record<string, string>): Facility["type"] {
  const amenity = tags.amenity ?? "";
  const healthcare = tags.healthcare ?? "";
  const name = (tags.name ?? "").toLowerCase();
  if (amenity === "hospital") return "RS";
  if (amenity === "pharmacy") return "APOTEK";
  if (healthcare === "centre" || name.includes("puskesmas")) return "PUSKESMAS_KLINIK";
  if (amenity === "clinic" || amenity === "doctors") return "PUSKESMAS_KLINIK";
  return "PUSKESMAS_KLINIK";
}

export async function fetchFacilities(
  cityLat: number,
  cityLon: number
): Promise<Omit<Facility, "distanceKm" | "seeded">[]> {
  const query = `[out:json][timeout:25];(nwr["amenity"~"^(hospital|clinic|doctors|pharmacy)$"](around:15000,${cityLat},${cityLon}););out center tags 200;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);
  const json = await res.json();
  const parsed = OverpassResult.parse(json);
  return parsed.elements
    .filter(el => (el.lat && el.lon) || el.center)
    .map(el => {
      const lat = el.lat ?? el.center!.lat;
      const lon = el.lon ?? el.center!.lon;
      const tags: Record<string, string> = el.tags ?? {};
      const name: string = tags.name ?? "Fasilitas Kesehatan";
      const address: string | undefined = tags["addr:street"] ?? tags["addr:full"] ?? undefined;
      const phone: string | undefined = tags.phone ?? tags["contact:phone"] ?? undefined;
      return {
        id: String(el.id),
        type: mapType(tags),
        name,
        address,
        phone,
        lat,
        lon,
      };
    });
}
