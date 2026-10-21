import type { SchoolStatus } from "@/types/domain";

const ADVICE: Record<string, string> = {
  NORMAL: "Udara aman. Aktivitas luar ruangan normal.",
  WASPADA: "Batasi aktivitas luar ruangan. Gunakan masker jika perlu.",
  HYBRID: "Hindari aktivitas berat di luar. Anak-anak dan lansia tetap di dalam.",
  DARING_DARURAT:
    "Tetap di dalam ruangan. Tutup ventilasi. Aktifkan purifier jika ada.",
};

interface TodayAdviceProps {
  status: SchoolStatus | undefined;
  vulnerable: boolean;
}

export function TodayAdvice({ status, vulnerable }: TodayAdviceProps) {
  if (!status) return null;

  const base =
    ADVICE[status.code] ?? "Pantau terus perkembangan kualitas udara.";
  const extra =
    vulnerable && status.level > 0
      ? " (Mode Rentan: waspada ekstra untuk penderita asma, balita, lansia, dan ibu hamil.)"
      : "";

  return (
    <p className="text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
      {base}
      {extra}
    </p>
  );
}
