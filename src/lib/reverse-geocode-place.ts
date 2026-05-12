/**
 * Reverse-geocode current GPS position for the map “current location” card.
 * Uses in-memory + sessionStorage cache and single-flight dedup so the UI can
 * show a place name immediately on revisit and duplicate mounts don’t hammer Nominatim.
 */

export type PlaceLabel = {
  primary: string;
  secondary: string;
};

const MEMORY = new Map<string, PlaceLabel>();
const INFLIGHT = new Map<string, Promise<PlaceLabel>>();
const STORAGE_PREFIX = "ev22.revgeo.v1";

export function coordKey(lat: number, lng: number): string {
  return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}

export function placeLabelCacheKey(origin: { lat: number; lng: number }, uiLang: string): string {
  return `${coordKey(origin.lat, origin.lng)}|${uiLang}`;
}

/** Map UI language codes to Nominatim’s preferred Accept-Language tags. */
export function nominatimAcceptLanguage(uiLang: string): string {
  const low = uiLang.toLowerCase().replace("_", "-");
  const map: Record<string, string> = {
    iba: "ms",
    melanau: "ms",
    bidayuh: "ms",
    kelabit: "ms",
    "zh-hans": "zh-CN",
    "zh-hant": "zh-TW",
  };
  return map[low] ?? uiLang.replace("_", "-");
}

function readStorage(key: string): PlaceLabel | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}:${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlaceLabel;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: PlaceLabel) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value));
  } catch {
    /* quota / private mode */
  }
}

function parseNominatimJson(j: {
  name?: string;
  display_name?: string;
  address?: Record<string, string>;
}): PlaceLabel | null {
  const addr = j.address ?? {};
  const primary =
    addr.road ||
    addr.pedestrian ||
    addr.cycleway ||
    addr.footway ||
    addr.path ||
    addr.amenity ||
    addr.building ||
    addr.suburb ||
    addr.neighbourhood ||
    addr.hamlet ||
    j.name ||
    j.display_name?.split(",")[0]?.trim() ||
    "";
  const cityParts = [
    addr.city || addr.town || addr.village || addr.municipality || addr.county,
    addr.state || addr.region || addr.province,
  ].filter((part): part is string => Boolean(part && part.trim().length > 0));
  const secondary = cityParts.join(", ");
  if (!primary && !secondary) return null;
  return { primary, secondary };
}

/** Synchronous read — used for instant paint when cache already warm. */
export function readCachedPlaceLabel(
  origin: { lat: number; lng: number },
  uiLang: string,
): PlaceLabel | null {
  const key = placeLabelCacheKey(origin, uiLang);
  const mem = MEMORY.get(key);
  if (mem && (mem.primary || mem.secondary)) return mem;
  const stor = readStorage(key);
  if (stor && (stor.primary || stor.secondary)) {
    MEMORY.set(key, stor);
    return stor;
  }
  return null;
}

function fetchPlaceLabel(origin: { lat: number; lng: number }, uiLang: string): Promise<PlaceLabel> {
  const acceptLang = nominatimAcceptLanguage(uiLang);
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${origin.lat}&lon=${origin.lng}&zoom=16&addressdetails=1`;
  return fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Language": acceptLang,
    },
  })
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    })
    .then((j) => parseNominatimJson(j))
    .then((label) => label ?? { primary: "", secondary: "" });
}

/**
 * Returns a human-readable place label; caches successes.
 * Concurrent callers with the same key share one HTTP request.
 */
export function resolvePlaceLabel(origin: { lat: number; lng: number }, uiLang: string): Promise<PlaceLabel> {
  const key = placeLabelCacheKey(origin, uiLang);

  const cached = readCachedPlaceLabel(origin, uiLang);
  if (cached) return Promise.resolve(cached);

  let inflight = INFLIGHT.get(key);
  if (!inflight) {
    inflight = fetchPlaceLabel(origin, uiLang).then((label) => {
      if (label.primary || label.secondary) {
        MEMORY.set(key, label);
        writeStorage(key, label);
      }
      return label;
    });
    inflight.finally(() => {
      INFLIGHT.delete(key);
    });
    INFLIGHT.set(key, inflight);
  }
  return inflight;
}

/** Warm cache early (e.g. from MapPage) so the bottom card often skips “loading”. */
export function prefetchPlaceLabel(origin: { lat: number; lng: number } | null, uiLang: string): void {
  if (!origin) return;
  void resolvePlaceLabel(origin, uiLang);
}
