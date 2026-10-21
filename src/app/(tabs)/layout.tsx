import { type ReactNode, Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

// All tab pages use useSearchParams (via useCity) — they need a Suspense boundary.
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={
      <div className="p-4 flex flex-col gap-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    }>
      {children}
    </Suspense>
  );
}
