import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tailwind v4 is handled via PostCSS (@tailwindcss/postcss in postcss.config.mjs).
  // No turbopack-specific CSS config needed — Next.js 16 auto-detects PostCSS.
};

export default nextConfig;
