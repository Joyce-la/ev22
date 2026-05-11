import type { TFunction } from "i18next";
import {
  ArrowUp,
  CornerDownLeft,
  CornerDownRight,
  GitMerge,
  MapPin,
  Navigation,
  RotateCw,
  Split,
  Undo2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
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

/** Primary line for the cue (handles roundabout exit copy vs generic maneuver keys). */
function maneuverInstruction(
  cue: NavigationCue,
  t: TFunction,
  hasRoundaboutTakeExitKey: boolean,
): string {
  const type = cue.maneuverType.toLowerCase();
  if (type === "roundabout" || type === "rotary") {
    const ex = cue.roundaboutExit;
    if (ex != null && ex > 0) {
      if (hasRoundaboutTakeExitKey) return t("map.maneuver.roundaboutTakeExit", { exit: ex });
      return `${t("map.maneuver.roundabout")} ${ex}`;
    }
    return t("map.maneuver.roundabout");
  }
  return t(maneuverActionKey(cue));
}

function formatNavDistance(meters: number, t: TFunction): string {
  const m = Math.max(0, Math.round(meters));
  if (m < 1000) return `${m}\u00a0${t("common.unitM")}`;
  const km = m / 1000;
  const label = km >= 10 ? Math.round(km) : Math.round(km * 10) / 10;
  const num = Number.isInteger(label) ? String(label) : label.toFixed(1);
  return `${num}\u00a0${t("common.unitKm")}`;
}

function englishOrdinal(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n}st`;
  if (mod10 === 2 && mod100 !== 12) return `${n}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${n}rd`;
  return `${n}th`;
}

function roundaboutPrimaryInstruction(cue: NavigationCue, t: TFunction, language: string): string {
  const exit = cue.roundaboutExit;
  if (exit != null && exit > 0) {
    if (language.toLowerCase().startsWith("en")) return `Take the ${englishOrdinal(exit)} exit`;
    return t("map.maneuver.roundaboutTakeExit", { exit });
  }
  return t("map.maneuver.roundabout");
}


function TurnArrowIcon({
  direction,
  variant = "turn",
  className,
}: {
  direction: "left" | "right";
  variant?: "turn" | "slight";
  className: string;
}) {
  const isRight = direction === "right";
  const turnPath =
    variant === "slight"
      ? isRight
        ? "M9 20v-4.5c0-2.8 1.4-4.8 4.2-6.2L20 6"
        : "M15 20v-4.5c0-2.8-1.4-4.8-4.2-6.2L4 6"
      : isRight
        ? "M8 20v-8a4 4 0 0 1 4-4h8"
        : "M16 20v-8a4 4 0 0 0-4-4H4";
  const headPath =
    variant === "slight"
      ? isRight
        ? "M16 5h4v4"
        : "M8 5H4v4"
      : isRight
        ? "m16 4 4 4-4 4"
        : "m8 4-4 4 4 4";

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g className="stroke-current" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d={turnPath} />
        <path d={headPath} />
      </g>
    </svg>
  );
}

function RoundaboutIcon({ cue, className }: { cue: NavigationCue; className: string }) {
  const exitNumber =
    cue.roundaboutExit != null && cue.roundaboutExit > 0
      ? String(Math.round(cue.roundaboutExit))
      : null;

  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      aria-hidden
    >
      <RotateCw className="h-full w-full" strokeWidth={2.4} aria-hidden />
      {exitNumber ? (
        <span className="absolute -right-1 -top-1 flex h-[1.4rem] min-w-[1.4rem] items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-extrabold leading-none text-background shadow-md ring-2 ring-background">
          {exitNumber}
        </span>
      ) : null}
    </span>
  );
}

function CueIcon({ cue, className }: { cue: NavigationCue; className: string }) {
  const type = cue.maneuverType.toLowerCase();
  const mod = normMod(cue.maneuverModifier);

  if (type === "arrive") return <MapPin className={className} strokeWidth={2.4} aria-hidden />;

  if (type === "roundabout" || type === "rotary")
    return <RoundaboutIcon cue={cue} className={className} />;

  if (type === "exit roundabout" || type === "exit rotary")
    return <CornerDownRight className={className} strokeWidth={2.4} aria-hidden />;

  if (type === "merge") return <GitMerge className={className} strokeWidth={2.4} aria-hidden />;

  if (type === "fork") return <Split className={className} strokeWidth={2.4} aria-hidden />;

  if (mod === "uturn") return <Undo2 className={className} strokeWidth={2.4} aria-hidden />;

  if (mod === "slight left")
    return <TurnArrowIcon direction="left" variant="slight" className={className} />;

  if (mod === "slight right")
    return <TurnArrowIcon direction="right" variant="slight" className={className} />;

  if (mod === "sharp left" || (type === "turn" && mod === "left"))
    return <TurnArrowIcon direction="left" className={className} />;

  if (mod === "sharp right" || (type === "turn" && mod === "right"))
    return <TurnArrowIcon direction="right" className={className} />;

  if (mod === "straight") return <ArrowUp className={className} strokeWidth={2.4} aria-hidden />;

  if (type === "turn" || type === "end of road") {
    if (mod.includes("left")) return <TurnArrowIcon direction="left" className={className} />;
    if (mod.includes("right")) return <TurnArrowIcon direction="right" className={className} />;
  }

  return <Navigation className={className} strokeWidth={2.4} aria-hidden />;
}

const iconClassOverlay = "h-[3.25rem] w-[3.25rem] shrink-0 text-[var(--brand)] drop-shadow-sm";
const iconClassPanel = "h-11 w-11 shrink-0 text-[var(--brand)] drop-shadow-sm";

export function NavigationCueOverlay({
  cue,
  t,
  variant = "overlay",
}: {
  cue: NavigationCue;
  t: TFunction;
  /** `overlay` = on-map HUD; `panel` = bottom row slot (replaces climate card on map page). */
  variant?: "overlay" | "panel";
}) {
  const { i18n } = useTranslation();
  const lng = i18n.resolvedLanguage || i18n.language;
  const hasRoundaboutTakeExitKey = i18n.exists("map.maneuver.roundaboutTakeExit", {
    lng,
    fallbackLng: false,
  });
  const hasRoundaboutOntoKey = i18n.exists("map.maneuver.roundaboutOnto", {
    lng,
    fallbackLng: false,
  });
  const distLabel = formatNavDistance(cue.distanceMeters, t);
  const street = (cue.streetName ?? "").trim();
  const cueType = cue.maneuverType.toLowerCase();
  const isRoundaboutCue = cueType === "roundabout" || cueType === "rotary";
  const instruction = isRoundaboutCue
    ? roundaboutPrimaryInstruction(cue, t, lng)
    : maneuverInstruction(cue, t, hasRoundaboutTakeExitKey);
  const roundaboutExitDetail =
    isRoundaboutCue &&
    cue.roundaboutExit != null &&
    cue.roundaboutExit > 0 &&
    hasRoundaboutTakeExitKey &&
    !lng.toLowerCase().startsWith("en")
      ? t("map.maneuver.roundaboutTakeExit", { exit: cue.roundaboutExit })
      : "";
  const onto = (cue.roundaboutExitOnto ?? "").trim();
  const ontoLabel = hasRoundaboutOntoKey
    ? t("map.maneuver.roundaboutOnto", { road: onto })
    : `${t("map.maneuver.exitRoundabout")}: ${onto}`;
  const showRoundaboutExitDetail =
    roundaboutExitDetail.length > 0 &&
    roundaboutExitDetail.toLowerCase() !== instruction.toLowerCase();
  const showOntoLine = onto.length > 0;
  const showStreetLine =
    street.length > 0 &&
    street.toLowerCase() !== instruction.toLowerCase() &&
    (!showOntoLine || street.toLowerCase() !== onto.toLowerCase());
  const actionLabel = [instruction, roundaboutExitDetail, showOntoLine ? ontoLabel : ""]
    .filter((part) => part.length > 0)
    .join(". ");

  const ariaLabel =
    cueType === "arrive"
      ? t("map.navArriveAfterMeters", {
          meters: cue.distanceMeters,
          unit: t("common.unitM"),
        })
      : t("map.navAfterMeters", {
          action: actionLabel || instruction,
          meters: cue.distanceMeters,
          unit: t("common.unitM"),
        });

  const shell =
    variant === "panel"
      ? "pointer-events-none relative z-[1] flex h-full min-h-[120px] w-full min-w-0 flex-col overflow-hidden rounded-[28px] bg-app-panel text-foreground shadow-sm ring-1 ring-black/5"
      : "pointer-events-none absolute left-3 top-3 z-[1250] max-w-[min(320px,calc(100%-24px))] overflow-hidden rounded-2xl bg-app-panel/95 text-foreground shadow-xl ring-1 ring-black/10 backdrop-blur-md dark:ring-white/10 purple:ring-[oklch(0.9_0.05_300/0.35)]";

  const topRow =
    variant === "panel"
      ? "flex min-h-0 flex-1 items-center gap-3 bg-app-panel-soft px-3 py-2"
      : "flex min-h-[5.25rem] items-center gap-4 bg-app-panel-soft px-4 py-3.5";

  const bottomRow =
    variant === "panel"
      ? "shrink-0 border-t border-border/80 bg-app-panel px-3 py-2"
      : "border-t border-border/80 bg-app-panel px-4 py-3";

  const distClass =
    variant === "panel"
      ? "min-w-0 text-3xl font-extrabold tabular-nums leading-none tracking-tight text-foreground"
      : "min-w-0 text-4xl font-extrabold tabular-nums leading-none tracking-tight text-foreground";

  const instructionClass =
    variant === "panel"
      ? "text-sm font-semibold leading-snug text-foreground"
      : "text-[15px] font-semibold leading-snug text-foreground";

  const streetClass =
    variant === "panel"
      ? "mt-0.5 line-clamp-1 text-[11px] font-medium leading-snug text-muted-foreground"
      : "mt-1 line-clamp-2 text-xs font-medium leading-snug text-muted-foreground";

  return (
    <div className={shell} role="status" aria-label={ariaLabel}>
      <div className={topRow}>
        <CueIcon cue={cue} className={variant === "panel" ? iconClassPanel : iconClassOverlay} />
        <span className={distClass}>{distLabel}</span>
      </div>
      <div className={bottomRow}>
        <p className={instructionClass}>{instruction}</p>
        {showRoundaboutExitDetail ? <p className={streetClass}>{roundaboutExitDetail}</p> : null}
        {showOntoLine ? <p className={streetClass}>{ontoLabel}</p> : null}
        {showStreetLine ? <p className={streetClass}>{street}</p> : null}
      </div>
    </div>
  );
}
