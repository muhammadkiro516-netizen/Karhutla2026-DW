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
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
        ${active
          ? "bg-blue-500 text-white shadow-md shadow-blue-400/30 scale-105"
          : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 hover:border-blue-200"
        } ${className}`}
    >
      {children}
    </button>
  );
}
