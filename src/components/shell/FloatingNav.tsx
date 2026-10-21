"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wind, School, Flame, Tent, Settings } from "lucide-react";

const TABS = [
  { href: "/udara",     label: "Udara",    Icon: Wind  },
  { href: "/sekolah",   label: "Sekolah",  Icon: School },
  { href: "/titik-api", label: "Titik Api",Icon: Flame },
  { href: "/posko",     label: "Posko",    Icon: Tent  },
];

interface FloatingNavProps { onOpenSettings: () => void }

function NavInner({ onOpenSettings }: FloatingNavProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
          : "bg-white"
      }`}
    >
      <div className="max-w-5xl mx-auto flex items-center gap-1 px-3 h-[60px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-4 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Flame size={14} className="text-white" />
          </div>
          <span className="font-black text-slate-800 text-base tracking-tight hidden sm:block">EduAir</span>
        </Link>

        {/* Tab links — desktop */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {TABS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}>
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 lg:flex-none" />

        <button onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Pengaturan">
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
}

export function FloatingNav({ onOpenSettings }: FloatingNavProps) {
  return (
    <Suspense fallback={<div className="fixed top-0 left-0 right-0 h-[60px] bg-white z-40 shadow-sm" />}>
      <NavInner onOpenSettings={onOpenSettings} />
    </Suspense>
  );
}
