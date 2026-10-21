"use client";
import { type ReactNode, useState } from "react";
import { FloatingNav } from "./FloatingNav";
import { CityChips } from "./CityChips";
import { ModeBanner } from "./ModeBanner";
import { Sheet } from "@/components/ui/Sheet";
import { useModes } from "@/hooks/useModes";

export function AppShell({ children }: { children: ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { vulnerable, setVulnerable, lowData, setLowData } = useModes();

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      {/* Floating top nav */}
      <FloatingNav onOpenSettings={() => setSettingsOpen(true)} />

      {/* City chips strip — fixed below nav */}
      <div className="sticky top-[60px] z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-3">
          <CityChips />
        </div>
      </div>

      <ModeBanner />

      {/* Main content — add top padding for both nav + chips */}
      <main className="pb-[calc(72px+env(safe-area-inset-bottom))] lg:pb-8">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <MobileTabBar />

      <Sheet open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Pengaturan">
        <div className="flex flex-col gap-4">
          <label className="flex items-center justify-between gap-4 text-sm">
            <div>
              <p className="font-medium">Mode Rentan</p>
              <p className="text-xs text-slate-400">Aktifkan untuk anak kecil, lansia, penderita asma, ibu hamil</p>
            </div>
            <input type="checkbox" checked={vulnerable} onChange={e => setVulnerable(e.target.checked)}
              className="w-5 h-5 rounded accent-blue-500 flex-shrink-0" />
          </label>
          <label className="flex items-center justify-between gap-4 text-sm">
            <div>
              <p className="font-medium">Hemat Data</p>
              <p className="text-xs text-slate-400">Sembunyikan grafik, pakai teks saja</p>
            </div>
            <input type="checkbox" checked={lowData} onChange={e => setLowData(e.target.checked)}
              className="w-5 h-5 rounded accent-blue-500 flex-shrink-0" />
          </label>
          <a href="/about" className="text-sm text-blue-600 border-t border-slate-100 pt-3">
            Tentang PyroAlert &rarr;
          </a>
        </div>
      </Sheet>
    </div>
  );
}

// Mobile bottom tab bar
import { BottomNav } from "./BottomNav";
function MobileTabBar() { return <BottomNav />; }
