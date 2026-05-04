import { createFileRoute } from "@tanstack/react-router";
import { GearPanel } from "@/components/GearPanel.tsx";
import { BrightnessCard } from "@/components/BrightnessCard";
import { StatusCard } from "@/components/StatusCard";
import { MapWidget } from "@/components/MapWidget";
import { TrafficWidget } from "@/components/TrafficWidget";
import { useApp } from "@/lib/app-context";
import { Gauge, ParkingSquare, Car as CarIcon } from "lucide-react";
import { CockpitLayout } from "@/components/CockpitLayout";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/car")({ component: CarPage });

const MODES = [
  { v: "adaptive" as const, labelKey: "car.adaptiveCruise", icon: Gauge },
  { v: "parking"  as const, labelKey: "car.autoParking",     icon: ParkingSquare },
  { v: "lane"     as const, labelKey: "car.laneCentering",   icon: CarIcon },
];

/**
 * Car / Driving Modes page — Three buttons sized 147×280 (ratio 0.525:1)
 * and "Driving Modes" label 198×29.
 */
function CarPage() {
  const { drivingMode, setDrivingMode } = useApp();
  const { t } = useTranslation();

  return (
    <CockpitLayout
      leftTop={<TrafficWidget className="h-full w-full" />}
      leftBottom={
        <div className="flex h-full flex-col rounded-[24px] bg-app-panel px-2 py-1.5 shadow-sm ring-1 ring-black/5">
          <div
            className="mx-auto font-bold leading-none"
            style={{ fontSize: "clamp(10px, calc(11px * var(--hki-font-scale, 1)), 16px)" }}
          >
            {t("car.drivingModes")}
          </div>
          <div className="grid flex-1 grid-cols-3 gap-1.5 pt-1">
            {MODES.map(({ v, labelKey, icon: Icon }) => {
              const active = drivingMode === v;
              return (
                <button
                  key={v}
                  onClick={() => setDrivingMode(v)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-[14px] border px-1 py-1 transition-all ${
                    active ? "border-green-400 bg-green-200/70" : "border-border bg-app-panel-soft hover:bg-[var(--active)]/50"
                  }`}
                >
                  <Icon className={`h-7 w-7 ${active ? "text-green-700" : ""}`} strokeWidth={1.8} />
                  <span
                    className={`text-center font-bold leading-[1.1] ${active ? "text-green-800" : ""}`}
                    style={{ fontSize: "clamp(9px, calc(10px * var(--hki-font-scale, 1)), 14px)" }}
                  >
                    {t(labelKey)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      }
      centerTop={<MapWidget className="h-full w-full" />}
      centerBottom={<BrightnessCard />}
      rightTop={<GearPanel />}
      rightBottom={<StatusCard />}
    />
  );
}
