"use client";
import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wind, School, Flame, Tent } from "lucide-react";
import { id } from "@/i18n/id";

const tabs = [
  { href: "/udara", label: id.nav.udara, Icon: Wind },
  { href: "/sekolah", label: id.nav.sekolah, Icon: School },
  { href: "/titik-api", label: id.nav.titikApi, Icon: Flame },
  { href: "/posko", label: id.nav.posko, Icon: Tent },
];

function SideRailInner() {
  const pathname = usePathname();
  return (
    <nav className="hidden lg:flex flex-col gap-1 w-16 pt-4 border-r border-white/30 dark:border-slate-700/40 glass flex-shrink-0">
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={`flex flex-col items-center py-3 gap-1 text-xs rounded-2xl mx-1 transition-all min-h-[56px] justify-center ${active ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" : "text-slate-400 hover:bg-white/40 dark:hover:bg-slate-700/40"}`}>
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
    <Suspense fallback={<div className="hidden lg:block w-16 border-r border-white/30 dark:border-slate-700/40 glass flex-shrink-0" />}>
      <SideRailInner />
    </Suspense>
  );
}
