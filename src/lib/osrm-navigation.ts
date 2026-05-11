export type NavigationCue = {
  distanceMeters: number;
  maneuverType: string;
  maneuverModifier: string | null;
  /** OSRM step `name` (road to enter / current way), when provided. */
  streetName?: string;
  /** OSRM `maneuver.exit` (1-based exit count) for roundabout / rotary. */
  roundaboutExit?: number;
  /** Road name on the leg’s next `exit roundabout` step, when known. */
  roundaboutExitOnto?: string;
};

/** OSRM maneuver along the leg with distance from route start to the maneuver point. */
export type NavigationManeuver = {
  atRouteMeters: number;
  maneuverType: string;
  maneuverModifier: string | null;
  streetName?: string;
  roundaboutExit?: number;
  roundaboutExitOnto?: string;
};

export type ParsedNavigationLeg = {
  maneuvers: NavigationManeuver[];
  legDistanceMeters: number;
};

const R_EARTH_M = 6_371_000;

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const r1 = (lat1 * Math.PI) / 180;
  const r2 = (lat2 * Math.PI) / 180;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(r1) * Math.cos(r2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R_EARTH_M * c;
}

/** Cumulative distance along polyline [lat,lng][] from the start to `targetMeters`, clamped. */
export function positionAlongPolyline(
  line: Array<[number, number]>,
  targetMeters: number,
): { lat: number; lng: number } {
  if (line.length === 0) return { lat: 0, lng: 0 };
  if (line.length === 1) return { lat: line[0][0], lng: line[0][1] };
  let remaining = Math.max(0, targetMeters);
  for (let i = 0; i < line.length - 1; i++) {
    const [lat1, lng1] = line[i];
    const [lat2, lng2] = line[i + 1];
    const seg = haversineMeters(lat1, lng1, lat2, lng2);
    if (seg < 0.5) continue;
    if (remaining <= seg) {
      const t = remaining / seg;
      return {
        lat: lat1 + (lat2 - lat1) * t,
        lng: lng1 + (lng2 - lng1) * t,
      };
    }
    remaining -= seg;
  }
  const last = line[line.length - 1];
  return { lat: last[0], lng: last[1] };
}

/** Polyline length in meters (WGS84 great-circle segments). */
export function polylineLengthMeters(line: Array<[number, number]>): number {
  if (line.length < 2) return 0;
  let sum = 0;
  for (let i = 0; i < line.length - 1; i++) {
    const [a, b] = line[i];
    const [c, d] = line[i + 1];
    sum += haversineMeters(a, b, c, d);
  }
  return sum;
}

/**
 * Points from `startMeters` along the polyline to the end (for “remaining route” drawing).
 * Returns `[]` when `startMeters` reaches the end; at least two vertices when non-empty.
 */
export function polylineSuffixFromMeters(
  line: Array<[number, number]>,
  startMeters: number,
): Array<[number, number]> {
  if (line.length < 2) return line.length === 1 ? [[line[0][0], line[0][1]]] : [];
  const total = polylineLengthMeters(line);
  if (total <= 0) return [];
  const start = Math.max(0, startMeters);
  if (start >= total - 0.25) return [];

  let remaining = start;
  for (let i = 0; i < line.length - 1; i++) {
    const [lat1, lng1] = line[i];
    const [lat2, lng2] = line[i + 1];
    const seg = haversineMeters(lat1, lng1, lat2, lng2);
    if (seg < 0.5) continue;
    if (remaining <= seg) {
      const t = remaining / seg;
      const slat = lat1 + (lat2 - lat1) * t;
      const slng = lng1 + (lng2 - lng1) * t;
      const tail = (line.slice(i + 1) as Array<[number, number]>).filter(
        (pt) => haversineMeters(slat, slng, pt[0], pt[1]) > 0.75,
      );
      const out: Array<[number, number]> =
        tail.length > 0 ? [[slat, slng], ...tail] : [[slat, slng], [lat2, lng2]];
      return out.length >= 2 ? out : [];
    }
    remaining -= seg;
  }
  return [];
}

const SKIP_MANEUVER = new Set(["depart", "continue", "new name", "notification"]);

/** OSRM leg `duration` in seconds (driving-time estimate for the leg). */
export function readOsrmLegDurationSeconds(osrmRouteJson: unknown): number | undefined {
  const d = (osrmRouteJson as { routes?: Array<{ legs?: Array<{ duration?: unknown }> }> })?.routes?.[0]
    ?.legs?.[0]?.duration;
  const n = typeof d === "number" ? d : typeof d === "string" ? Number(d) : NaN;
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Distance cap used for nav progress (matches polyline vs OSRM leg length). */
export function navProgressCapMeters(
  routeLine: Array<[number, number]>,
  legDistanceMeters: number | undefined,
): number {
  const poly = polylineLengthMeters(routeLine);
  if (poly <= 0) return 0;
  return legDistanceMeters != null && legDistanceMeters > 0 ? legDistanceMeters : poly;
}

/** Remaining driving-time estimate (seconds) from simulated progress along the route. */
export function navRemainingDurationSeconds(
  legDurationSec: number,
  traveledMeters: number,
  routeLine: Array<[number, number]>,
  legDistanceMeters: number | undefined,
): number {
  const cap = navProgressCapMeters(routeLine, legDistanceMeters);
  if (cap <= 0 || legDurationSec <= 0) return 0;
  const t = Math.min(Math.max(0, traveledMeters), cap);
  return Math.max(0, legDurationSec * (1 - t / cap));
}

function readManeuverExit(raw: unknown): number | undefined {
  const ex = (raw as { maneuver?: { exit?: unknown } })?.maneuver?.exit;
  const n = typeof ex === "number" ? ex : typeof ex === "string" ? Number(ex) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.round(n) : undefined;
}

/** Name of the way after leaving the roundabout (next `exit roundabout` / `exit rotary` step). */
function peekRoundaboutExitOnto(steps: unknown[], fromStepIndex: number): string | undefined {
  for (let j = fromStepIndex + 1; j < steps.length; j++) {
    const step = steps[j] as { maneuver?: { type?: string }; name?: string };
    const t = String(step.maneuver?.type ?? "").toLowerCase();
    if (t === "exit roundabout" || t === "exit rotary") {
      const name = typeof step.name === "string" ? step.name.trim() : "";
      return name || undefined;
    }
  }
  return undefined;
}

/**
 * All announceable maneuvers in order, plus OSRM `arrive` at the leg end.
 * `atRouteMeters` is distance along the route from the origin to the maneuver point.
 */
export function parseNavigationLeg(osrmRouteJson: unknown): ParsedNavigationLeg | null {
  const leg = (osrmRouteJson as { routes?: Array<{ legs?: Array<{ steps?: unknown[]; distance?: number }> }> })
    ?.routes?.[0]?.legs?.[0];
  const steps = leg?.steps;
  if (!Array.isArray(steps) || steps.length === 0) return null;

  const legDistanceRaw = Number(leg?.distance);
  const legDistanceMeters = Number.isFinite(legDistanceRaw) && legDistanceRaw > 0 ? legDistanceRaw : 0;

  const maneuvers: NavigationManeuver[] = [];
  let cum = 0;

  for (let i = 0; i < steps.length; i++) {
    const raw = steps[i];
    const step = raw as {
      distance?: number;
      name?: string;
      maneuver?: { type?: string; modifier?: string; exit?: unknown };
    };
    const m = step?.maneuver;
    const type = String(m?.type ?? "").toLowerCase();
    const dist = Number(step?.distance);
    const safeDist = Number.isFinite(dist) ? dist : 0;
    const wayName = typeof step.name === "string" ? step.name.trim() : "";

    if (SKIP_MANEUVER.has(type)) {
      cum += safeDist;
      continue;
    }

    if (type === "arrive") {
      maneuvers.push({
        atRouteMeters: cum,
        maneuverType: "arrive",
        maneuverModifier: null,
        streetName: wayName || undefined,
      });
      break;
    }

    const isRb = type === "roundabout" || type === "rotary";
    const exitN = isRb ? readManeuverExit(raw) : undefined;
    const exitOnto = isRb ? peekRoundaboutExitOnto(steps, i) : undefined;

    maneuvers.push({
      atRouteMeters: cum,
      maneuverType: type,
      maneuverModifier: m?.modifier != null ? String(m.modifier) : null,
      streetName: wayName || undefined,
      ...(exitN != null ? { roundaboutExit: exitN } : {}),
      ...(exitOnto ? { roundaboutExitOnto: exitOnto } : {}),
    });
    cum += safeDist;
  }

  const last = maneuvers[maneuvers.length - 1];
  if (!last || last.maneuverType.toLowerCase() !== "arrive") {
    maneuvers.push({
      atRouteMeters: cum,
      maneuverType: "arrive",
      maneuverModifier: null,
    });
  }

  return { maneuvers, legDistanceMeters: legDistanceMeters || cum };
}

/** Current cue for a position `traveledMeters` along the route (0 = origin). */
export function resolveNavigationCue(
  leg: ParsedNavigationLeg,
  traveledMeters: number,
): NavigationCue | null {
  const cap = Math.max(0, leg.legDistanceMeters);
  const traveled = Math.min(Math.max(0, traveledMeters), cap);
  const nonArrive = leg.maneuvers.filter((m) => m.maneuverType.toLowerCase() !== "arrive");
  const arrive = leg.maneuvers.find((m) => m.maneuverType.toLowerCase() === "arrive");

  for (const m of nonArrive) {
    const remaining = m.atRouteMeters - traveled;
    if (remaining > 0) {
      return {
        distanceMeters: Math.max(0, Math.round(remaining)),
        maneuverType: m.maneuverType,
        maneuverModifier: m.maneuverModifier,
        streetName: m.streetName,
        ...(m.roundaboutExit != null ? { roundaboutExit: m.roundaboutExit } : {}),
        ...(m.roundaboutExitOnto ? { roundaboutExitOnto: m.roundaboutExitOnto } : {}),
      };
    }
  }

  if (arrive) {
    return {
      distanceMeters: Math.max(0, Math.round(cap - traveled)),
      maneuverType: "arrive",
      maneuverModifier: null,
      streetName: arrive.streetName,
    };
  }

  return null;
}

/** First meaningful OSRM leg step after travel (skip depart / continue / new name). */
export function parseNextNavigationCue(osrmRouteJson: unknown): NavigationCue | null {
  const steps = (osrmRouteJson as { routes?: Array<{ legs?: Array<{ steps?: unknown[] }> }> })?.routes?.[0]
    ?.legs?.[0]?.steps;
  if (!Array.isArray(steps) || steps.length === 0) return null;

  let cumMeters = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i] as {
      distance?: number;
      name?: string;
      maneuver?: { type?: string; modifier?: string; exit?: unknown };
    };
    const m = step?.maneuver;
    const type = String(m?.type ?? "");
    const typeLower = type.toLowerCase();
    const dist = Number(step?.distance);
    const safeDist = Number.isFinite(dist) ? dist : 0;

    if (type === "depart") {
      cumMeters += safeDist;
      continue;
    }

    if (type === "continue" || type === "new name" || type === "notification") {
      cumMeters += safeDist;
      continue;
    }

    const wayName = typeof step.name === "string" ? step.name.trim() : "";

    if (type === "arrive") {
      return {
        distanceMeters: Math.max(0, Math.round(cumMeters)),
        maneuverType: "arrive",
        maneuverModifier: null,
        streetName: wayName || undefined,
      };
    }

    const isRb = typeLower === "roundabout" || typeLower === "rotary";
    const exitN = isRb ? readManeuverExit(steps[i]) : undefined;
    const exitOnto = isRb ? peekRoundaboutExitOnto(steps, i) : undefined;

    return {
      distanceMeters: Math.max(0, Math.round(cumMeters)),
      maneuverType: type,
      maneuverModifier: m?.modifier != null ? String(m.modifier) : null,
      streetName: wayName || undefined,
      ...(exitN != null ? { roundaboutExit: exitN } : {}),
      ...(exitOnto ? { roundaboutExitOnto: exitOnto } : {}),
    };
  }

  return null;
}
