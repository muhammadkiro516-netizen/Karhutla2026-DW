"use client";
import useSWR from "swr";
import type { WeatherCity } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";

const STORAGE_KEY = "eduair-weather-cache";
const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useWeather() {
  const { data, error, isLoading, mutate } = useSWR<ApiEnvelope<WeatherCity[]>>(
    "/api/weather",
    fetcher,
    {
      refreshInterval: 10 * 60 * 1000,
      revalidateOnFocus: true,
      keepPreviousData: true,
      fallbackData: typeof window !== "undefined"
        ? (() => {
            try {
              const s = localStorage.getItem(STORAGE_KEY);
              return s ? (JSON.parse(s) as ApiEnvelope<WeatherCity[]>) : undefined;
            } catch { return undefined; }
          })()
        : undefined,
      onSuccess(d) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch { /* ignore */ }
      },
    }
  );
  return { data: data?.data, envelope: data, isLoading, error, retry: () => mutate() };
}
