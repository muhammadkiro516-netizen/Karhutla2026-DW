import { type ReactNode, Suspense } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

// AppShell has the floating nav (60px) + city chips strip (~48px) = 108px
// All tab pages use useSearchParams (via useCity) — need Suspense.
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      {/* pt-[108px]: 60px floating nav + 48px city chips */}
      <div className="pt-[108px]">
        <Suspense fallback={
          <div className="px-4 pt-4 flex flex-col gap-4 min-h-screen">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        }>
          {children}
        </Suspense>
      </div>
    </AppShell>
  );
}
