"use client";
import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { STOCK_ITEMS } from "@/data/seed";
import type { StockLevel } from "@/data/seed";

interface StockEditSheetProps {
  open: boolean; onClose: () => void;
  facilityId: string; facilityName: string;
  currentStock: Record<string, StockLevel>;
  onSave: (facilityId: string, updates: Record<string, StockLevel>, passcode: string) => Promise<{ ok: boolean; error?: string }>;
}

const LEVELS: StockLevel[] = ["BANYAK", "MENIPIS", "HABIS"];
const LEVEL_STYLE: Record<StockLevel, string> = {
  BANYAK:  "bg-emerald-500 text-white",
  MENIPIS: "bg-amber-500 text-white",
  HABIS:   "bg-red-500 text-white",
};

export function StockEditSheet({ open, onClose, facilityId, facilityName, currentStock, onSave }: StockEditSheetProps) {
  const [draft, setDraft] = useState<Record<string, StockLevel>>(currentStock);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const result = await onSave(facilityId, draft, passcode);
    setSaving(false);
    if (result.ok) { onClose(); } else setError(result.error ?? "Gagal menyimpan.");
  };

  return (
    <Sheet open={open} onClose={onClose} title={`Stok — ${facilityName}`}>
      <div className="flex flex-col gap-4">
        {STOCK_ITEMS.map(item => (
          <div key={item} className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item}</span>
            <div className="flex gap-1.5">
              {LEVELS.map(l => (
                <button key={l} onClick={() => setDraft(d => ({ ...d, [item]: l }))}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                    draft[item] === l
                      ? LEVEL_STYLE[l]
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}>
                  {l.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wide font-medium">Passcode petugas</label>
          <input type="password" value={passcode} onChange={e => setPasscode(e.target.value)}
            className="border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm w-full bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Masukkan passcode" aria-label="Passcode petugas" />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button onClick={handleSave} disabled={saving}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-3 text-sm font-semibold disabled:opacity-50 transition-colors">
          {saving ? "Menyimpan…" : "Simpan Stok"}
        </button>
      </div>
    </Sheet>
  );
}
