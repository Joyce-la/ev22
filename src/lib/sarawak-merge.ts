/**
 * Deep-merge overlay onto base: every leaf in `overlay` replaces the same path in `base`.
 * Arrays and primitives from `overlay` win entirely. Used so Sarawak locale bundles can
 * mirror the full `ms` key tree while keeping every string in Iban / Melanau / Bidayuh / Kelabit.
 */
export function mergeRegionalBase(base: unknown, overlay: unknown): any {
  if (overlay == null || typeof overlay !== "object" || Array.isArray(overlay)) return base;
  if (base == null || typeof base !== "object" || Array.isArray(base)) {
    return JSON.parse(JSON.stringify(overlay));
  }
  const b = JSON.parse(JSON.stringify(base)) as Record<string, unknown>;
  for (const k of Object.keys(overlay as Record<string, unknown>)) {
    if ((overlay as any)[k] === undefined) continue;
    const ov = (overlay as any)[k];
    const cur = b[k];
    if (ov !== null && typeof ov === "object" && !Array.isArray(ov) && cur !== null && typeof cur === "object" && !Array.isArray(cur)) {
      b[k] = mergeRegionalBase(cur, ov);
    } else {
      b[k] = ov;
    }
  }
  return b;
}
