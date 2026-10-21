import "server-only";

interface CacheEntry<T> { value: T; at: number }
const store = new Map<string, CacheEntry<unknown>>();

export interface CacheResult<T> { value: T; at: number; stale: boolean }

export async function cached<T>(
  key: string,
  ttlSec: number,
  fetcher: () => Promise<T>
): Promise<CacheResult<T>> {
  const now = Date.now();
  const entry = store.get(key) as CacheEntry<T> | undefined;

  if (entry && now - entry.at < ttlSec * 1000) {
    return { value: entry.value, at: entry.at, stale: false };
  }

  try {
    const value = await fetcher();
    store.set(key, { value, at: now });
    return { value, at: now, stale: false };
  } catch {
    if (entry) {
      return { value: entry.value, at: entry.at, stale: true };
    }
    throw new Error("No cached value and upstream failed");
  }
}
