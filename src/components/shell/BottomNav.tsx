"use client";
import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wind, School, Flame, Tent } from "lucide-react";

const TABS = [
  { href: "/udara",     label: "Udara",    Icon: Wind  },
  { href: "/sekolah",   label: "Sekolah",  Icon: School },
  { href: "/titik-api", label: "Titik Api",Icon: Flame },
  { href: "/posko",     label: "Posko",    Icon: Tent  },
];

function Inner() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[11px] font-medium transition-colors min-h-[52px] justify-center relative ${
              active ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
            }`}>
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-slate-900" />
            )}
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  return (
    <Suspense fallback={<nav className="fixed bottom-0 left-0 right-0 h-[52px] bg-white border-t border-slate-100 lg:hidden z-40" />}>
      <Inner />
    </Suspense>
  );
}
