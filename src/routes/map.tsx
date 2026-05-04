import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GearPanel } from "@/components/GearPanel.tsx";
import { BrightnessCard } from "@/components/BrightnessCard";
import { StatusCard } from "@/components/StatusCard";
import { ClimateCard } from "@/components/ClimateCard";
import { Search, Menu } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LeafletMap } from "@/components/LeafletMap";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { NearbyStationsPanel, type ChargingStation } from "@/components/NearbyStationsPanel";
import { useApp } from "@/lib/app-context";

type MapSearch = { destination?: string };

export const Route = createFileRoute("/map")({
  component: MapPage,
  validateSearch: (search: Record<string, unknown>): MapSearch => ({
    destination: typeof search.destination === "string" ? search.destination : undefined,
  }),
});

/**
 * Map page — when navigating into Map, the search bar expands to ~887×95
 * (9.34:1 ratio) and the map enlarges to ~890×584 (1.52:1 ratio).
 * Sidebar + the rest stay unchanged.
 */
function MapPage() {
  const { t } = useTranslation();
  const { destination: initialDest } = Route.useSearch();
  const { activeRoute, setActiveRoute, setMusicExpanded } = useApp();
  const navigate = useNavigate();
  const ignoreNextSearchSyncRef = useRef(false);

  // Map is for navigation only — never keep the large music overlay state here.
  useEffect(() => {
    setMusicExpanded(false);
  }, [setMusicExpanded]);

  const parseDirect = (raw: string) => {
    const s = (raw ?? "").trim();
    const m = s.match(/^@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?::(.+))?$/);
    const displayName = (m?.[3]?.trim() || s).trim();
    return { isDirect: !!m, displayName };
  };
  // If we already have a saved active route, use that destination as the
  // starting value (so the route stays visible after returning to /map).
  const initialFromCtx = initialDest ?? activeRoute?.destinationName ?? "";
  const initialParsed = parseDirect(initialFromCtx);
  const [destination, setDestination] = useState(initialParsed.displayName);
  const [activeDestination, setActiveDestination] = useState(initialFromCtx);
  const [shownDestination, setShownDestination] = useState(initialParsed.displayName);
  // Demo default: Kuching as current location.
  const [origin] = useState<{ lat: number; lng: number } | null>({ lat: 1.5533, lng: 110.3592 });
  const [geoError, setGeoError] = useState(false);
  const [destPos, setDestPos] = useState<{ lat: number; lng: number } | null>(
    activeRoute?.destinationPos ?? null,
  );
  const [routeLine, setRouteLine] = useState<LatLngExpression[] | null>(
    activeRoute?.routeLine ? (activeRoute.routeLine as LatLngExpression[]) : null,
  );
  const [mapBounds, setMapBounds] = useState<LatLngBoundsExpression | null>(
    activeRoute && origin
      ? [
          [activeRoute.origin.lat, activeRoute.origin.lng],
          [activeRoute.destinationPos.lat, activeRoute.destinationPos.lng],
        ]
      : null,
  );
  const [routeErrorKey, setRouteErrorKey] = useState<string | null>(null);
  const [stationsOpen, setStationsOpen] = useState(false);

  // If the URL search param changes (e.g. user taps a station in the bottom-right widget),
  // sync it into the input + routing label + active routing state.
  useEffect(() => {
    const next = (initialDest ?? "").trim();
    if (!next) {
      // Once the URL is cleared, allow future sync again.
      ignoreNextSearchSyncRef.current = false;
      return;
    }
    // When user clicks "End Navigation" we clear local state first, then clear the URL.
    // Without this guard, this effect re-applies the old destination for one render.
    if (ignoreNextSearchSyncRef.current) return;
    const { displayName } = parseDirect(next);

    // Always keep the input/label human-friendly, even if routing destination didn't change.
    if (destination !== displayName) setDestination(displayName);
    if (shownDestination !== displayName) setShownDestination(displayName);
    if (next !== activeDestination) setActiveDestination(next);
  }, [initialDest, activeDestination]);

  useEffect(() => {
    setGeoError(false);
  }, []);

  const center: LatLngExpression = useMemo(() => {
    if (origin) return [origin.lat, origin.lng];
    return [1.5533, 110.3592];
  }, [origin]);

  const originLatLng: LatLngExpression | null = origin ? [origin.lat, origin.lng] : null;
  const destLatLng: LatLngExpression | null = destPos ? [destPos.lat, destPos.lng] : null;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setRouteErrorKey(null);

      const q = activeDestination.trim();
      if (!q) {
        setRouteLine(null);
        setDestPos(null);
        setMapBounds(null);
        setActiveRoute(null);
        return;
      }
      if (!origin) {
        setRouteErrorKey("map.errors.waitingGps");
        return;
      }

      // If we already have a cached route in the global context for the same
      // destination, reuse it (skips a re-fetch when navigating back to /map).
      if (
        activeRoute &&
        activeRoute.destinationName === q &&
        activeRoute.routeLine.length > 1
      ) {
        setDestPos(activeRoute.destinationPos);
        setRouteLine(activeRoute.routeLine as LatLngExpression[]);
        setMapBounds([
          [activeRoute.origin.lat, activeRoute.origin.lng],
          [activeRoute.destinationPos.lat, activeRoute.destinationPos.lng],
        ]);
        return;
      }

      setRouteLine(null);
      setDestPos(null);
      setMapBounds(null);

      let dLat: number;
      let dLng: number;
      let displayName = q;

      // If destination is a charging station coordinate string "@lat,lng:Name", use it directly.
      const directMatch = q.match(/^@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?::(.+))?$/);
      if (directMatch) {
        dLat = Number(directMatch[1]);
        dLng = Number(directMatch[2]);
        if (directMatch[3]) displayName = directMatch[3];
      } else {
        // Geocode destination via Nominatim (no key/billing)
        const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
        const geoRes = await fetch(geoUrl, { headers: { Accept: "application/json" } });
        const geoJson: Array<{ lat: string; lon: string; display_name?: string }> = await geoRes.json();
        const first = geoJson?.[0];
        if (!first) {
          setRouteErrorKey("map.errors.destinationNotFound");
          return;
        }
        dLat = Number(first.lat);
        dLng = Number(first.lon);
      }

      if (!Number.isFinite(dLat) || !Number.isFinite(dLng)) {
        setRouteErrorKey("map.errors.destinationNotFound");
        return;
      }

      if (cancelled) return;
      setDestPos({ lat: dLat, lng: dLng });

      // 2) Route via OSRM public demo server (no key/billing)
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${dLng},${dLat}?overview=full&geometries=geojson`;
      const rRes = await fetch(osrmUrl, { headers: { "Accept": "application/json" } });
      const rJson: any = await rRes.json();
      const coords: [number, number][] | undefined = rJson?.routes?.[0]?.geometry?.coordinates;
      if (!coords || coords.length < 2) {
        setRouteErrorKey("map.errors.routeNotAvailable");
        return;
      }
      const latLngPairs: Array<[number, number]> = coords.map(([lng, lat]) => [lat, lng]);
      if (cancelled) return;
      setRouteLine(latLngPairs as LatLngExpression[]);
      setMapBounds([[origin.lat, origin.lng], [dLat, dLng]]);

      // Persist to global context so other pages (small map widget) can show it.
      setActiveRoute({
        destinationName: displayName,
        destinationPos: { lat: dLat, lng: dLng },
        origin: { ...origin },
        routeLine: latLngPairs,
      });
    };

    run().catch(() => setRouteErrorKey("map.errors.routingFailed"));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDestination, origin]);

  // Take left + center columns combined for map.
  const W_MAP_COL = 590;       // left + center merged (2× 290 + gap)
  const W_RIGHT = 268;
  const GAP = 10;
  const GAP_Y = 8;
  const H_SEARCH = 50;         // ~887×95 ratio scaled to 590w
  const H_GEAR = 470;
  const H_MAP = H_GEAR - H_SEARCH - GAP_Y; // lock map baseline to gear baseline
  const H_BOTTOM = 120;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-stretch" style={{ width: W_MAP_COL + W_RIGHT + GAP, gap: GAP }}>
        {/* Map column */}
        <div className="flex flex-col relative" style={{ width: W_MAP_COL, gap: GAP_Y }}>
          <form
            className="bg-app-panel relative flex items-center gap-2 rounded-full px-4 shadow-sm ring-1 ring-black/5"
            style={{ height: H_SEARCH }}
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = destination.trim();
              if (!trimmed) return;
              setActiveDestination(trimmed);
              setShownDestination(trimmed);
            }}
          >
            <button
              type="button"
              onClick={() => setStationsOpen((v) => !v)}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                stationsOpen ? "bg-[var(--active)]" : "hover:bg-[var(--active)]"
              }`}
              aria-label={t("map.nearbyStations")}
              title={t("map.nearbyStations")}
            >
              <Menu className="h-5 w-5 text-foreground/70" />
            </button>
            <input
              value={destination}
              onChange={(e) => {
                const next = e.target.value;
                setDestination(next);
                const trimmed = next.trim();
                if (trimmed) setShownDestination(trimmed);
              }}
              placeholder={t("map.enterDestination")}
              className="flex-1 bg-transparent outline-none placeholder:text-foreground/60 text-base"
            />
            <button
              type="submit"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--active)] text-foreground/90 hover:brightness-95"
              aria-label={t("map.searchDestination")}
            >
              <Search className="h-4 w-4" />
            </button>

            {origin && (
              <NearbyStationsPanel
                origin={origin}
                open={stationsOpen}
                onClose={() => setStationsOpen(false)}
                onSelect={(s: ChargingStation) => {
                  // Show the station name (match reference UI).
                  setDestination(s.name);
                  setShownDestination(s.name);
                  // Route reliably using the station coordinates (OSRM works best with lat/lng).
                  // We still keep the real address in the station list for display.
                  setActiveDestination(`@${s.lat},${s.lng}:${s.name}`);
                  setStationsOpen(false);
                }}
              />
            )}
          </form>
          <div className="relative overflow-hidden rounded-[24px]" style={{ height: H_MAP }}>
            <LeafletMap
              className="h-full w-full"
              center={center}
              zoom={15}
              origin={originLatLng}
              destination={destLatLng}
              route={routeLine}
              bounds={mapBounds}
            />
            {shownDestination && (
              <div className="pointer-events-none absolute left-1/2 top-3 z-[1100] -translate-x-1/2 rounded-xl bg-black/65 px-3 py-1.5 text-sm font-medium text-white backdrop-blur">
                {t("map.routingTo", { destination: shownDestination })}
              </div>
            )}
            {geoError && (
              <div className="pointer-events-none absolute bottom-3 left-1/2 z-[1100] -translate-x-1/2 rounded-lg bg-black/60 px-3 py-1.5 text-xs text-white">
                {t("map.geoUnavailable")}
              </div>
            )}
            {routeErrorKey && (
              <div className="pointer-events-none absolute bottom-3 right-3 z-[1100] rounded-lg bg-black/55 px-2.5 py-1 text-[11px] text-white/95">
                {t(routeErrorKey)}
              </div>
            )}
            {(routeLine && routeLine.length > 1) || shownDestination ? (
              <button
                type="button"
                onClick={() => {
                  ignoreNextSearchSyncRef.current = true;
                  // Also clear the URL search param so the old destination
                  // doesn't get re-applied by the route-sync effect.
                  try { navigate({ to: "/map", search: {} as any, replace: true }); } catch {}
                  setDestination("");
                  setActiveDestination("");
                  setShownDestination("");
                  setDestPos(null);
                  setRouteLine(null);
                  setMapBounds(null);
                  setRouteErrorKey(null);
                  setActiveRoute(null);
                }}
                className="absolute bottom-3 left-1/2 z-[1200] -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-[12px] font-bold text-white backdrop-blur hover:bg-black/70"
                aria-label={t("map.endNavigation")}
              >
                {t("map.endNavigation")}
              </button>
            ) : null}
          </div>
          {/* Bottom row of left+center columns */}
          <div className="grid grid-cols-2 gap-2 items-stretch" style={{ height: H_BOTTOM }}>
            <ClimateCard />
            <BrightnessCard />
          </div>
        </div>
        {/* Right column */}
        <div className="flex flex-col" style={{ width: W_RIGHT, gap: GAP_Y }}>
          <div style={{ height: H_GEAR }}><GearPanel /></div>
          <div style={{ height: H_BOTTOM }}><StatusCard /></div>
        </div>
      </div>
    </div>
  );
}
