import { useApp } from "@/lib/app-context";
import { ChevronLeft, ChevronRight, SunMedium } from "lucide-react";
import { useTranslation } from "react-i18next";

export function BrightnessCard() {
  const { t } = useTranslation();
  const { autoBrightness, setAutoBrightness, brightness, setBrightnessManual } = useApp();
  const toggleMode = () => setAutoBrightness(!autoBrightness);
  // `filter: brightness(1)` is neutral; allow manual mode to go above 1 for a visibly brighter screen.
  const MIN = 0.3;
  const MAX = 1.0;
  const STEP = 0.1;
  const dec = () => setBrightnessManual(Math.max(MIN, +(brightness - STEP).toFixed(2)));
  const inc = () => setBrightnessManual(Math.min(MAX, +(brightness + STEP).toFixed(2)));

  return (
    <div className="flex h-full min-h-[120px] w-full items-center justify-around rounded-[28px] bg-app-panel px-[20px] shadow-sm ring-1 ring-black/5">
      <button onClick={dec} className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-app-panel-soft hover:bg-[var(--active)]" aria-label={t("brightness.decrease")}>
        <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
      </button>

      <button
        onClick={toggleMode}
        className={`flex flex-col items-center justify-center rounded-full transition-all ${
          autoBrightness
            ? "bg-[var(--brand)] text-white ring-2 ring-[var(--brand)]/30"
            : "bg-app-panel-soft text-foreground"
        }`}
        style={{ width: 64, height: 64 }}
        aria-label={t("brightness.toggle")}
        title={autoBrightness ? t("brightness.autoToManual") : t("brightness.manualToAuto")}
      >
        <SunMedium className="h-5 w-5" strokeWidth={2} />
        <span
          className="mt-0.5 font-bold leading-none break-words text-center whitespace-normal"
          style={{ fontSize: "clamp(9px, calc(10px * var(--hki-font-scale, 1)), 14px)" }}
        >
          {autoBrightness ? t("brightness.auto") : t("brightness.manual")}
        </span>
      </button>

      <button onClick={inc} className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-app-panel-soft hover:bg-[var(--active)]" aria-label={t("brightness.increase")}>
        <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
      </button>
    </div>
  );
}
