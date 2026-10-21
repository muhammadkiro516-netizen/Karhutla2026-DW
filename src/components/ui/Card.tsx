import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[--radius-card] bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md shadow p-4 ${className}`}
    >
      {children}
    </div>
  );
}
