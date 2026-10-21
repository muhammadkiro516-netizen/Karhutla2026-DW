import { type ReactNode } from "react";
interface ChipProps { children: ReactNode; active?: boolean; onClick?: () => void; className?: string }
export function Chip({ children, active, onClick, className = "" }: ChipProps) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
        ${active
          ? "bg-slate-900 text-white shadow-sm"
          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
        } ${className}`}>
      {children}
    </button>
  );
}
