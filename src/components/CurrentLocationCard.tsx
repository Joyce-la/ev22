import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { readCachedPlaceLabel, resolvePlaceLabel } from "@/lib/reverse-geocode-place";

type LatLng = { lat: number; lng: number } | null;

/**
 * Bottom-row card on the navigation page that shows where the driver *is*
 * (reverse-geocoded). Copy follows the active display language via `t()`;
 * address lines follow `Accept-Language` on the geocoder request.
 */
export function CurrentLocationCard({ origin }: { origin: LatLng }) {
  const { t, i18n } = useTranslation();
  const lng = i18n.resolvedLanguage || i18n.language || "en";

  const [address, setAddress] = useState(() =>
    origin ? readCachedPlaceLabel(origin, lng) : null,
  );
  const [loading, setLoading] = useState(() =>
    Boolean(origin && !readCachedPlaceLabel(origin, lng)),
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!origin) {
      setAddress(null);
      setLoading(false);
      setFailed(false);
      return;
    }

    const cached = readCachedPlaceLabel(origin, lng);
    if (cached) {
      setAddress(cached);
      setLoading(false);
      setFailed(false);
    } else {
      setAddress(null);
      setLoading(true);
      setFailed(false);
    }

    let cancelled = false;
    resolvePlaceLabel(origin, lng).then((label) => {
      if (cancelled) return;
      if (label.primary || label.secondary) {
        setAddress(label);
        setFailed(false);
      } else {
        setFailed(true);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [origin, lng]);

  let primaryText: string;
  let secondaryText: string;
  if (address?.primary || address?.secondary) {
    primaryText = address.primary || address.secondary;
    secondaryText = address.primary ? address.secondary : "";
  } else if (loading) {
    primaryText = t("map.locatingAddress");
    secondaryText = "";
  } else if (!origin || failed) {
    primaryText = t("map.locationUnavailable");
    secondaryText = "";
  } else {
    primaryText = t("map.locatingAddress");
    secondaryText = "";
  }

  return (
    <div className="flex h-full min-h-[120px] w-full flex-col overflow-hidden rounded-[28px] bg-app-panel px-4 py-3 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]" strokeWidth={2.6} aria-hidden />
        <span className="truncate">{t("map.currentLocation")}</span>
      </div>
      <div className="mt-1 flex min-h-0 flex-1 flex-col justify-center">
        <p
          className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground"
          title={primaryText}
        >
          {primaryText}
        </p>
        {secondaryText ? (
          <p
            className="mt-0.5 line-clamp-1 text-[11px] font-medium leading-snug text-muted-foreground"
            title={secondaryText}
          >
            {secondaryText}
          </p>
        ) : null}
      </div>
    </div>
  );
}
