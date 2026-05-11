import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "@/lib/app-context";
import { LeafletMap } from "@/components/LeafletMap";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import {
  polylineLengthMeters,
  polylineSuffixFromMeters,
  positionAlongPolyline,
} from "@/lib/osrm-navigation";

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

  const inLiveNav =
    !!activeRoute?.navigationHudShown && !!routeLine && routeLine.length > 1;
  const navProgressM = activeRoute?.navigationProgressMeters ?? 0;

  /** Same polyline interpolation as /map so the widget blue dot tracks the vehicle. */
  const userMarker: [number, number] = useMemo(() => {
    if (!inLiveNav || !activeRoute?.routeLine?.length) return originPos;
    const pairs = activeRoute.routeLine as Array<[number, number]>;
    const polyLen = polylineLengthMeters(pairs);
    if (polyLen <= 0) return originPos;
    const legD = activeRoute.navigationLeg?.legDistanceMeters;
    const cap = legD != null && legD > 0 ? legD : polyLen;
    const posM = Math.min(navProgressM * (polyLen / cap), polyLen);
    const p = positionAlongPolyline(pairs, posM);
    return [p.lat, p.lng];
  }, [inLiveNav, activeRoute, navProgressM, originPos]);

  const routeLineDisplayed: LatLngExpression[] | null = useMemo(() => {
    if (!routeLine || routeLine.length < 2) return null;
    if (!inLiveNav || !activeRoute?.routeLine?.length) return routeLine;
    const pairs = activeRoute.routeLine as Array<[number, number]>;
    const polyLen = polylineLengthMeters(pairs);
    if (polyLen <= 0) return routeLine;
    const legD = activeRoute.navigationLeg?.legDistanceMeters;
    const cap = legD != null && legD > 0 ? legD : polyLen;
    const posM = Math.min(navProgressM * (polyLen / cap), polyLen);
    const suffix = polylineSuffixFromMeters(pairs, posM);
    return suffix.length >= 2 ? (suffix as LatLngExpression[]) : null;
  }, [routeLine, inLiveNav, activeRoute, navProgressM]);

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
    : "bg-app-panel text-foreground ring-1 ring-black/10 shadow-sm";
  const mapHintClass = theme === "purple" || theme === "dark"
    ? "bg-black/50 text-white/95 ring-1 ring-white/25 shadow-md"
    : "bg-app-panel text-foreground/80 ring-1 ring-black/8 shadow-sm";

  const navLabel = activeRoute
    ? t("map.routingTo", { destination: activeRoute.destinationName })
    : t("map.navigation");

  const inner = (
    <div className={`group relative h-full w-full overflow-hidden rounded-[28px] bg-app-panel-soft shadow-sm ring-1 ring-black/5 ${className}`}>
      <LeafletMap
        className="absolute inset-0"
        center={originPos}
        zoom={zoom}
        origin={userMarker}
        destination={destPos}
        route={routeLineDisplayed}
        bounds={bounds}
        interactive={fullscreen}
        showZoomButtons={true}
        zoomButtonsPlacement="right"
        zoomButtonsSize={fullscreen ? "default" : "large"}
      />
      {!fullscreen && (
        <div className="pointer-events-none absolute inset-x-[12px] top-[12px] z-[1100] flex items-center justify-between gap-2">
          <div
            className={`max-w-[72%] truncate rounded-full px-[12px] py-[5px] font-semibold backdrop-blur ${mapChipClass}`}
            style={{ fontSize: "clamp(10px, calc(11px * var(--hki-font-scale, 1)), 16px)" }}
          >
            {navLabel}
          </div>
          <div
            className={`shrink-0 rounded-full px-[10px] py-[5px] font-semibold backdrop-blur opacity-95 transition group-hover:opacity-100 ${mapHintClass}`}
            style={{ fontSize: "clamp(9px, calc(10px * var(--hki-font-scale, 1)), 14px)" }}
          >
            {t("map.tapToEnlarge")}
          </div>
        </div>
      )}
      {clickable && !fullscreen && <Link to="/map" className="absolute inset-0 z-[1200] block" aria-label={t("map.openFullMap")} />}
    </div>
  );

  return inner;
}
