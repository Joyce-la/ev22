import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useTranslation } from "react-i18next";
import { TrafficScene3D } from "@/components/TrafficScene3D";

/**
 * Realistic-ish ADAS / front camera view.
 */
export function TrafficWidget({ className = "", clickable = true, fullscreen = false }: { className?: string; clickable?: boolean; fullscreen?: boolean }) {
  const { t } = useTranslation();
  const [tooClose, setTooClose] = useState(false);
  const [warningMinimized, setWarningMinimized] = useState(false);
  const { playBeep } = useApp();
  const prevTooCloseRef = useRef(false);

  // Warning is driven by the 3D Smart Traffic proximity detection.

  // Play the warning sound exactly when the warning becomes visible.
  // Using rAF ensures React has a chance to render the warning dialog first,
  // so the sound and message appear simultaneously.
  useEffect(() => {
    const prev = prevTooCloseRef.current;
    prevTooCloseRef.current = tooClose;
    if (!tooClose || prev) return;
    const id = window.requestAnimationFrame(() => {
      // Still visible? Then play the warning sound.
      if (prevTooCloseRef.current) playBeep("warn");
    });
    return () => window.cancelAnimationFrame(id);
  }, [tooClose, playBeep]);


  const inner = (
    <div className={`group relative overflow-hidden rounded-[24px] shadow-sm ring-1 ring-black/5 ${className}`}>
      <div className="absolute inset-0">
        <TrafficScene3D
          warning={tooClose}
          quality={fullscreen ? "high" : "low"}
          onWarningChange={(v: boolean) => setTooClose(v)}
        />
      </div>

      {/* Too-close warning */}
      {tooClose && !warningMinimized && (
        <div
          className="absolute left-1/2 top-2 z-10 flex w-[92%] max-w-[420px] -translate-x-1/2 items-center gap-3 rounded-2xl bg-red-600/95 px-4 py-3 font-extrabold text-white shadow-2xl ring-1 ring-red-400/30 backdrop-blur animate-fade-in"
          style={{ fontSize: "clamp(12px, calc(13px * var(--hki-font-scale, 1)), 18px)" }}
        >
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div className="min-w-0 flex-1 text-center leading-snug">
            {t("traffic.tooClose")}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWarningMinimized(true);
            }}
            className="pointer-events-auto inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/20 hover:bg-black/30"
            aria-label={t("traffic.closeWarning")}
            title={t("traffic.closeWarning")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Minimized in-panel warning badge */}
      {tooClose && warningMinimized && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWarningMinimized(false);
          }}
          className="absolute left-2 top-2 z-10 inline-flex items-center gap-1.5 rounded-full bg-red-600/90 px-2.5 py-1 font-extrabold text-white shadow-lg ring-1 ring-red-400/25 backdrop-blur animate-fade-in"
          style={{ fontSize: "clamp(10px, calc(11px * var(--hki-font-scale, 1)), 15px)" }}
          aria-label={t("traffic.tooClose")}
          title={t("traffic.tooClose")}
        >
          <AlertTriangle className="h-4 w-4" />
          <span className="hidden sm:inline">{t("traffic.warning")}</span>
        </button>
      )}

      {/* LIVE chip */}
      <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" /> {t("traffic.live")}
      </div>
      {fullscreen && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur">
          {t("traffic.view360")}
        </div>
      )}
    </div>
  );
  if (!clickable || fullscreen) return inner;
  return <Link to="/traffic" className="block h-full w-full">{inner}</Link>;
}
