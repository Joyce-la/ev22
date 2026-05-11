import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { useApp } from "@/lib/app-context";
import { useTranslation } from "react-i18next";

function ZoomButtons({
  tone = "default",
  placement = "right",
  size = "default",
}: {
  tone?: "default" | "inverted";
  placement?: "right" | "bottom";
  size?: "default" | "large";
}) {
  const { t } = useTranslation();
  const map = useMap();
  const isInverted = tone === "inverted";
  const btn =
    size === "large"
      ? "flex h-12 w-12 items-center justify-center text-2xl font-semibold leading-none"
      : "flex h-9 w-9 items-center justify-center text-lg font-semibold leading-none";
  const shell = size === "large" ? "rounded-2xl" : "rounded-xl";
  return (
    <div
      className={`pointer-events-auto absolute overflow-hidden shadow-sm ring-1 ${shell} ${
        // Keep above the MapWidget click overlay (z-[1200]).
        placement === "bottom"
          ? "bottom-3 left-1/2 z-[1400] -translate-x-1/2"
          : "right-3 top-1/2 z-[1400] -translate-y-1/2"
      } ${isInverted ? "bg-black/45 ring-white/20" : "bg-app-panel ring-black/10"}`}
    >
      <button
        type="button"
        className={`${btn} ${
          isInverted ? "text-[var(--brand)] hover:bg-white/10" : "text-[var(--brand)] hover:bg-[var(--active)]/40"
        }`}
        onClick={() => map.zoomIn()}
        aria-label={t("leaflet.zoomIn")}
      >
        +
      </button>
      <div
        className={`${placement === "bottom" ? "w-px" : "h-px w-full"} ${isInverted ? "bg-white/15" : "bg-black/10"}`}
      />
      <button
        type="button"
        className={`${btn} ${
          isInverted ? "text-[var(--brand)] hover:bg-white/10" : "text-[var(--brand)] hover:bg-[var(--active)]/40"
        }`}
        onClick={() => map.zoomOut()}
        aria-label={t("leaflet.zoomOut")}
      >
        −
      </button>
    </div>
  );
}

function FitToBounds({ bounds }: { bounds: LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (!bounds) return;
    map.fitBounds(bounds, { padding: [22, 22] });
  }, [bounds, map]);
  return null;
}

export function LeafletMap({
  className = "",
  center,
  zoom = 14,
  origin,
  destination,
  route,
  bounds,
  interactive = true,
  showZoomButtons = true,
  zoomButtonsPlacement = "right",
  zoomButtonsSize = "default",
}: {
  className?: string;
  center: LatLngExpression;
  zoom?: number;
  origin?: LatLngExpression | null;
  destination?: LatLngExpression | null;
  route?: LatLngExpression[] | null;
  bounds?: LatLngBoundsExpression | null;
  interactive?: boolean;
  showZoomButtons?: boolean;
  zoomButtonsPlacement?: "right" | "bottom";
  /** Larger +/- on compact maps (e.g. dashboard widget). */
  zoomButtonsSize?: "default" | "large";
}) {
  const { theme } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  // Avoid SSR/hydration crashes: render the real map only after client mount.
  if (typeof window === "undefined" || !mounted) {
    return <div className={`h-full w-full bg-app-panel-soft ${className}`} />;
  }

  // When tiles are dark, use inverted zoom button surface for better readability.
  const zoomTone = theme === "dark" || theme === "purple" ? "inverted" : "default";

  return (
    <div className={`relative h-full w-full ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        boxZoom={interactive}
        keyboard={interactive}
        touchZoom={interactive}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer
          // Free OSM tiles (for demos). For production you should use your own tile provider.
          url={tileUrl}
        />
        {route && route.length > 1 && (
          <Polyline positions={route} pathOptions={{ color: "var(--brand)", weight: 5, opacity: 0.9 }} />
        )}
        {origin && (
          <CircleMarker
            center={origin}
            radius={8}
            pathOptions={{ color: "#0ea5e9", weight: 3, fillOpacity: 1, fillColor: "#0ea5e9" }}
          />
        )}
        {destination && <CircleMarker center={destination} radius={8} pathOptions={{ color: "#111827", weight: 3, fillOpacity: 1, fillColor: "#111827" }} />}
        <FitToBounds bounds={bounds ?? null} />
        {showZoomButtons && (
          <ZoomButtons tone={zoomTone as any} placement={zoomButtonsPlacement} size={zoomButtonsSize} />
        )}
      </MapContainer>
    </div>
  );
}

