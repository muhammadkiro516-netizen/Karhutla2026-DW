"use client";
import { useState } from "react";
import { useLocalStore } from "@/hooks/useLocalStore";
import { Shield, ShieldOff } from "lucide-react";

const DEMO_PIN = process.env.NEXT_PUBLIC_DEMO_PIN ?? "2026";

export function RoleSwitch() {
  const [isAdmin, setIsAdmin] = useLocalStore("eduair-role-admin", false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showInput, setShowInput] = useState(false);

  const activate = () => {
    if (input === DEMO_PIN) {
      setIsAdmin(true); setShowInput(false); setInput(""); setError("");
    } else { setError("PIN salah."); }
  };

  if (isAdmin) {
    return (
      <button onClick={() => setIsAdmin(false)}
        className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl border border-emerald-200 dark:border-emerald-800/40">
        <Shield size={14} />
        <span className="font-medium">Kepala Sekolah/Dinas</span>
        <span className="text-xs opacity-60">(keluar)</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {!showInput ? (
        <button onClick={() => setShowInput(true)}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors self-start">
          <ShieldOff size={14} />
          <span>Masuk sebagai Kepala Sekolah/Dinas</span>
        </button>
      ) : (
        <div className="flex items-center gap-2 flex-wrap">
          <input type="password" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && activate()}
            placeholder="PIN demo"
            className="border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-1.5 text-sm w-28 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Masukkan PIN" />
          <button onClick={activate}
            className="text-sm bg-blue-500 text-white px-4 py-1.5 rounded-xl hover:bg-blue-600 transition-colors">
            Masuk
          </button>
          <button onClick={() => { setShowInput(false); setError(""); }}
            className="text-sm text-slate-400 hover:text-slate-600">Batal</button>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}
      <p className="text-xs text-slate-400">PIN demo; produksi memakai login Supabase.</p>
    </div>
  );
}
