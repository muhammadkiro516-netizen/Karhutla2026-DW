import { type ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ children, active, onClick, className = "" }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all
        ${active
          ? "bg-blue-500 text-white shadow-md shadow-blue-500/25"
          : "bg-white/70 dark:bg-slate-700/50 text-slate-600 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600/50 border border-white/40 dark:border-slate-600/40"}
        ${className}`}
    >
      {children}
    </button>
  );
}
