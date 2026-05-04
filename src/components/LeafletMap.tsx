import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression, Map as LeafletMapType } from "leaflet";
import { useApp } from "@/lib/app-context";
import { useTranslation } from "react-i18next";

function RegisterMapRef({ mapRef }: { mapRef: React.MutableRefObject<LeafletMapType | null> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
    return () => {
      if (mapRef.current === map) mapRef.current = null;
    };
  }, [map, mapRef]);
  return null;
}

function ZoomButtons({
  tone = "default",
  placement = "right",
}: {
  tone?: "default" | "inverted";
  placement?: "right" | "bottom";
}) {
  const { t } = useTranslation();
  const map = useMap();
  const isInverted = tone === "inverted";
  return (
    <div
      className={`pointer-events-auto absolute overflow-hidden rounded-xl shadow-sm ring-1 ${
        // Keep above the MapWidget click overlay (z-[1200]).
        placement === "bottom"
          ? "bottom-3 left-1/2 z-[1400] -translate-x-1/2"
          : "right-3 top-1/2 z-[1400] -translate-y-1/2"
      } ${isInverted ? "bg-black/45 ring-white/20" : "bg-[var(--panel)] ring-black/10"}`}
    >
      <button
        type="button"
        className={`flex h-9 w-9 items-center justify-center text-lg font-semibold ${
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
        className={`flex h-9 w-9 items-center justify-center text-lg font-semibold ${
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
}) {
  const { theme } = useApp();

  // Avoid SSR crashes (Leaflet touches window/document).
  if (typeof window === "undefined") {
    return <div className={`h-full w-full bg-[var(--panel-soft)] ${className}`} />;
  }

  // Workaround for react-leaflet hydration edge cases: keep a stable key.
  const key = useMemo(() => "leaflet-map", []);
  const mapRef = useRef<LeafletMapType | null>(null);

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  // When tiles are dark, use inverted zoom button surface for better readability.
  const zoomTone = theme === "dark" || theme === "purple" ? "inverted" : "default";

  return (
    <div className={`relative h-full w-full ${className}`}>
      <MapContainer
        key={key}
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
        <RegisterMapRef mapRef={mapRef} />
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
        {showZoomButtons && <ZoomButtons tone={zoomTone as any} placement={zoomButtonsPlacement} />}
      </MapContainer>
    </div>
  );
}

