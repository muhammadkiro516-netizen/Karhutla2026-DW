import { ISPU_META } from "@/lib/ispu";
import type { IspuCategory, SchoolStatus } from "@/types/domain";

export interface Advice { headline: string; school: string; outdoor: string; mask: string }

const BASE: Record<IspuCategory, Omit<Advice, "headline">> = {
  BAIK: { school: "Sekolah tatap muka seperti biasa.", outdoor: "Aman beraktivitas di luar.", mask: "Masker tidak wajib." },
  SEDANG: { school: "Sekolah tatap muka seperti biasa.", outdoor: "Kelompok sensitif kurangi aktivitas berat di luar.", mask: "Masker untuk kelompok sensitif." },
  TIDAK_SEHAT: { school: "Batasi olahraga & upacara luar ruang.", outdoor: "Kurangi aktivitas luar, tutup jendela.", mask: "Pakai masker; N95/KN95 bila lama di luar." },
  SANGAT_TIDAK_SEHAT: { school: "Disarankan pembelajaran daring/hybrid.", outdoor: "Hindari aktivitas luar ruang.", mask: "Wajib N95/KN95 di luar ruangan." },
  BERBAHAYA: { school: "Sekolah daring. Tetap di dalam ruangan.", outdoor: "Jangan keluar kecuali darurat.", mask: "Wajib N95/KN95; cari ruang udara bersih." },
};

export function adviceFor(category: IspuCategory, vulnerable = false): Advice {
  const b = BASE[category];
  const extra = vulnerable && category !== "BAIK" ? " Kelompok rentan: lebih waspada, siapkan obat/inhaler." : "";
  return { headline: `${ISPU_META[category].label}. ${b.school}${extra}`, ...b };
}

/** Formal announcement text for the school tab (copy / WhatsApp / print). */
export function buildAnnouncement(p: { school: string; city: string; ispu: number; status: SchoolStatus; timeLabel: string; dateLabel: string }): string {
  return [
    `PENGUMUMAN ${p.school.toUpperCase()}`,
    `Berdasarkan pemantauan kualitas udara ${p.city} pada ${p.dateLabel} pukul ${p.timeLabel}, ISPU (PM2.5) tercatat ${p.ispu}.`,
    `Status kegiatan belajar: ${p.status.label.toUpperCase()}.`,
    `Dasar: ${p.status.reason}`,
    "Orang tua dimohon memastikan anak memakai masker yang layak dan membatasi aktivitas luar ruang.",
    "Sumber data: Open-Meteo (model CAMS) & NASA FIRMS, diolah EduAir. Bukan pengganti informasi resmi BMKG/BNPB.",
  ].join("\n");
}

export const waShareUrl = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;
