"use client";
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

export function SideRail() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex flex-col gap-1 w-16 pt-4 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center py-3 gap-1 text-xs rounded-lg mx-1 transition-colors ${
              active
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
