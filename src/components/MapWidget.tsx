import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "@/lib/app-context";
import { LeafletMap } from "@/components/LeafletMap";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";

const FALLBACK: [number, number] = [1.5533, 110.3592];

export function MapWidget({ className = "", clickable = true, fullscreen = false }: { className?: string; clickable?: boolean; fullscreen?: boolean }) {
  const { t } = useTranslation();
  const { theme, activeRoute } = useApp();
  const [coords, setCoords] = useState<[number, number]>(FALLBACK);

  // Demo default: keep the "current location" pinned to Kuching.
  // (If you later want real GPS again, we can add a Settings toggle.)
  useEffect(() => {
    setCoords(FALLBACK);
  }, []);

  // If a route is active (set from /map), use the same origin + show the
  // route + destination + auto-fit to the route bounds.
  const originPos: [number, number] = useMemo(
    () => (activeRoute ? [activeRoute.origin.lat, activeRoute.origin.lng] : coords),
    [activeRoute, coords],
  );
  const destPos: LatLngExpression | null = useMemo(
    () => (activeRoute ? [activeRoute.destinationPos.lat, activeRoute.destinationPos.lng] : null),
    [activeRoute],
  );
  const routeLine: LatLngExpression[] | null = useMemo(
    () => (activeRoute ? (activeRoute.routeLine as LatLngExpression[]) : null),
    [activeRoute],
  );
  const bounds: LatLngBoundsExpression | null = useMemo(() => {
    if (!routeLine || routeLine.length < 2) return null;
    let minLat = Infinity;
    let minLng = Infinity;
    let maxLat = -Infinity;
    let maxLng = -Infinity;
    for (const p of routeLine) {
      if (!Array.isArray(p) || p.length < 2) continue;
      const lat = Number(p[0]);
      const lng = Number(p[1]);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      if (lat < minLat) minLat = lat;
      if (lng < minLng) minLng = lng;
      if (lat > maxLat) maxLat = lat;
      if (lng > maxLng) maxLng = lng;
    }
    if (!Number.isFinite(minLat) || !Number.isFinite(minLng) || !Number.isFinite(maxLat) || !Number.isFinite(maxLng)) return null;
    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  }, [routeLine]);

  const zoom = useMemo(() => (fullscreen ? 15 : 14), [fullscreen]);
  const mapChipClass = theme === "purple"
    ? "bg-black/55 text-white ring-1 ring-white/35 shadow-md"
    : theme === "dark"
    ? "bg-black/55 text-white ring-1 ring-white/20 shadow-md"
    : "bg-[var(--panel)]/96 text-foreground ring-1 ring-black/10 shadow-sm";
  const mapHintClass = theme === "purple" || theme === "dark"
    ? "bg-black/50 text-white/95 ring-1 ring-white/25 shadow-md"
    : "bg-[var(--panel)]/94 text-foreground/80 ring-1 ring-black/8 shadow-sm";

  const navLabel = activeRoute
    ? t("map.routingTo", { destination: activeRoute.destinationName })
    : t("map.navigation");

  const inner = (
    <div className={`group relative h-full w-full overflow-hidden rounded-[28px] bg-[var(--panel-soft)] shadow-sm ring-1 ring-black/5 ${className}`}>
      <LeafletMap
        className="absolute inset-0"
        center={originPos}
        zoom={zoom}
        origin={originPos}
        destination={destPos}
        route={routeLine}
        bounds={bounds}
        interactive={fullscreen}
        showZoomButtons={true}
        zoomButtonsPlacement="right"
      />
      {!fullscreen && (
        <div className="pointer-events-none absolute inset-x-[12px] top-[12px] z-[1100] flex items-center justify-between gap-2">
          <div className={`max-w-[72%] truncate rounded-full px-[12px] py-[5px] text-[11px] font-semibold backdrop-blur ${mapChipClass}`}>{navLabel}</div>
          <div className={`shrink-0 rounded-full px-[10px] py-[5px] text-[10px] font-semibold backdrop-blur opacity-95 transition group-hover:opacity-100 ${mapHintClass}`}>{t("map.tapToEnlarge")}</div>
        </div>
      )}
      {clickable && !fullscreen && <Link to="/map" className="absolute inset-0 z-[1200] block" aria-label={t("map.openFullMap")} />}
    </div>
  );

  return inner;
}
