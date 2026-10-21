import { type ReactNode } from "react";
interface CardProps { children: ReactNode; className?: string }
export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-3xl bg-white shadow-sm border border-slate-100 p-5 ${className}`}>
      {children}
    </div>
  );
}
