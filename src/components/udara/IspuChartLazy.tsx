"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";
import { useModes } from "@/hooks/useModes";
import type { AirHourly } from "@/types/api";

const IspuChartInner = dynamic(
  () => import("./IspuChart").then((m) => ({ default: m.IspuChart })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-52 w-full" />,
  },
);

interface IspuChartLazyProps {
  hourly: AirHourly[];
  tzLabel: string;
}

export function IspuChartLazy({ hourly, tzLabel }: IspuChartLazyProps) {
  const { lowData } = useModes();

  if (lowData) {
    const latest = [...hourly].reverse().find((h) => h.ispu != null);
    return (
      <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-3 text-sm text-zinc-600 dark:text-zinc-300">
        <p className="font-medium">Mode Hemat Data aktif — grafik disembunyikan.</p>
        {latest && (
          <p className="mt-1">
            ISPU terakhir tercatat: {latest.ispu} ({latest.time.slice(11, 16)} {tzLabel})
          </p>
        )}
      </div>
    );
  }

  return <IspuChartInner hourly={hourly} tzLabel={tzLabel} />;
}
