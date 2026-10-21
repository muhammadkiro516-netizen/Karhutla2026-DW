"use client";
import { Chip } from "@/components/ui/Chip";
import type { Facility } from "@/types/api";

type FacilityType = Facility["type"] | "SEMUA";

interface FacilityFiltersProps {
  active: FacilityType;
  onChange: (t: FacilityType) => void;
}

const TYPES: { key: FacilityType; label: string }[] = [
  { key: "SEMUA", label: "Semua" },
  { key: "RS", label: "RS" },
  { key: "PUSKESMAS_KLINIK", label: "Puskesmas/Klinik" },
  { key: "APOTEK", label: "Apotek" },
  { key: "POSKO", label: "Posko" },
];

export function FacilityFilters({ active, onChange }: FacilityFiltersProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {TYPES.map(t => (
        <Chip key={t.key} active={active === t.key} onClick={() => onChange(t.key)}>
          {t.label}
        </Chip>
      ))}
    </div>
  );
}
