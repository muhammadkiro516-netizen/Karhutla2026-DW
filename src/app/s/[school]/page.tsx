import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SCHOOLS } from "@/data/seed";
import { getCity } from "@/config/cities";
import { evaluateSchoolStatus } from "@/lib/school-status";
import type { AirCity } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";

interface Props {
  params: Promise<{ school: string }>;
}

async function fetchAirForCity(cityId: string): Promise<AirCity | null> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/air`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const envelope = (await res.json()) as ApiEnvelope<AirCity[]>;
    return envelope.data.find((c) => c.cityId === cityId) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { school: slug } = await params;
  const school = SCHOOLS.find((s) => s.slug === slug);
  if (!school) return { title: "Sekolah tidak ditemukan" };
  const air = await fetchAirForCity(school.cityId);
  const ispuSeries = (air?.hourly ?? [])
    .filter((h) => !h.forecast)
    .map((h) => h.ispu);
  const isVulnerable = school.level === "PAUD" || school.level === "SLB";
  const status = evaluateSchoolStatus(ispuSeries, isVulnerable);
  return {
    title: `Status ${school.name}: ${status.label}`,
    description: `${status.label} — ${status.reason}`,
    openGraph: {
      title: `Status ${school.name}: ${status.label}`,
      description: status.reason,
    },
  };
}

export default async function SchoolPublicPage({ params }: Props) {
  const { school: slug } = await params;
  const school = SCHOOLS.find((s) => s.slug === slug);
  if (!school) notFound();

  const city = getCity(school.cityId);
  const air = await fetchAirForCity(school.cityId);
  const ispuSeries = (air?.hourly ?? [])
    .filter((h) => !h.forecast)
    .map((h) => h.ispu);
  const isVulnerable = school.level === "PAUD" || school.level === "SLB";
  const status = evaluateSchoolStatus(ispuSeries, isVulnerable);

  const COLOR: Record<string, string> = {
    NORMAL: "#16A34A",
    WASPADA: "#EAB308",
    HYBRID: "#F97316",
    DARING_DARURAT: "#DC2626",
  };
  const bgColor = COLOR[status.code] ?? "#6b7280";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: bgColor }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center border border-slate-100 dark:border-slate-700">
        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
          Status Sekolah
        </p>
        <h1 className="text-lg font-bold mb-3">{school.name}</h1>
        <div
          className="inline-block text-white text-2xl font-bold px-6 py-3 rounded-xl mb-3"
          style={{ backgroundColor: bgColor }}
        >
          {status.label}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          {status.reason}
        </p>
        {city && (
          <p className="text-xs text-slate-400">
            {city.name} • ISPU diperbarui {air?.updatedLocal ?? "—"}
          </p>
        )}
        <p className="text-xs text-slate-400 mt-2">
          Rekomendasi mesin — status resmi dari Kepala Sekolah/Dinas. Bukan
          pengganti BMKG/BNPB.
        </p>
        <Link href="/" className="mt-4 block text-sm text-zinc-500 underline">
          Buka EduAir lengkap →
        </Link>
      </div>
    </div>
  );
}
