"use client";
import { useState } from "react";
import { useFacilities } from "@/hooks/useFacilities";
import { useCity } from "@/hooks/useCity";
import { useAir } from "@/hooks/useAir";
import { useLocalStore } from "@/hooks/useLocalStore";
import { FacilityFilters } from "@/components/posko/FacilityFilters";
import { FacilityCard } from "@/components/posko/FacilityCard";
import { StockChips } from "@/components/posko/StockChips";
import { StockEditSheet } from "@/components/posko/StockEditSheet";
import { ReportSheet } from "@/components/posko/ReportSheet";
import { RecentReports } from "@/components/posko/RecentReports";
import { EmergencyCard } from "@/components/posko/EmergencyCard";
import { SelfHelpCard } from "@/components/posko/SelfHelpCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { StaleBanner } from "@/components/ui/StaleBanner";
import { STOCK_ITEMS, demoStockLevel } from "@/data/seed";
import type { Facility } from "@/types/api";
import type { StockLevel } from "@/data/seed";

type FacilityFilter = Facility["type"] | "SEMUA";

interface ReportEntry {
  reportId: string;
  description: string;
  at: string;
  status: string;
}

export default function PoskoPage() {
  const { city } = useCity();
  const { data: facilities, envelope, isLoading, error, retry } = useFacilities(city.id);
  const { data: allAir } = useAir();
  const airCity = allAir?.find(a => a.cityId === city.id);
  const isUrgent = (airCity?.status.level ?? 0) >= 2;

  const [filter, setFilter] = useState<FacilityFilter>("SEMUA");
  const [editStock, setEditStock] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reports, setReports] = useLocalStore<ReportEntry[]>("eduair.reports", []);
  const [stockOverrides, setStockOverrides] = useLocalStore<Record<string, Record<string, StockLevel>>>(
    "eduair.stock",
    {},
  );

  const filtered =
    filter === "SEMUA" ? (facilities ?? []) : (facilities ?? []).filter(f => f.type === filter);

  const handleStockSave = async (
    facilityId: string,
    updates: Record<string, StockLevel>,
    passcode: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facilityId, updates, passcode }),
      });
      const json = await res.json() as { ok?: boolean; error?: string; demo?: boolean };
      if (!res.ok) return { ok: false, error: json.error ?? "Gagal." };
      setStockOverrides({ ...stockOverrides, [facilityId]: updates });
      return { ok: true };
    } catch {
      return { ok: false, error: "Gagal terhubung." };
    }
  };

  const handleReport = async (data: {
    description: string;
    evidenceHash: string;
    status: string;
    reportId: string;
  }) => {
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityId: city.id, ...data }),
      });
    } catch { /* silent */ }
    setReports([
      { reportId: data.reportId, description: data.description, at: new Date().toISOString(), status: data.status },
      ...reports,
    ]);
  };

  if (isLoading && !facilities) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (error && !facilities) {
    return <div className="p-4"><ErrorCard message="Gagal memuat fasilitas." onRetry={retry} /></div>;
  }

  const editFacility = editStock ? filtered.find(f => f.id === editStock) : null;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {envelope?.stale && (
        <div className="mb-4">
          <StaleBanner updatedAt="-" onRetry={retry} />
        </div>
      )}
      {isUrgent && (
        <div className="mb-4">
          <EmergencyCard />
        </div>
      )}
      <div className="lg:grid lg:grid-cols-[3fr_2fr] lg:gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <FacilityFilters active={filter} onChange={setFilter} />
            <button
              onClick={() => setReportOpen(true)}
              className="text-sm bg-orange-500 text-white rounded-xl px-4 py-2 hover:bg-orange-600 flex-shrink-0 font-medium shadow-sm shadow-orange-300/30"
            >
              + Laporan
            </button>
          </div>
          {filtered.map(f => {
            const stockMap: Record<string, StockLevel> =
              stockOverrides[f.id] ??
              Object.fromEntries(STOCK_ITEMS.map(item => [item, demoStockLevel(f.id, item)]));
            const stockArr = STOCK_ITEMS.map(item => ({
              item,
              level: stockMap[item] ?? ("BANYAK" as StockLevel),
            }));
            return (
              <div key={f.id} className="flex flex-col gap-2">
                <FacilityCard facility={f} />
                <StockChips stock={stockArr} facilityName={f.name} />
                <button
                  onClick={() => setEditStock(f.id)}
                  className="self-start text-xs text-blue-400 hover:text-blue-600 underline decoration-dotted"
                >
                  Update stok
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-4 mt-4 lg:mt-0">
          {!isUrgent && <EmergencyCard />}
          <SelfHelpCard />
          <RecentReports />
        </div>
      </div>

      {editFacility && (
        <StockEditSheet
          open={!!editStock}
          onClose={() => setEditStock(null)}
          facilityId={editFacility.id}
          facilityName={editFacility.name}
          currentStock={
            stockOverrides[editFacility.id] ??
            Object.fromEntries(STOCK_ITEMS.map(i => [i, demoStockLevel(editFacility.id, i)]))
          }
          onSave={handleStockSave}
        />
      )}
      <ReportSheet
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        cityId={city.id}
        cityCenter={{ lat: city.lat, lon: city.lon }}
        onSubmit={handleReport}
      />
    </div>
  );
}
