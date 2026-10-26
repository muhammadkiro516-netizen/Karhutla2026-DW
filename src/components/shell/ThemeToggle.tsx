"use client";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";

// Read theme synchronously so initial render matches the DOM (set by the
// no-flash script in layout.tsx) — avoids sun↔moon flicker on load.
function getInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  return document.documentElement.getAttribute("data-theme") === "dark";
}

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(getInitialDark);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("eduair-theme", next ? "dark" : "light"); } catch { /* ignore */ }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle tema"
      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
