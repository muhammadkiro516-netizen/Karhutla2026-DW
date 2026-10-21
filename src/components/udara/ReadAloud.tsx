"use client";
import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { AirCity } from "@/types/api";

interface ReadAloudProps {
  city: AirCity | undefined;
  cityName: string;
}

function buildText(city: AirCity, cityName: string): string {
  const ispu = city.ispuNow?.value;
  const label = city.ispuNow?.label ?? "tidak tersedia";
  const status = city.status.label;
  return `Kualitas udara di ${cityName} saat ini ${label}. Nilai ISPU ${ispu ?? "tidak tersedia"}. Status sekolah: ${status}. ${city.status.reason}`;
}

export function ReadAloud({ city, cityName }: ReadAloudProps) {
  const [speaking, setSpeaking] = useState(false);

  if (!city) return null;

  const toggle = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(buildText(city, cityName));
    utterance.lang = "id-ID";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
      aria-label={speaking ? "Hentikan bacaan" : "Bacakan status udara"}
    >
      {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
      <span>{speaking ? "Hentikan" : "Bacakan"}</span>
    </button>
  );
}
