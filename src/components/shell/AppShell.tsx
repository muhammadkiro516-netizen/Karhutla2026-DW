"use client";
import { type ReactNode, useState } from "react";
import { SideRail } from "./SideRail";
import { BottomNav } from "./BottomNav";
import { CityChips } from "./CityChips";
import { ThemeToggle } from "./ThemeToggle";
import { ModeBanner } from "./ModeBanner";
import { Sheet } from "@/components/ui/Sheet";
import { useModes } from "@/hooks/useModes";
import { id } from "@/i18n/id";
import { Settings } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { vulnerable, setVulnerable, lowData, setLowData } = useModes();

  return (
    <div className="flex h-dvh overflow-hidden bg-gradient-to-b from-sky-100 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <SideRail />
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-700/50 z-20 shadow-sm">
          <div className="flex-1 overflow-hidden">
            <CityChips />
          </div>
          <ThemeToggle />
          <button
            onClick={() => setSettingsOpen(true)}
            aria-label="Pengaturan"
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <Settings size={18} />
          </button>
        </header>
        <ModeBanner />
        <main className="flex-1 overflow-y-auto pb-[calc(72px+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </main>
      </div>
      <BottomNav />
      <Sheet open={settingsOpen} onClose={() => setSettingsOpen(false)} title={id.ui.settingsTitle}>
        <div className="flex flex-col gap-4">
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>{id.modes.vulnerable}</span>
            <input type="checkbox" checked={vulnerable} onChange={e => setVulnerable(e.target.checked)} className="w-5 h-5 rounded accent-blue-500" />
          </label>
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>{id.modes.lowData}</span>
            <input type="checkbox" checked={lowData} onChange={e => setLowData(e.target.checked)} className="w-5 h-5 rounded accent-blue-500" />
          </label>
          <a href="/about" className="text-sm text-slate-500 hover:text-blue-600 border-t border-slate-100 dark:border-slate-700 pt-3 transition-colors">
            Tentang EduAir →
          </a>
        </div>
      </Sheet>
    </div>
  );
}
