import { type ReactNode, Suspense } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

// All tab pages use useSearchParams (via useCity) — they need a Suspense boundary.
// AppShell lives here so the landing page (/) doesn't get the nav chrome.
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="p-4 flex flex-col gap-4 bg-gradient-to-b from-sky-100 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 min-h-screen">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      }>
        {children}
      </Suspense>
    </AppShell>
  );
}
