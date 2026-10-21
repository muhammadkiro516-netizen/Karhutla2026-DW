"use client";
import { useLocalStore } from "./useLocalStore";

export function useModes() {
  const [vulnerable, setVulnerable] = useLocalStore("eduair-vulnerable", false);
  const [lowData, setLowData] = useLocalStore("eduair-lowdata", false);
  return { vulnerable, setVulnerable, lowData, setLowData };
}
