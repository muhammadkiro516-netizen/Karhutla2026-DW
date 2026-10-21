import { DemoChip } from "@/components/ui/DemoChip";
import { SourceTag } from "@/components/ui/SourceTag";
import type { HotspotPayload } from "@/types/api";
import type { ApiEnvelope } from "@/types/domain";

interface HotspotSummaryProps {
  payload: HotspotPayload | undefined;
  envelope: ApiEnvelope<HotspotPayload> | undefined;
}

export function HotspotSummary({ payload, envelope }: HotspotSummaryProps) {
  const total = payload?.clusters.length ?? 0;
  const highConf = payload?.clusters.filter(c => c.confidence === "TINGGI").length ?? 0;
  const fetchedAt = envelope?.fetchedAt;
  const timeStr = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{total}</p>
        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">klaster titik api</p>
          <p className="text-xs text-zinc-500">{highConf} konfiden tinggi</p>
        </div>
        {envelope?.demo && <DemoChip />}
      </div>
      {envelope?.demo && (
        <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded px-2 py-1">
          Contoh, bukan live — tambahkan FIRMS_MAP_KEY di .env.local untuk data nyata.
        </p>
      )}
      <SourceTag source={envelope?.source ?? "FIRMS VIIRS NRT"} time={timeStr} tz="UTC" />
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
        Klaster ~2,2 km menggabungkan deteksi duplikat dari 3 satelit VIIRS. Titik panas ≠ kebakaran terkonfirmasi.
      </p>
    </div>
  );
}
