import type { IspuResult, SchoolStatus, HotspotCluster, DriftImpact, WindHour } from "@/types/domain";

export interface AirHourly {
  time: string;          // ISO local "YYYY-MM-DDTHH:mm"
  pm25: number | null;
  ispu: number | null;
  usAqi: number | null;
  forecast: boolean;
}

export interface TomorrowForecast {
  date: string;
  status: SchoolStatus;
  peakIspu: number | null;
  window: string;
}

export interface AirCity {
  cityId: string;
  tzLabel: string;
  updatedLocal: string;
  pm25: number | null;
  pm10: number | null;
  usAqi: number | null;
  ispuNow: IspuResult | null;
  ispu24h: IspuResult | null;
  hourly: AirHourly[];
  status: SchoolStatus;
  statusVulnerable: SchoolStatus;
  tomorrow: TomorrowForecast | null;
}

export interface WeatherCity {
  cityId: string;
  temp: number | null;
  rh: number | null;
  windKmh: number | null;
  windFromDeg: number | null;
  hourlyWind: { time: string; windKmh: number; windFromDeg: number }[];
}

export interface RichCluster extends HotspotCluster {
  nearestCityId: string;
  nearestKm: number;
  regionId: string | null;
  drift: DriftImpact[];
  windNow?: WindHour;
}

export interface HotspotPayload {
  clusters: RichCluster[];
  threat: { cityId: string; clusters: number; earliestEtaHours: number | null }[];
  latestUtc: string | null;
  sourcesOk: string[];
}

export interface Facility {
  id: string;
  type: "RS" | "PUSKESMAS_KLINIK" | "APOTEK" | "POSKO";
  name: string;
  address?: string;
  phone?: string;
  lat: number;
  lon: number;
  distanceKm: number;
  seeded: boolean;
}
