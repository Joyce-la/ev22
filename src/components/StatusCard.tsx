import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import {
  CHARGING_DISTANCE_REFERENCE,
  formatKm,
  haversineKm,
  KUCHING_CHARGING_STATIONS,
} from "@/components/NearbyStationsPanel";
import { Cloud, CloudRain, CloudSnow, Sun, Zap, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function StatusCard() {
  const { t } = useTranslation();
  const { batteryLevel, weather, traveledKm } = useApp();
  const navigate = useNavigate();
  const [showStations, setShowStations] = useState(false);

  const stationsSorted = useMemo(() => {
    return KUCHING_CHARGING_STATIONS.map((s) => ({
      ...s,
      km: haversineKm(CHARGING_DISTANCE_REFERENCE, s),
    }))
      .sort((a, b) => a.km - b.km);
  }, []);
  const pct = Math.round(batteryLevel * 100);
  const left = Math.round(450 * batteryLevel);
  const fillColor = pct > 50 ? "#22c55e" : pct > 20 ? "#f59e0b" : "#ef4444";

  // Auto revert after 5s
  useEffect(() => {
    if (!showStations) return;
    const t = setTimeout(() => setShowStations(false), 5000);
    return () => clearTimeout(t);
  }, [showStations]);

  const Icon = weather.condition === "Sunny" ? Sun
    : weather.condition === "Rainy" ? CloudRain
    : weather.condition === "Snowy" ? CloudSnow
    : weather.condition === "Stormy" ? Zap
    : Cloud;
  const conditionKey = weather.condition === "Sunny"
    ? "sunny"
    : weather.condition === "Rainy"
    ? "rainy"
    : weather.condition === "Snowy"
    ? "snowy"
    : weather.condition === "Stormy"
    ? "stormy"
    : "cloudy";

  if (showStations) {
    return (
      <div
        className="flex h-full w-full cursor-pointer flex-col rounded-[24px] bg-app-panel px-3 py-2 shadow-sm ring-1 ring-black/5 animate-fade-in"
        onClick={() => setShowStations(false)}
      >
        <div className="flex items-center gap-1.5 border-b border-black/5 pb-1">
          <Zap className="h-4 w-4 text-yellow-500 fill-yellow-400" />
          <div className="text-xs font-bold tracking-wide">{t("status.nearbyCharging")}</div>
          <button
            className="ml-auto text-foreground/60 hover:text-foreground"
            onClick={(e) => { e.stopPropagation(); setShowStations(false); }}
            aria-label={t("status.back")}
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          {stationsSorted.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                // Use the same "@lat,lng:Name" format supported by the map page routing logic.
                navigate({ to: "/map", search: { destination: `@${s.lat},${s.lng}:${s.name}` } as any });
              }}
              className="flex w-full items-center gap-1.5 rounded-md px-1 py-1 text-left hover:bg-black/5"
            >
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[0.65rem] font-bold text-white ${s.type === "AC" ? "bg-sky-500" : "bg-emerald-600"}`}>
                {s.type}
              </div>
              <div className="flex-1 truncate text-xs font-medium leading-tight">{s.name}</div>
              <div className="text-xs font-bold text-purple-500">{formatKm(s.km, t("common.unitKm"))}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowStations(true)}
      className="flex h-full w-full cursor-pointer items-center gap-1.5 overflow-hidden rounded-[24px] bg-app-panel px-2 py-2 text-left shadow-sm ring-1 ring-black/5 transition hover:ring-black/10"
    >
      {/* Battery icon */}
      <div className="flex w-[44px] shrink-0 flex-col items-center">
        <svg width="44" height="62" viewBox="0 0 54 76">
          <rect x="17" y="2" width="20" height="6" rx="1.5" fill="#374151" />
          <rect x="4" y="8" width="46" height="64" rx="6" fill="none" stroke="#374151" strokeWidth="2.6"/>
          <rect x="9" y={13 + (54 * (1 - batteryLevel))} width="36" height={54 * batteryLevel} rx="3" fill={fillColor} />
        </svg>
      </div>
      {/* Numbers — sizes respect --hki-font-scale with caps so nothing clips in the fixed slot */}
      <div className="min-w-0 flex flex-1 flex-col justify-center gap-0.5 overflow-hidden leading-tight">
        <div
          className="min-w-0 max-w-full shrink-0 font-extrabold leading-none tracking-tight tabular-nums"
          style={{ fontSize: "clamp(14px, calc(24px * var(--hki-font-scale, 1)), 26px)" }}
        >
          {pct}%
        </div>
        <div
          className="min-w-0 break-words font-bold leading-snug"
          style={{ fontSize: "clamp(8px, calc(10px * var(--hki-font-scale, 1)), 12px)" }}
        >
          {t("status.left")}
        </div>
        <div className="min-w-0 break-words leading-snug" style={{ fontSize: "clamp(8px, calc(10px * var(--hki-font-scale, 1)), 12px)" }}>
          <span className="font-extrabold" style={{ fontSize: "clamp(10px, calc(13px * var(--hki-font-scale, 1)), 14px)" }}>{left}</span>
          <span style={{ fontSize: "clamp(8px, calc(9px * var(--hki-font-scale, 1)), 11px)" }}>{t("common.unitKm")}</span>
        </div>
        <div className="min-w-0 break-words leading-snug" style={{ fontSize: "clamp(8px, calc(10px * var(--hki-font-scale, 1)), 12px)" }}>
          {t("status.traveled")}
        </div>
        <div className="min-w-0 break-words leading-snug" style={{ fontSize: "clamp(8px, calc(10px * var(--hki-font-scale, 1)), 12px)" }}>
          <span className="font-extrabold" style={{ fontSize: "clamp(10px, calc(13px * var(--hki-font-scale, 1)), 14px)" }}>{Math.floor(traveledKm)}</span>
          <span style={{ fontSize: "clamp(8px, calc(9px * var(--hki-font-scale, 1)), 11px)" }}>{t("common.unitKm")}</span>
        </div>
      </div>
      {/* Weather — column centered in tile; condition scrolls in a capped band if needed */}
      <div className="flex h-[86px] w-[108px] shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-[18px] bg-gradient-to-b from-sky-200 to-sky-300 px-1.5 py-1 text-center text-slate-800">
        <Icon
          className="shrink-0"
          strokeWidth={2}
          style={{
            width: "clamp(18px, calc(22px * var(--hki-font-scale, 1)), 26px)",
            height: "clamp(18px, calc(22px * var(--hki-font-scale, 1)), 26px)",
          }}
        />
        <div
          className="w-full shrink-0 font-extrabold leading-none tabular-nums"
          style={{ fontSize: "clamp(12px, calc(17px * var(--hki-font-scale, 1)), 20px)" }}
        >
          {weather.tempC}°
        </div>
        <div
          className="mx-auto max-h-[38px] min-h-0 w-full max-w-full overflow-y-auto overflow-x-hidden whitespace-normal break-words px-0.5 text-center text-balance font-semibold leading-snug [scrollbar-width:thin]"
          style={{ fontSize: "clamp(7px, calc(10px * var(--hki-font-scale, 1)), 11px)" }}
          title={t(`weather.${conditionKey}`)}
        >
          {t(`weather.${conditionKey}`)}
        </div>
      </div>
    </button>
  );
}
