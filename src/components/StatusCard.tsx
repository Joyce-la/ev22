import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import { Cloud, CloudRain, CloudSnow, Sun, Zap, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const STATIONS = [
  // Keep the same distances shown in the widget, but route by coordinates for reliability.
  { id: "chargev", name: "chargEV Charging Station", type: "AC", distance: "1.5 km", lat: 1.5569, lng: 110.3439 },
  { id: "jomcharge", name: "JomCharge Charging Station", type: "DC", distance: "3 km", lat: 1.5506, lng: 110.3369 },
  { id: "shell", name: "Shell Recharge Station", type: "DC", distance: "4.2 km", lat: 1.5489, lng: 110.3392 },
  { id: "tnb", name: "TNB Electron Hub", type: "AC", distance: "5.8 km", lat: 1.5549, lng: 110.3462 },
];

export function StatusCard() {
  const { t } = useTranslation();
  const { batteryLevel, weather, traveledKm } = useApp();
  const navigate = useNavigate();
  const [showStations, setShowStations] = useState(false);
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
        className="flex h-full w-full cursor-pointer flex-col rounded-[24px] bg-[var(--panel)] px-3 py-2 shadow-sm ring-1 ring-black/5 animate-fade-in"
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
          {STATIONS.map((s) => (
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
              <div className="text-xs font-bold text-purple-500">{s.distance}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowStations(true)}
      className="flex h-full w-full cursor-pointer items-center gap-1.5 overflow-hidden rounded-[24px] bg-[var(--panel)] px-2 py-2 text-left shadow-sm ring-1 ring-black/5 transition hover:ring-black/10"
    >
      {/* Battery icon */}
      <div className="flex w-[44px] shrink-0 flex-col items-center">
        <svg width="44" height="62" viewBox="0 0 54 76">
          <rect x="17" y="2" width="20" height="6" rx="1.5" fill="#374151" />
          <rect x="4" y="8" width="46" height="64" rx="6" fill="none" stroke="#374151" strokeWidth="2.6"/>
          <rect x="9" y={13 + (54 * (1 - batteryLevel))} width="36" height={54 * batteryLevel} rx="3" fill={fillColor} />
        </svg>
      </div>
      {/* Numbers — 123×48 text block ratio */}
      <div className="min-w-0 flex flex-1 flex-col justify-center overflow-hidden leading-tight">
        <div className="shrink-0 truncate whitespace-nowrap font-extrabold leading-none tracking-tight text-3xl">
          {pct}%
        </div>
        <div className="mt-1 truncate text-[10px] leading-tight"><span className="font-bold">{t("status.left")}</span></div>
        <div className="truncate text-[10px] leading-tight">
          <span className="font-extrabold text-[13px]">{left}</span><span className="text-[9px]">km</span>
        </div>
        <div className="truncate text-[10px] leading-tight">{t("status.traveled")}</div>
        <div className="truncate text-[10px] leading-tight">
          <span className="font-extrabold text-[13px]">{Math.floor(traveledKm)}</span><span className="text-[9px]">km</span>
        </div>
      </div>
      {/* Weather */}
      <div className="flex h-[72px] w-[70px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-[14px] bg-gradient-to-b from-sky-200 to-sky-300 text-center text-slate-800">
        <Icon className="h-7 w-7" strokeWidth={2} />
        <div className="font-extrabold leading-none" style={{ fontSize: "clamp(0.9rem, 1rem, 1rem)" }}>
          {weather.tempC}°
        </div>
        <div className="w-full truncate px-1 font-semibold leading-none" style={{ fontSize: "clamp(0.6rem, 0.68rem, 0.68rem)" }}>
          {t(`weather.${conditionKey}`)}
        </div>
      </div>
    </button>
  );
}
