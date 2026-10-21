"use client";
import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { STOCK_ITEMS } from "@/data/seed";
import type { StockLevel } from "@/data/seed";

interface StockEditSheetProps {
  open: boolean;
  onClose: () => void;
  facilityId: string;
  facilityName: string;
  currentStock: Record<string, StockLevel>;
  onSave: (
    facilityId: string,
    updates: Record<string, StockLevel>,
    passcode: string,
  ) => Promise<{ ok: boolean; error?: string }>;
}

const LEVELS: StockLevel[] = ["BANYAK", "MENIPIS", "HABIS"];

export function StockEditSheet({
  open,
  onClose,
  facilityId,
  facilityName,
  currentStock,
  onSave,
}: StockEditSheetProps) {
  const [draft, setDraft] = useState<Record<string, StockLevel>>(currentStock);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const result = await onSave(facilityId, draft, passcode);
    setSaving(false);
    if (result.ok) { onClose(); }
    else setError(result.error ?? "Gagal menyimpan.");
  };

  return (
    <Sheet open={open} onClose={onClose} title={`Stok — ${facilityName}`}>
      <div className="flex flex-col gap-3">
        {STOCK_ITEMS.map(item => (
          <div key={item} className="flex items-center justify-between gap-3">
            <span className="text-sm">{item}</span>
            <div className="flex gap-1">
              {LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => setDraft(d => ({ ...d, [item]: l }))}
                  className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                    draft[item] === l
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent"
                      : "border-zinc-300 dark:border-zinc-600"
                  }`}
                >
                  {l.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Passcode petugas</label>
          <input
            type="password"
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full dark:bg-zinc-800 dark:border-zinc-700"
            placeholder="Masukkan passcode"
            aria-label="Passcode petugas"
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg py-2 text-sm font-semibold disabled:opacity-50"
        >
          {saving ? "Menyimpan…" : "Simpan Stok"}
        </button>
      </div>
    </Sheet>
  );
}
