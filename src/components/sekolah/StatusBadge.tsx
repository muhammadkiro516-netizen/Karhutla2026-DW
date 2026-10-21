import type { SchoolStatus } from "@/types/domain";

const COLORS: Record<string, string> = {
  NORMAL: "#16A34A",
  WASPADA: "#EAB308",
  HYBRID: "#F97316",
  DARING_DARURAT: "#DC2626",
};

interface StatusBadgeProps {
  status: SchoolStatus;
  vulnerable?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, vulnerable, size = "md" }: StatusBadgeProps) {
  const color = COLORS[status.code] ?? "#6b7280";
  const sizeClass =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
      ? "text-base px-4 py-1.5"
      : "text-sm px-3 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold text-white ${sizeClass}`}
      style={{ backgroundColor: color }}
    >
      {status.label}
      {vulnerable && (
        <span title="Mode Rentan aktif" className="text-xs opacity-80">
          ⚠
        </span>
      )}
    </span>
  );
}
