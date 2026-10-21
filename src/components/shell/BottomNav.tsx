"use client";
import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wind, School, Flame, Tent } from "lucide-react";
import { id } from "@/i18n/id";

const tabs = [
  { href: "/udara",     label: id.nav.udara,    Icon: Wind  },
  { href: "/sekolah",   label: id.nav.sekolah,  Icon: School },
  { href: "/titik-api", label: id.nav.titikApi, Icon: Flame },
  { href: "/posko",     label: id.nav.posko,    Icon: Tent  },
];

function BottomNavInner() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/70 dark:border-slate-700/50 shadow-lg lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-[11px] font-medium transition-all min-h-[44px] justify-center relative
              ${active ? "text-blue-500" : "text-slate-400 dark:text-slate-500 hover:text-slate-600"}`}>
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-blue-500" />
            )}
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  return (
    <Suspense fallback={
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex bg-white/90 dark:bg-slate-900/90 border-t border-slate-200/70 dark:border-slate-700/50 lg:hidden h-[56px]" />
    }>
      <BottomNavInner />
    </Suspense>
  );
}
