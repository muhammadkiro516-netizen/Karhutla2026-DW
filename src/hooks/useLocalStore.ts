"use client";
import { useState } from "react";

// Read from localStorage immediately at call-time (synchronous).
// Avoids the two-render flash (SSR default → stored value) caused by useEffect.
// Safe: useState initialiser only runs once on mount.
function readStorage<T>(key: string, initial: T): T {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return initial;
}

export function useLocalStore<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => readStorage(key, initial));

  const set = (v: T) => {
    setValue(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
  };

  return [value, set];
}
