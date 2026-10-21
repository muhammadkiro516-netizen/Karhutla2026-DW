import type { SchoolStatus } from "@/types/domain";

const ADVICE: Record<string, { text: string; icon: string; bg: string }> = {
  NORMAL: { text: "Udara aman. Aktivitas luar ruangan normal.", icon: "✅", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200" },
  WASPADA: { text: "Batasi aktivitas luar ruangan. Gunakan masker jika perlu.", icon: "🌤️", bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-200" },
  HYBRID: { text: "Hindari aktivitas berat di luar. Anak-anak dan lansia tetap di dalam.", icon: "😷", bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-200" },
  DARING_DARURAT: { text: "Tetap di dalam ruangan. Tutup ventilasi. Aktifkan purifier jika ada.", icon: "🔴", bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200" },
};

interface TodayAdviceProps {
  status: SchoolStatus | undefined;
  vulnerable: boolean;
}

export function TodayAdvice({ status, vulnerable }: TodayAdviceProps) {
  if (!status) return null;
  const info = ADVICE[status.code] ?? { text: "Pantau terus perkembangan kualitas udara.", icon: "📊", bg: "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300" };

  return (
    <div className={`rounded-2xl border p-4 ${info.bg}`}>
      <p className="text-base font-medium leading-relaxed">
        {info.icon} {info.text}
        {vulnerable && status.level > 0 && (
          <span className="block text-sm mt-1 opacity-75">Mode Rentan aktif — waspada ekstra untuk penderita asma, balita, lansia, dan ibu hamil.</span>
        )}
      </p>
    </div>
  );
}
