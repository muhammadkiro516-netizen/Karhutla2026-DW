"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wind, School, Flame, Tent, Settings } from "lucide-react";

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

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center gap-1 px-2 py-1.5 rounded-full border transition-all duration-500 ease-out ${
          scrolled
            ? "bg-white/98 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.08)] border-slate-300/70 scale-[0.97]"
            : "bg-white/85 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border-slate-200/50 scale-100"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors group mr-1"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Flame size={12} className="text-white" />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-black text-slate-900 text-sm tracking-tight">
              Pyro<span className="text-orange-500">Alert</span>
            </span>
            <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase leading-none">
              Karhutla &apos;26
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Tab links */}
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Icon size={13} />
              <span className="hidden sm:block">{label}</span>
            </Link>
          );
        })}

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Pengaturan"
        >
          <Settings size={14} />
        </button>
      </nav>
    </div>
  );
}

export function FloatingNav({ onOpenSettings }: FloatingNavProps) {
  return (
    <Suspense
      fallback={
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
          <div className="bg-white/85 backdrop-blur-xl rounded-full h-10 w-80 shadow-lg border border-slate-200/50" />
        </div>
      }
    >
      <NavInner onOpenSettings={onOpenSettings} />
    </Suspense>
  );
}
