"use client";
import useSWR from "swr";
import type { HotspotPayload } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";

const STORAGE_KEY = "eduair-hotspots-cache";
const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useHotspots() {
  const { data, error, isLoading, mutate } = useSWR<ApiEnvelope<HotspotPayload>>(
    "/api/hotspots",
    fetcher,
    {
      refreshInterval: 15 * 60 * 1000,
      revalidateOnFocus: true,
      keepPreviousData: true,
      fallbackData: typeof window !== "undefined"
        ? (() => {
            try {
              const s = localStorage.getItem(STORAGE_KEY);
              return s ? (JSON.parse(s) as ApiEnvelope<HotspotPayload>) : undefined;
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
