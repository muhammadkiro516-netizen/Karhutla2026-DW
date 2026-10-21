"use client";
import useSWR from "swr";
import type { WeatherCity } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";

const STORAGE_KEY = "eduair-weather-cache";
const fetcher = (url: string) => fetch(url).then(r => r.json() as Promise<ApiEnvelope<WeatherCity[]>>);

export function useWeather() {
  const { data, error, isLoading, mutate } = useSWR<ApiEnvelope<WeatherCity[]>>(
    "/api/weather",
    fetcher,
    {
      refreshInterval: 10 * 60 * 1000,
      revalidateOnFocus: false,
      keepPreviousData: true,
      onSuccess(d) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch { /* ignore */ }
      },
    },
  );
  return { data: data?.data, envelope: data, isLoading, error, retry: () => mutate() };
}
