import { useApp } from "@/lib/app-context";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import lowBeamIcon from "@/assets/low-beam.png";
import highBeamIcon from "@/assets/high-beam.png";
import doorClosedCustomIcon from "@/assets/door-open-custom.png";
import doorOpenCustomIcon from "@/assets/door-close-custom.png";
import doorClosedWhiteIcon from "@/assets/door-closed-white.png";

const GEARS = ["P", "R", "N", "D"] as const;

/**
 * Gear panel — based on 428×724 reference.
 * Sub-areas: icon row 388×91 (4.27:1), PRND list 143×414, speed 261×171.
 */
export function GearPanel() {
  const { t } = useTranslation();
  const { gear, setGear, theme, speedKmh, setSpeedKmh } = useApp();
  const navigate = useNavigate();
  const [activeControl, setActiveControl] = useState<"low" | "high" | "car">("car");
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [flashlightLevel, setFlashlightLevel] = useState<"low" | "high">("low");
  const [doorOpen, setDoorOpen] = useState(false);
  const idx = GEARS.indexOf(gear);
  const prev = () => idx > 0 && setGear(GEARS[idx - 1]);
  const next = () => idx < GEARS.length - 1 && setGear(GEARS[idx + 1]);
  const reversing = gear === "R";
  // Keep speed in sync with the displayed demo speed.
  useEffect(() => {
    const next = gear === "P" ? 0 : gear === "R" ? 5 : gear === "N" ? 0 : 70;
    setSpeedKmh(next);
  }, [gear, setSpeedKmh]);
  const reversePanelClass = theme === "purple"
    ? "bg-[#3f226a] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-white/30"
    : theme === "dark"
    ? "bg-app-panel text-white shadow-sm ring-1 ring-white/15"
    : "bg-app-panel text-foreground shadow-sm ring-1 ring-black/5";
  const reverseIconStripClass = theme === "purple"
    ? "bg-[#4a2a7b] ring-1 ring-white/25"
    : "bg-app-panel-soft";
  const reverseActiveControlClass = theme === "purple" ? "bg-[#8f47ba]" : "bg-[var(--active)]";
  const reverseActiveGearClass = theme === "purple"
    ? "text-white ring-2 ring-[#8f47ba] shadow-[0_0_0_2px_rgba(255,255,255,0.2)]"
    : theme === "dark"
    ? "text-white ring-2 ring-white/30"
    : "text-foreground ring-2 ring-foreground/15";
  const reverseMutedTextClass = theme === "light" ? "text-foreground/85" : "text-white/90";
  const reverseSpeedTextClass = theme === "light" ? "text-foreground/85" : "text-white/90";
  const beamIconStyle = theme === "dark" || theme === "purple" ? { filter: "brightness(0) invert(1)" } : undefined;
  const doorClosedThemeIcon = (theme === "dark" || theme === "purple") ? doorClosedWhiteIcon : doorOpenCustomIcon;
  const doorOpenThemeIcon = doorClosedCustomIcon;

  return (
    <div
      className={[
        "grid h-full w-full grid-rows-[auto_auto_1fr_auto] rounded-[24px] px-[10px] py-[10px] overflow-hidden",
        reversing
          ? reversePanelClass
          : "bg-app-panel shadow-sm ring-1 ring-black/5",
      ].join(" ")}
    >
      {/* Top icon row (low / high beam / car) — 4.27:1 ratio */}
      <div
        className={[
          "flex shrink-0 items-center justify-around rounded-full px-[6px]",
          reversing ? reverseIconStripClass : "bg-app-panel-soft",
        ].join(" ")}
        style={{ height: 38 }}
      >
        {[
          { key: "low" as const, icon: <img src={lowBeamIcon} alt="" className="h-[18px] w-[32px] object-contain" style={beamIconStyle} />, label: t("gear.flashlightLow") },
          { key: "high" as const, icon: <img src={highBeamIcon} alt="" className="h-[18px] w-[32px] object-contain" style={beamIconStyle} />, label: t("gear.flashlightHigh") },
          { key: "car" as const, icon: <img src={doorOpen ? doorOpenThemeIcon : doorClosedThemeIcon} alt="" className="h-[18px] w-[30px] object-contain" />, label: t("gear.doors") },
        ].map(({ key, icon, label }) => {
          const active = key === "car"
            ? activeControl === "car"
            : flashlightOn && flashlightLevel === key;

          return (
            <button
              type="button"
              key={key}
              onClick={() => {
                if (key === "car") {
                  setActiveControl(key);
                  setDoorOpen((d) => !d);
                  return;
                }
                const nextLevel = key as "low" | "high";
                if (flashlightOn && flashlightLevel === nextLevel) {
                  setFlashlightOn(false);
                  setActiveControl("car");
                } else {
                  setFlashlightOn(true);
                  setFlashlightLevel(nextLevel);
                  setActiveControl(nextLevel);
                }
              }}
              className={`flex h-[28px] flex-1 items-center justify-center rounded-full transition mx-[2px] ${
                active
                  ? reversing
                    ? reverseActiveControlClass
                    : "bg-[var(--active)]"
                  : "hover:bg-[var(--active)]/60"
              }`}
              aria-label={label}
              title={key === "car" ? (doorOpen ? t("gear.doorOpenTitle") : t("gear.doorClosedTitle")) : label}
            >
              {icon}
            </button>
          );
        })}
      </div>

      {/* Current gear with arrows */}
      <div className="mt-[6px] flex shrink-0 items-center justify-between px-[2px]">
        <button
          type="button"
          disabled
          aria-label={t("gear.previousGear")}
          title={t("gear.useCtrlShortcut")}
          className={idx === 0 ? "opacity-30 cursor-default" : "opacity-100 cursor-default"}
        >
          <svg width="44" height="26" viewBox="0 0 44 26" fill="none">
            <path d="M2 13 L14 4 L14 9 L42 9 L42 17 L14 17 L14 22 Z" fill={idx === 0 ? "#d1d5db88" : "#22c55e"}/>
          </svg>
        </button>
        <span
          className="min-w-[24px] text-center font-extrabold leading-none"
          style={{ fontSize: "clamp(44px, calc(56px * var(--hki-font-scale, 1)), 70px)" }}
        >
          {gear}
        </span>
        <button
          type="button"
          disabled
          aria-label={t("gear.nextGear")}
          title={t("gear.useCtrlShortcut")}
          className={idx === GEARS.length - 1 ? "opacity-30 cursor-default" : "opacity-100 cursor-default"}
        >
          <svg width="44" height="26" viewBox="0 0 44 26" fill="none">
            <path d="M42 13 L30 4 L30 9 L2 9 L2 17 L30 17 L30 22 Z" fill={idx === GEARS.length - 1 ? "#d1d5db" : "#22c55e"}/>
          </svg>
        </button>
      </div>

      {/* PRND vertical list — 143:414 ratio inside */}
      <div className="mt-[8px] flex min-h-0 flex-col items-center justify-center gap-[clamp(6px,1.2vh,10px)]">
        {GEARS.map((g) => {
          const active = g === gear;
          return (
            <button
              type="button"
              key={g}
              disabled
              className={`grid place-items-center overflow-hidden rounded-full font-medium transition-all cursor-not-allowed ${
                active
                  ? `bg-[var(--active)] ${reversing ? reverseActiveGearClass : "text-foreground ring-2 ring-foreground/15"}`
                  : `${reversing ? reverseMutedTextClass : "text-foreground/85"} opacity-50`
              }`}
              title={t("gear.useCtrlShortcut")}
              style={{
                width: "clamp(44px, calc(48px * var(--hki-font-scale, 1)), 56px)",
                height: "clamp(44px, calc(48px * var(--hki-font-scale, 1)), 56px)",
              }}
            >
              <span
                className="relative top-[1px] block leading-none"
                style={{ fontSize: "clamp(29px, calc(33px * var(--hki-font-scale, 1)), 42px)" }}
              >
                {g}
              </span>
            </button>
          );
        })}
      </div>

      {/* Speed area — 261×171 (1.53:1). P=0, R=5 (slow reverse), N=current, D=70 */}
      <div className="shrink-0 pb-[2px] pt-[2px] text-center">
        <div className="flex flex-col items-center justify-center">
          <div
            className={`font-extrabold leading-none ${reversing ? reverseSpeedTextClass : ""}`}
            style={{ fontSize: "clamp(40px, calc(52px * var(--hki-font-scale, 1)), 64px)" }}
          >
            {Math.round(speedKmh)}
          </div>
          <div className={`max-w-full text-center text-[12px] font-bold tracking-[0.08em] whitespace-normal break-words leading-tight ${reversing ? reverseSpeedTextClass : "text-foreground/80"}`}>
            {t("gear.kmh")}
          </div>
        </div>
      </div>
    </div>
  );
}
