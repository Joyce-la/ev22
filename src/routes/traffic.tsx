import { createFileRoute, Link } from "@tanstack/react-router";
import { TrafficWidget } from "@/components/TrafficWidget";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/traffic")({ component: TrafficPage });

function TrafficPage() {
  const { t } = useTranslation();
  return (
    <div className="relative h-full w-full">
      <TrafficWidget className="h-full w-full rounded-none" clickable={false} fullscreen />
      <div className="absolute right-3 top-3 z-20">
        <Link
          to="/"
          className="relative flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full shadow-lg ring-1 ring-black/10 backdrop-blur"
          aria-label={t("common.close")}
        >
          <span className="pointer-events-none absolute inset-0 rounded-full bg-app-panel opacity-[0.95]" aria-hidden />
          <X className="relative z-[1] h-5 w-5" />
        </Link>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
        <div className="relative overflow-hidden rounded-full px-4 py-2 text-[11px] font-semibold shadow-lg ring-1 ring-black/10 backdrop-blur">
          <span className="pointer-events-none absolute inset-0 rounded-full bg-app-panel opacity-[0.92]" aria-hidden />
          <span className="relative">{t("traffic.fullscreenHint")}</span>
        </div>
      </div>
    </div>
  );
}
