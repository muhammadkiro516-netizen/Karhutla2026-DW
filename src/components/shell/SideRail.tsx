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

function SideRailInner() {
  const pathname = usePathname();
  return (
    <nav className="hidden lg:flex flex-col gap-1 w-[72px] pt-4 pb-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200/70 dark:border-slate-700/50 flex-shrink-0">
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href}
            className={`flex flex-col items-center py-3 gap-1 text-[11px] rounded-2xl mx-1.5 transition-all min-h-[56px] justify-center font-medium
              ${active
                ? "bg-blue-500 text-white shadow-lg shadow-blue-400/40"
                : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300"}`}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SideRail() {
  return (
    <Suspense fallback={<div className="hidden lg:block w-[72px] bg-white/80 dark:bg-slate-900/80 border-r border-slate-200/70 dark:border-slate-700/50 flex-shrink-0" />}>
      <SideRailInner />
    </Suspense>
  );
}
