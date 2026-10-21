import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[--radius-card] glass shadow-lg shadow-slate-200/40 dark:shadow-black/20 border border-white/40 dark:border-slate-700/40 p-4 ${className}`}
    >
      {children}
    </div>
  );
}
