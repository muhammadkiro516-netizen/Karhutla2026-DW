"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { CITIES } from "@/config/cities";
import type { RichCluster } from "@/types/api";
import type { HotspotPayload } from "@/types/api";

const CONF_COLOR: Record<string, string> = {
  TINGGI: "#DC2626",
  SEDANG: "#F97316",
  RENDAH: "#EAB308",
};

const CONF_ICON: Record<string, string> = { TINGGI: "🔥", SEDANG: "🔥", RENDAH: "🔥" };

function fireMarker(color: string, icon: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div class="marker-fire" style="background:${color}"><span>${icon}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

function cityMarker(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div class="marker-city" style="background:${color}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9],
  });
}

interface HotspotMapProps {
  payload: HotspotPayload | undefined;
  ispuByCity: Record<string, string | undefined>;
  onSelectCluster?: (cluster: RichCluster) => void;
}

export function HotspotMap({ payload, ispuByCity, onSelectCluster }: HotspotMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Init map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [-2.5, 116],
      zoom: 5,
      scrollWheelZoom: true,
      attributionControl: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 14,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapInstance.current = map;

    // Prevent default scroll-to-zoom hijacking on mobile
    map.on("focus", () => map.scrollWheelZoom.enable());
    map.on("blur", () => map.scrollWheelZoom.disable());

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    const layer = layerRef.current;
    const map = mapInstance.current;
    if (!layer || !map) return;

    layer.clearLayers();

    // City markers
    for (const city of CITIES) {
      const ispuColor = ispuByCity[city.id] ?? "#94a3b8";
      const marker = L.marker([city.lat, city.lon], {
        icon: cityMarker(ispuColor),
      }).addTo(layer);

      marker.bindPopup(
        `<div style="min-width:120px"><strong>${city.name}</strong><br/>` +
        `<span style="color:${ispuColor}">●</span> ${city.province}</div>`,
      );
    }

    // Fire cluster markers
    const clusters = payload?.clusters ?? [];
    for (const c of clusters) {
      const color = CONF_COLOR[c.confidence] ?? "#6b7280";
      const marker = L.marker([c.lat, c.lon], {
        icon: fireMarker(color, CONF_ICON[c.confidence] ?? "🔥"),
      }).addTo(layer);

      const city = CITIES.find((ci) => ci.id === c.nearestCityId);
      const popupHtml =
        `<div style="min-width:160px">` +
        `<strong style="color:${color}">🔥 ${c.confidence}</strong><br/>` +
        `${c.count} deteksi • FRP ${c.maxFrp} MW<br/>` +
        `Dekat ${city?.name ?? c.nearestCityId} (${c.nearestKm} km)<br/>` +
        `<a href="https://www.google.com/maps?q=${c.lat.toFixed(4)},${c.lon.toFixed(4)}" ` +
        `target="_blank" rel="noopener" style="color:#2563eb">Buka di Google Maps ↗</a>` +
        `</div>`;
      marker.bindPopup(popupHtml);

      if (onSelectCluster) {
        marker.on("click", () => onSelectCluster(c));
      }
    }

    // Fit bounds to show all markers if there are clusters
    if (clusters.length > 0) {
      const bounds = L.latLngBounds(
        clusters.map((c) => [c.lat, c.lon] as [number, number]),
      );
      // Pad to include Indonesia
      bounds.extend([-6, 106]); // Jakarta
      bounds.extend([0.5, 101]); // Pekanbaru
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [payload, ispuByCity, onSelectCluster]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[320px] lg:h-[480px] rounded-[--radius-card] overflow-hidden border border-white/40 dark:border-slate-700/40 shadow-lg z-0"
      aria-label="Peta titik api"
    />
  );
}
