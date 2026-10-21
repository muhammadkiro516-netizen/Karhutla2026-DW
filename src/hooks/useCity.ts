"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CITIES, DEFAULT_CITY, getCity } from "@/config/cities";
import type { CityId, City } from "@/config/cities";
import { nearest } from "@/lib/geo";

export function useCity(): {
  city: City;
  setCity: (id: CityId) => void;
  detectLocation: () => void;
} {
  const router = useRouter();
  const params = useSearchParams();
  const [cityId, setCityId] = useState<CityId>(DEFAULT_CITY);

  useEffect(() => {
    const q = params.get("kota") as CityId | null;
    if (q && getCity(q)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCityId(q);
      return;
    }
    try {
      const stored = localStorage.getItem("eduair-city") as CityId | null;
      if (stored && getCity(stored)) {
        setCityId(stored);
        return;
      }
    } catch {
      // ignore storage errors
    }
    setCityId(DEFAULT_CITY);
  }, [params]);

  const setCity = (id: CityId) => {
    setCityId(id);
    try {
      localStorage.setItem("eduair-city", id);
    } catch {
      // ignore storage errors
    }
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
