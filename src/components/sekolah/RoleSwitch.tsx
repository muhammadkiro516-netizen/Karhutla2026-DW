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
      setIsAdmin(true);
      setShowInput(false);
      setInput("");
      setError("");
    } else {
      setError("PIN salah.");
    }
  };

  if (isAdmin) {
    return (
      <button
        onClick={() => setIsAdmin(false)}
        className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg"
      >
        <Shield size={14} />
        <span>Kepala Sekolah/Dinas</span>
        <span className="text-xs opacity-60">(keluar)</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          <ShieldOff size={14} />
          <span>Masuk sebagai Kepala Sekolah/Dinas</span>
        </button>
      ) : (
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && activate()}
            placeholder="PIN demo"
            className="border rounded px-2 py-1 text-sm w-24 dark:bg-zinc-800 dark:border-zinc-700"
            aria-label="Masukkan PIN"
          />
          <button
            onClick={activate}
            className="text-sm bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-3 py-1 rounded"
          >
            Masuk
          </button>
          <button
            onClick={() => {
              setShowInput(false);
              setError("");
            }}
            className="text-sm text-zinc-400"
          >
            Batal
          </button>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}
      <p className="text-xs text-zinc-400">
        PIN demo; produksi memakai login Supabase.
      </p>
    </div>
  );
}
