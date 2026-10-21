"use client";
import { SWRConfig } from "swr";
import type { ReactNode } from "react";

const KEYS = [
  "eduair-air-cache",
  "eduair-weather-cache",
  "eduair-hotspots-cache",
];
const API_MAP: Record<string, string> = {
  "eduair-air-cache": "/api/air",
  "eduair-weather-cache": "/api/weather",
  "eduair-hotspots-cache": "/api/hotspots",
};

function readLocalCache(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  const out: Record<string, unknown> = {};
  for (const key of KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) out[API_MAP[key]] = JSON.parse(raw);
    } catch { /* ignore */ }
  }
  return out;
}

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={{ fallback: readLocalCache() }}>
      {children}
    </SWRConfig>
  );
}
