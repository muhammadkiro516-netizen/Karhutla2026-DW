import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl bg-white dark:bg-slate-800/70 backdrop-blur-sm
        shadow-lg shadow-slate-200/60 dark:shadow-black/30
        border border-slate-100 dark:border-slate-700/50 p-5 ${className}`}
    >
      {children}
    </div>
  );
}
