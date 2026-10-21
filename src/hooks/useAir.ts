"use client";
import useSWR from "swr";
import type { AirCity } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";

const STORAGE_KEY = "eduair-air-cache";
const fetcher = (url: string) => fetch(url).then(r => r.json() as Promise<ApiEnvelope<AirCity[]>>);

export function useAir() {
  const { data, error, isLoading, mutate } = useSWR<ApiEnvelope<AirCity[]>>(
    "/api/air",
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
