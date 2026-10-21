"use client";
import { REGIONS } from "@/config/cities";
import { Chip } from "@/components/ui/Chip";

interface RegionChipsProps {
  active: string | null;
  onChange: (id: string | null) => void;
}

export function RegionChips({ active, onChange }: RegionChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Chip active={active === null} onClick={() => onChange(null)}>Semua</Chip>
      {REGIONS.map(r => (
        <Chip key={r.id} active={active === r.id} onClick={() => onChange(active === r.id ? null : r.id)}>
          {r.name}
        </Chip>
      ))}
    </div>
  );
}
