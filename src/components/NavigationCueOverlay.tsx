import type { TFunction } from "i18next";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CornerDownLeft,
  CornerDownRight,
  GitMerge,
  MapPin,
  Navigation,
  RotateCcw,
  Split,
} from "lucide-react";
import type { NavigationCue } from "@/lib/osrm-navigation";

function normMod(mod: string | null): string {
  if (!mod) return "";
  return mod.replace(/\s+/g, " ").trim().toLowerCase();
}

function maneuverActionKey(cue: NavigationCue): string {
  const type = cue.maneuverType.toLowerCase();
  const mod = normMod(cue.maneuverModifier);

  if (type === "arrive") return "map.maneuver.arrive";

  if (type === "roundabout" || type === "rotary") return "map.maneuver.roundabout";

  if (type === "exit roundabout" || type === "exit rotary") return "map.maneuver.exitRoundabout";

  if (type === "merge") return "map.maneuver.merge";

  if (type === "fork") {
    if (mod === "slight left" || mod === "left") return "map.maneuver.forkLeft";
    if (mod === "slight right" || mod === "right") return "map.maneuver.forkRight";
    return "map.maneuver.fork";
  }

  if (type === "end of road") {
    if (mod.includes("left")) return "map.maneuver.turnLeft";
    if (mod.includes("right")) return "map.maneuver.turnRight";
  }

  if (type === "turn" || type === "on ramp" || type === "off ramp") {
    if (mod === "uturn") return "map.maneuver.uturn";
    if (mod === "sharp left") return "map.maneuver.sharpLeft";
    if (mod === "sharp right") return "map.maneuver.sharpRight";
    if (mod === "slight left") return "map.maneuver.slightLeft";
    if (mod === "slight right") return "map.maneuver.slightRight";
    if (mod === "left") return "map.maneuver.turnLeft";
    if (mod === "right") return "map.maneuver.turnRight";
    if (mod === "straight") return "map.maneuver.straight";
  }

  if (type === "continue") return "map.maneuver.straight";

  return "map.maneuver.continue";
}

function formatNavDistance(meters: number, t: TFunction): string {
  const m = Math.max(0, Math.round(meters));
  if (m < 1000) return `${m}\u00a0${t("common.unitM")}`;
  const km = m / 1000;
  const label = km >= 10 ? Math.round(km) : Math.round(km * 10) / 10;
  const num = Number.isInteger(label) ? String(label) : label.toFixed(1);
  return `${num}\u00a0${t("common.unitKm")}`;
}

function CueIcon({ cue, className }: { cue: NavigationCue; className: string }) {
  const type = cue.maneuverType.toLowerCase();
  const mod = normMod(cue.maneuverModifier);

  if (type === "arrive") return <MapPin className={className} strokeWidth={2.4} aria-hidden />;

  if (type === "roundabout" || type === "rotary") return <RotateCcw className={className} strokeWidth={2.4} aria-hidden />;

  if (type === "exit roundabout" || type === "exit rotary")
    return <CornerDownRight className={className} strokeWidth={2.4} aria-hidden />;

  if (type === "merge") return <GitMerge className={className} strokeWidth={2.4} aria-hidden />;

  if (type === "fork") return <Split className={className} strokeWidth={2.4} aria-hidden />;

  if (mod === "uturn") return <RotateCcw className={className} strokeWidth={2.4} aria-hidden />;

  if (mod === "sharp left" || mod === "slight left" || (type === "turn" && mod === "left"))
    return <CornerDownLeft className={className} strokeWidth={2.4} aria-hidden />;

  if (mod === "sharp right" || mod === "slight right" || (type === "turn" && mod === "right"))
    return <CornerDownRight className={className} strokeWidth={2.4} aria-hidden />;

  if (mod === "straight") return <ArrowUp className={className} strokeWidth={2.4} aria-hidden />;

  if (type === "turn" || type === "end of road") {
    if (mod.includes("left")) return <ArrowLeft className={className} strokeWidth={2.4} aria-hidden />;
    if (mod.includes("right")) return <ArrowRight className={className} strokeWidth={2.4} aria-hidden />;
  }

  return <Navigation className={className} strokeWidth={2.4} aria-hidden />;
}

const iconClass = "h-[3.25rem] w-[3.25rem] shrink-0 text-white drop-shadow-sm";

export function NavigationCueOverlay({ cue, t }: { cue: NavigationCue; t: TFunction }) {
  const distLabel = formatNavDistance(cue.distanceMeters, t);
  const street = (cue.streetName ?? "").trim();
  const instruction = t(maneuverActionKey(cue));
  const showStreetLine =
    street.length > 0 && street.toLowerCase() !== instruction.toLowerCase();

  return (
    <div
      className="pointer-events-none absolute left-3 top-3 z-[1250] max-w-[min(320px,calc(100%-24px))] overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/15"
      role="status"
      aria-label={
        cue.maneuverType.toLowerCase() === "arrive"
          ? t("map.navArriveAfterMeters", {
              meters: cue.distanceMeters,
              unit: t("common.unitM"),
            })
          : t("map.navAfterMeters", {
              action: instruction,
              meters: cue.distanceMeters,
              unit: t("common.unitM"),
            })
      }
    >
      <div className="flex min-h-[5.25rem] items-center gap-4 bg-black px-4 py-3.5 text-white">
        <CueIcon cue={cue} className={iconClass} />
        <span className="min-w-0 text-4xl font-extrabold tabular-nums leading-none tracking-tight">{distLabel}</span>
      </div>
      <div className="border-t border-white/10 bg-zinc-800 px-4 py-3">
        <p className="text-[15px] font-semibold leading-snug text-white">{instruction}</p>
        {showStreetLine ? (
          <p className="mt-1 line-clamp-2 text-xs font-medium leading-snug text-white/75">{street}</p>
        ) : null}
      </div>
    </div>
  );
}
