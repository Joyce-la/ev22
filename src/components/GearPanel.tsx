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
  
  // Handle Ctrl+P/D/R/N keyboard shortcuts for gear changes.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toUpperCase();
        if (key === "P" || key === "D" || key === "R" || key === "N") {
          e.preventDefault();
          setGear(key as typeof gear);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setGear]);
  const reversePanelClass = theme === "purple"
    ? "bg-[#3f226a] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-white/30"
    : theme === "dark"
    ? "bg-[var(--panel)] text-white shadow-sm ring-1 ring-white/15"
    : "bg-[var(--panel)] text-foreground shadow-sm ring-1 ring-black/5";
  const reverseIconStripClass = theme === "purple"
    ? "bg-[#4a2a7b] ring-1 ring-white/25"
    : "bg-[var(--panel-soft)]";
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
        "flex h-full w-full flex-col rounded-[24px] px-[10px] py-[10px]",
        reversing
          ? reversePanelClass
          : "bg-[var(--panel)] shadow-sm ring-1 ring-black/5",
      ].join(" ")}
    >
      {/* Top icon row (low / high beam / car) — 4.27:1 ratio */}
      <div
        className={[
          "flex shrink-0 items-center justify-around rounded-full px-[6px]",
          reversing ? reverseIconStripClass : "bg-[var(--panel-soft)]",
        ].join(" ")}
        style={{ height: 38 }}
      >
        {[
          { key: "low" as const, icon: <img src={lowBeamIcon} alt="" className="h-[18px] w-[32px] object-contain" style={beamIconStyle} />, label: t("gear.lowBeam") },
          { key: "high" as const, icon: <img src={highBeamIcon} alt="" className="h-[18px] w-[32px] object-contain" style={beamIconStyle} />, label: t("gear.highBeam") },
          { key: "car" as const, icon: <img src={doorOpen ? doorOpenThemeIcon : doorClosedThemeIcon} alt="" className="h-[18px] w-[30px] object-contain" />, label: t("gear.doors") },
        ].map(({ key, icon, label }) => {
          const active = activeControl === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveControl(key);
                if (key === "car") setDoorOpen((d) => !d);
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
      <div className="mt-[8px] flex shrink-0 items-center justify-between px-[2px]">
        <button onClick={prev} disabled={idx === 0} aria-label={t("gear.previousGear")} className="disabled:opacity-30">
          <svg width="44" height="26" viewBox="0 0 44 26" fill="none">
            <path d="M2 13 L14 4 L14 9 L42 9 L42 17 L14 17 L14 22 Z" fill={idx === 0 ? "#d1d5db88" : "#22c55e"}/>
          </svg>
        </button>
        <span className="min-w-[24px] text-center font-extrabold leading-none text-6xl">{gear}</span>
        <button onClick={next} disabled={idx === GEARS.length - 1} aria-label={t("gear.nextGear")} className="disabled:opacity-30">
          <svg width="44" height="26" viewBox="0 0 44 26" fill="none">
            <path d="M42 13 L30 4 L30 9 L2 9 L2 17 L30 17 L30 22 Z" fill={idx === GEARS.length - 1 ? "#d1d5db" : "#22c55e"}/>
          </svg>
        </button>
      </div>

      {/* PRND vertical list — 143:414 ratio inside */}
      <div className="mt-[12px] flex flex-1 flex-col items-center justify-center gap-[12px]">
        {GEARS.map((g) => {
          const active = g === gear;
          return (
            <button
              key={g}
              disabled
              className={`flex h-[52px] w-[52px] items-center justify-center rounded-full font-medium leading-none transition-all text-5xl cursor-not-allowed ${
                active
                  ? `bg-[var(--active)] ${reversing ? reverseActiveGearClass : "text-foreground ring-2 ring-foreground/15"}`
                  : `${reversing ? reverseMutedTextClass : "text-foreground/85"} opacity-50`
              }`}
              title={t("gear.useCtrlShortcut") || "Use Ctrl+P/D/R/N to change gear"}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Speed area — 261×171 (1.53:1). P=0, R=5 (slow reverse), N=current, D=70 */}
      <div className="shrink-0 pb-[2px] pt-[4px] text-center">
        <div className="flex flex-col items-center justify-center">
          <div className={`font-extrabold leading-none text-[3.4rem] ${reversing ? reverseSpeedTextClass : ""}`}>
            {Math.round(speedKmh)}
          </div>
          <div className={`text-[12px] font-bold tracking-[0.18em] whitespace-normal break-words ${reversing ? reverseSpeedTextClass : "text-foreground/80"}`}>
            {t("gear.kmh")}
          </div>
        </div>
      </div>
    </div>
  );
}
