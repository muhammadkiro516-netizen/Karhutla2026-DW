"use client";
import useSWR from "swr";
import type { Facility } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useFacilities(cityId: string) {
  const storageKey = `eduair-facilities-${cityId}`;
  const { data, error, isLoading, mutate } = useSWR<ApiEnvelope<Facility[]>>(
    `/api/facilities?kota=${cityId}`,
    fetcher,
    {
      refreshInterval: 60 * 60 * 1000,
      revalidateOnFocus: false,
      keepPreviousData: true,
      fallbackData: typeof window !== "undefined"
        ? (() => {
            try {
              const s = localStorage.getItem(storageKey);
              return s ? (JSON.parse(s) as ApiEnvelope<Facility[]>) : undefined;
            } catch { return undefined; }
          })()
        : undefined,
      onSuccess(d) {
        try { localStorage.setItem(storageKey, JSON.stringify(d)); } catch { /* ignore */ }
      },
    }
  );
  return { data: data?.data, envelope: data, isLoading, error, retry: () => mutate() };
}
