import { useApp } from "@/lib/app-context";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AIRFLOW_ICON_BOTH, AIRFLOW_ICON_DOWN, AIRFLOW_ICON_FACE } from "@/assets/airflow-icons";

export function ClimateCard() {
  const { t } = useTranslation();
  const { temp, setTemp, acOn, setAcOn, airflowMode, setAirflowMode } = useApp();

  const dec = () => setTemp(Math.max(18, +(temp - 0.5).toFixed(1)));
  const inc = () => setTemp(Math.min(30, +(temp + 0.5).toFixed(1)));

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-[28px] bg-[var(--panel)] px-[10px] py-[10px] shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-[6px]">
        <button onClick={dec} className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[var(--panel-soft)] hover:bg-[var(--active)]" aria-label={t("climate.decrease")}>
          <Minus className="h-4 w-4" />
        </button>
        <div className="flex h-[46px] min-w-[112px] items-center justify-center rounded-full bg-[var(--panel-soft)] px-4 font-bold tabular-nums text-lg">
          {temp.toFixed(1)}°C
        </div>
        <button onClick={inc} className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[var(--panel-soft)] hover:bg-[var(--active)]" aria-label={t("climate.increase")}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center justify-between gap-[6px] px-[2px]">
        <SeatVent direction="face" active={airflowMode === "face"} onSelect={() => setAirflowMode("face")} />
        <SeatVent direction="down" active={airflowMode === "down"} onSelect={() => setAirflowMode("down")} />
        <SeatVent direction="both" active={airflowMode === "both"} onSelect={() => setAirflowMode("both")} />
        <button
          onClick={() => setAcOn(!acOn)}
          className={`flex h-[40px] min-w-[72px] items-center justify-center rounded-full px-4 text-[13px] font-bold transition-all ${acOn ? "bg-[var(--brand)] text-white" : "bg-[var(--panel-soft)] text-foreground"}`}
        >
          {t("climate.ac")}
        </button>
      </div>
    </div>
  );
}

/**
 * Seat with directional airflow arrow + dot — matches reference SS.
 *  - down: arrow curls down toward feet
 *  - middle: arrow points horizontally to torso
 *  - up: arrow curls up toward face/head
 */
function SeatVent({
  direction,
  active,
  onSelect,
}: {
  direction: "face" | "down" | "both";
  active: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation();
  // Reuse existing translation keys if present:
  // - ventUp => face
  // - ventDown => down
  // - ventMiddle => face+down
  const labelKey =
    direction === "face" ? "climate.ventUp" : direction === "down" ? "climate.ventDown" : "climate.ventMiddle";
  return (
    <button
      onClick={onSelect}
      className={`flex h-[40px] w-[44px] items-center justify-center rounded-full ring-1 ring-black/5 transition-colors ${
        active
          ? "bg-[var(--active)]"
          : "bg-[var(--panel-soft)] hover:bg-[var(--active)]"
      }`}
      aria-label={t(labelKey)}
      aria-pressed={active}
    >
      <img
        src={direction === "face" ? AIRFLOW_ICON_FACE : direction === "down" ? AIRFLOW_ICON_DOWN : AIRFLOW_ICON_BOTH}
        alt=""
        className={`h-[26px] w-[26px] invert dark:invert-0 purple:invert-0 ${active ? "opacity-100" : "opacity-90"}`}
        draggable={false}
      />
    </button>
  );
}

