import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents and partialPrefetching removed — incompatible with
  // `export const revalidate` in route handlers (Next.js 16.x regression).
  // Cache is managed via Cache-Control headers + in-memory server cache.
};

export default nextConfig;
