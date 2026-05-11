import { Zap, RotateCw, X, Navigation, House } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export type ChargingStation = {
  id: string;
  name: string;
  /**
   * Real-world street address. Used purely for display so the user can see
   * where they are about to be navigated to. Routing itself uses lat/lng.
   */
  address: string;
  type: "AC" | "DC";
  lat: number;
  lng: number;
};

// EV charging stations near Kuching, Sarawak (approximate coordinates).
// You can extend this list freely.
export const KUCHING_CHARGING_STATIONS: ChargingStation[] = [
  {
    id: "chargev-charging-station",
    name: "ChargEV Charging Station",
    address: "chargEV Charging Station, Jalan Tun Abang Haji Openg, 93400 Kuching, Sarawak",
    type: "AC",
    // Approximate coords near Jalan Tun Abang Haji Openg (Kuching).
    lat: 1.5569,
    lng: 110.3439,
  },
  {
    id: "jomcharge-charging-station",
    name: "JomCharge Charging Station",
    address: "15, Jalan Bukit Mata Kuching, 93100 Kuching, Sarawak",
    type: "DC",
    // Approximate coords near Jalan Bukit Mata (Kuching).
    lat: 1.5506,
    lng: 110.3369,
  },
  {
    id: "shell-recharge-station",
    name: "Shell Recharge Station",
    address: "6, Jalan Petanak, 93100 Kuching, Sarawak",
    type: "DC",
    // Approximate coords near Jalan Petanak (Kuching).
    lat: 1.5489,
    lng: 110.3392,
  },
  {
    id: "tnb-electron-hub",
    name: "TNB Electron Hub",
    address: "68, Jalan Tun Abang Haji Openg, 93000 Kuching, Sarawak",
    type: "DC",
    // Approximate coords near Jalan Tun Abang Haji Openg (Kuching).
    lat: 1.5549,
    lng: 110.3462,
  },
];

const HOME_DESTINATION: ChargingStation = {
  id: "home-unimas",
  name: "Home",
  address: "UNIMAS",
  // Type isn't shown for the Home shortcut row, but we keep the type for compatibility.
  type: "AC",
  // Approximate coordinates for Universiti Malaysia Sarawak (UNIMAS).
  lat: 1.4655,
  lng: 110.4262,
};

/** Same demo “current location” as `map.tsx` route origin — keep charging distances in sync. */
export const CHARGING_DISTANCE_REFERENCE = { lat: 1.5533, lng: 110.3592 } as const;

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatKm(km: number, unit: string) {
  if (km < 10) return `${km.toFixed(1)} ${unit}`;
  return `${Math.round(km)} ${unit}`;
}

interface Props {
  origin: { lat: number; lng: number };
  open: boolean;
  onClose: () => void;
  onSelect: (station: ChargingStation) => void;
}

export function NearbyStationsPanel({ origin, open, onClose, onSelect }: Props) {
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);

  const sorted = useMemo(() => {
    return KUCHING_CHARGING_STATIONS.map((s) => ({
      station: s,
      km: haversineKm(origin, s),
    })).sort((a, b) => a.km - b.km);
  }, [origin, refreshKey]);

  if (!open) return null;

  return (
    <div className="absolute left-3 top-[58px] z-[1300] w-[340px] overflow-hidden rounded-2xl bg-app-panel shadow-2xl ring-1 ring-black/10">
      {/* Destination shortcut (pinned above stations header) */}
      <button
        key={HOME_DESTINATION.id}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelect(HOME_DESTINATION);
        }}
        className="group flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-[var(--active)]"
        title={t("map.navigateHome")}
      >
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-app-panel-soft text-foreground/75">
          <House className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium leading-tight">{t("map.homeShortcut")}</span>
          <span className="mt-0.5 block truncate text-[11px] leading-tight text-foreground/55">UNIMAS</span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[12px] font-bold text-[var(--brand)]">{`0 ${t("common.unitKm")}`}</span>
          <Navigation className="h-3.5 w-3.5 text-[var(--brand)] opacity-0 transition group-hover:opacity-100" />
        </span>
      </button>

      <div className="mx-3 border-t border-black/10" />

      <div className="flex items-center justify-between gap-2 border-b border-black/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <div className="text-[13px] font-semibold">{t("map.nearbyStations")}</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/70 hover:bg-[var(--active)]"
            aria-label={t("nearby.refresh")}
            title={t("nearby.refresh")}
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/70 hover:bg-[var(--active)]"
            aria-label={t("nearby.closePanel")}
            title={t("nearby.closePanel")}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="max-h-[300px] overflow-y-auto py-1">
        {sorted.map(({ station, km }) => {
          const typeColor =
            station.type === "DC"
              ? "bg-emerald-600 text-white"
              : "bg-sky-600 text-white";
          return (
            <button
              key={station.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(station);
              }}
              className="group flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-[var(--active)]"
              title={t("map.navigateToStation", { station: station.name })}
            >
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${typeColor}`}
              >
                {station.type}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium leading-tight">
                  {station.name}
                </span>
                <span className="mt-0.5 block truncate text-[11px] leading-tight text-foreground/55">
                  {station.address}
                </span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-[12px] font-bold text-[var(--brand)]">
                  {formatKm(km, t("common.unitKm"))}
                </span>
                <Navigation className="h-3.5 w-3.5 text-[var(--brand)] opacity-0 transition group-hover:opacity-100" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
