"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { CITIES, DEFAULT_CITY, getCity } from "@/config/cities";
import type { CityId, City } from "@/config/cities";
import { nearest } from "@/lib/geo";

// Read initial city synchronously (SSR-safe: returns DEFAULT_CITY on server)
function getInitialCity(): CityId {
  if (typeof window === "undefined") return DEFAULT_CITY;
  try {
    const stored = localStorage.getItem("eduair-city") as CityId | null;
    if (stored && getCity(stored)) return stored;
  } catch { /* ignore */ }
  return DEFAULT_CITY;
}

export function useCity(): {
  city: City;
  setCity: (id: CityId) => void;
  detectLocation: () => void;
} {
  const router = useRouter();
  const params = useSearchParams();
  // Initialise from localStorage immediately — avoids DEFAULT→stored flicker
  const [cityId, setCityId] = useState<CityId>(getInitialCity);
  const didInit = useRef(false);

  useEffect(() => {
    // Only run once per params change, not on every render
    const q = params.get("kota") as CityId | null;
    if (q && getCity(q)) {
      if (q !== cityId) setCityId(q);
      didInit.current = true;
      return;
    }
    if (!didInit.current) {
      // Already read from localStorage in useState initialiser
      didInit.current = true;
    }
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const setCity = (id: CityId) => {
    setCityId(id);
    try { localStorage.setItem("eduair-city", id); } catch { /* ignore */ }
    router.replace(`?kota=${id}`, { scroll: false });
  };

  const detectLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { item } = nearest(
          { lat: pos.coords.latitude, lon: pos.coords.longitude },
          CITIES,
        );
        setCity(item.id as CityId);
      },
      undefined,
      { timeout: 8000 },
    );
  };

  return {
    city: (getCity(cityId) ?? getCity(DEFAULT_CITY))!,
    setCity,
    detectLocation,
  };
}
