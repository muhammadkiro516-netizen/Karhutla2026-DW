import { type ReactNode } from "react";
interface ChipProps { children: ReactNode; active?: boolean; onClick?: () => void; className?: string }
export function Chip({ children, active, onClick, className = "" }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
        ${active
          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
        } ${className}`}
    >
      {children}
    </button>
  );
}
