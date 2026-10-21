"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wind, School, Flame, Tent, Settings, Sun, Moon } from "lucide-react";

const TABS = [
  { href: "/udara",     label: "Udara",     Icon: Wind   },
  { href: "/sekolah",   label: "Sekolah",   Icon: School  },
  { href: "/titik-api", label: "Titik Api", Icon: Flame   },
  { href: "/posko",     label: "Posko",     Icon: Tent    },
];

interface FloatingNavProps { onOpenSettings: () => void }

function NavInner({ onOpenSettings }: FloatingNavProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => {
    // Read synchronously — safe because this runs only on client after hydration
    if (typeof window === "undefined") return false;
    return document.documentElement.getAttribute("data-theme") === "dark";
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    try { localStorage.setItem("eduair-theme", next ? "dark" : "light"); } catch { /**/ }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.08)]"
          : "bg-white border-b border-slate-100"
      }`}
    >
      <div className="max-w-5xl mx-auto flex items-center gap-1 px-4 h-[60px]">
        {/* Logo */}
        <Link href="/"
          className="flex items-center gap-2 mr-4 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Flame size={15} className="text-white" />
          </div>
          <span className="font-black text-slate-900 text-base tracking-tight hidden sm:block">
            Edu<span className="text-orange-500">Air</span>
          </span>
        </Link>

        {/* Tab links — desktop only */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {TABS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}>
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 lg:flex-none" />

        {/* Dark mode toggle */}
        <button onClick={toggleDark}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label={dark ? "Mode terang" : "Mode gelap"}>
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Settings */}
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
    <Suspense fallback={
      <div className="fixed top-0 left-0 right-0 h-[60px] bg-white border-b border-slate-100 z-40" />
    }>
      <NavInner onOpenSettings={onOpenSettings} />
    </Suspense>
  );
}
