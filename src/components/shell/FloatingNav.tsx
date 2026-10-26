"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wind, School, Flame, Tent, Sun, Moon, Settings } from "lucide-react";

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
    if (typeof window === "undefined") return false;
    return document.documentElement.getAttribute("data-theme") === "dark";
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("eduair-theme", next ? "dark" : "light"); } catch { /**/ }
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      {/* Floating pill — pointer-events back on */}
      <nav
        className={`pointer-events-auto flex items-center gap-1 px-2 py-1.5 rounded-full border transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-slate-200/80 dark:border-slate-700/80"
            : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)] border-slate-200/60 dark:border-slate-700/60"
        }`}
      >
        {/* Logo */}
        <Link href="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors group mr-1">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Flame size={12} className="text-white" />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-black text-slate-900 dark:text-slate-100 text-sm tracking-tight">
              Pyro<span className="text-orange-500">Alert</span>
            </span>
            <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase leading-none">
              Karhutla &apos;26
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* Tab links */}
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                active
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100"
              }`}>
              <Icon size={13} />
              <span className="hidden sm:block">{label}</span>
            </Link>
          );
        })}

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* Controls */}
        <button onClick={toggleDark}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label={dark ? "Mode terang" : "Mode gelap"}>
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <button onClick={onOpenSettings}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Pengaturan">
          <Settings size={14} />
        </button>
      </nav>
    </div>
  );
}

export function FloatingNav({ onOpenSettings }: FloatingNavProps) {
  return (
    <Suspense fallback={
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-full h-10 w-80 shadow-lg border border-slate-200/60" />
      </div>
    }>
      <NavInner onOpenSettings={onOpenSettings} />
    </Suspense>
  );
}
