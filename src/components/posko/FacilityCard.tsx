import { Card } from "@/components/ui/Card";
import { DemoChip } from "@/components/ui/DemoChip";
import type { Facility } from "@/types/api";

const TYPE_LABEL: Record<Facility["type"], string> = {
  RS: "Rumah Sakit",
  PUSKESMAS_KLINIK: "Puskesmas/Klinik",
  APOTEK: "Apotek",
  POSKO: "Posko",
};
const TYPE_ICON: Record<Facility["type"], string> = {
  RS: "🏥",
  PUSKESMAS_KLINIK: "🏨",
  APOTEK: "💊",
  POSKO: "⛺",
};

interface FacilityCardProps { facility: Facility }

export function FacilityCard({ facility: f }: FacilityCardProps) {
  const mapsUrl = `https://www.google.com/maps?q=${f.lat},${f.lon}`;
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span>{TYPE_ICON[f.type]}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{TYPE_LABEL[f.type]}</span>
            {f.seeded && <DemoChip />}
          </div>
          <p className="text-sm font-semibold mt-0.5 truncate">{f.name}</p>
          {f.address && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{f.address}</p>
          )}
        </div>
        <span className="text-xs text-zinc-400 flex-shrink-0">{f.distanceKm} km</span>
      </div>
      <div className="flex gap-2">
        {f.phone && (
          <a
            href={`tel:${f.phone}`}
            className="flex-1 text-center text-xs bg-zinc-100 dark:bg-zinc-800 rounded-lg py-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            📞 Hubungi
          </a>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs bg-zinc-100 dark:bg-zinc-800 rounded-lg py-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          🗺 Peta
        </a>
      </div>
      <p className="text-xs text-zinc-400 dark:text-zinc-500">Data: OpenStreetMap contributors (ODbL)</p>
    </Card>
  );
}
