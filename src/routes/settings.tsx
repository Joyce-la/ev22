import { createFileRoute } from "@tanstack/react-router";
import { GearPanel } from "@/components/GearPanel.tsx";
import { BrightnessCard } from "@/components/BrightnessCard";
import { StatusCard } from "@/components/StatusCard";
import { MapWidget } from "@/components/MapWidget";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { useApp, Theme } from "@/lib/app-context";
import { ChevronDown, Languages, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

type Lang = { code: string; label: string };

// Strict real languages in your requested order, then other real languages (no dummy placeholders).
const LANGS: Lang[] = [
  { code: "ms", label: "Bahasa Melayu" },
  { code: "en", label: "English" },
  { code: "iba", label: "Iban" },
  { code: "melanau", label: "Melanau" },
  { code: "bidayuh", label: "Bidayuh" },
  { code: "kelabit", label: "Kelabit" },
  { code: "zh-Hans", label: "简体中文" },
  { code: "zh-Hant", label: "繁體中文" },
  { code: "ta", label: "தமிழ்" },
  // Other languages
  { code: "id", label: "Bahasa Indonesia" },
  { code: "th", label: "ภาษาไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "hi", label: "हिन्दी" },
  { code: "ar", label: "العربية" },
  { code: "ru", label: "Русский" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "tr", label: "Türkçe" },
  { code: "nl", label: "Nederlands" },
  { code: "sv", label: "Svenska" },
  { code: "pl", label: "Polski" },
  { code: "uk", label: "Українська" },
  { code: "fa", label: "فارسی" },
  { code: "bn", label: "বাংলা" },
  { code: "ur", label: "اردو" },
  { code: "fil", label: "Filipino" },
];
const THEMES: { v: Theme; labelKey: string }[] = [
  { v: "light", labelKey: "common.themeLight" },
  { v: "dark", labelKey: "common.themeDark" },
  { v: "purple", labelKey: "common.themePurple" },
];

const MANUAL_SECTION_KEYS = ["home", "media", "brightness", "navigation", "phone"] as const;

/** i18next must return string[]; object `{0,1,…}` breaks Array.isArray after bad merges — normalize. */
function normalizeStringList(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    const keys = Object.keys(o).filter((k) => /^\d+$/.test(k));
    if (keys.length) return keys.sort((a, b) => Number(a) - Number(b)).map((k) => String(o[k]));
  }
  return [];
}

function ManualBulletSection({ sectionKey }: { sectionKey: (typeof MANUAL_SECTION_KEYS)[number] }) {
  const { t } = useTranslation();
  const pointsKey = `settings.manual.${sectionKey}.points`;
  const titleKey = `settings.manual.${sectionKey}.title`;

  const raw = t(pointsKey, { returnObjects: true });
  const points = normalizeStringList(raw);

  const titleRaw = String(t(titleKey));
  const title = titleRaw !== titleKey ? titleRaw : "";
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <ul className="list-disc pl-4 text-foreground/80">
        {points.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function getLanguageLabelFontSize(label: string) {
  const length = Array.from(label).length;
  if (length >= 20) return 11;
  if (length >= 17) return 12;
  if (length >= 14) return 13;
  if (length >= 11) return 14;
  return 15;
}

function SettingsPage() {
  const { language, setLanguage, fontScale, setFontScale, theme, setThemeManual, linkedPhone, setLinkedPhone } = useApp();
  const { t } = useTranslation();
  const [openLang, setOpenLang] = useState(false);
  const [openManual, setOpenManual] = useState(false);

  // Pick up scanned link from localStorage
  useEffect(() => {
    const check = () => {
      try {
        const n = localStorage.getItem("hki:linkedPhone");
        if (n && n !== linkedPhone) setLinkedPhone(n);
      } catch {}
    };
    check();
    const t = setInterval(check, 1500);
    return () => clearInterval(t);
  }, [linkedPhone, setLinkedPhone]);

  const pairUrl = typeof window !== "undefined" ? `${window.location.origin}/pair` : "/pair";
  const current = LANGS.find((l) => l.code === language) ?? LANGS[0];

  // Match baseline: settings panel height == map + gap + brightness
  const W_LEFT = 290;
  const W_CENTER = 290;
  const W_RIGHT = 268;
  const GAP_X = 10;
  const GAP_Y = 8;
  const H_CENTER_TOP = 470;
  const H_CENTER_BOT = 120;
  const H_LEFT_PANEL = H_CENTER_TOP + GAP_Y + H_CENTER_BOT;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex" style={{ width: W_LEFT + W_CENTER + W_RIGHT + GAP_X * 2, gap: GAP_X }}>
        {/* LEFT column (Settings) */}
        <div className="flex flex-col" style={{ width: W_LEFT, height: H_LEFT_PANEL, gap: GAP_Y }}>
          {openManual ? (
            <div className="flex h-full flex-col rounded-[28px] bg-app-panel p-[12px] shadow-sm ring-1 ring-black/5">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[0.875rem] font-bold text-foreground">{t("settings.userManualTitle")}</div>
                <button
                  type="button"
                  onClick={() => setOpenManual(false)}
                  className="rounded-full bg-app-panel-soft px-3 py-1 text-[0.72rem] font-semibold text-foreground transition hover:bg-[var(--active)]"
                >
                  {t("status.back")}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto rounded-[18px] bg-app-panel-soft p-3 text-[0.72rem] leading-snug text-foreground/70">
                <div className="space-y-3">
                  {MANUAL_SECTION_KEYS.map((key) => (
                    <ManualBulletSection key={key} sectionKey={key} />
                  ))}
                </div>
              </div>
            </div>
          ) : openLang ? (
            <div className="flex h-full flex-col rounded-[28px] bg-app-panel p-[12px] shadow-sm ring-1 ring-black/5">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[0.875rem] font-bold text-foreground">{t("common.language")}</div>
                <button
                  type="button"
                  onClick={() => setOpenLang(false)}
                  className="rounded-full bg-app-panel-soft px-3 py-1 text-[0.72rem] font-semibold text-foreground transition hover:bg-[var(--active)]"
                >
                  {t("status.back")}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto rounded-[18px] bg-app-panel-soft p-3">
                <ul className="space-y-1 text-[0.875rem] text-foreground/80">
                  {LANGS.map((l) => (
                    <li key={l.code}>
                      <button
                        type="button"
                        onClick={() => { setLanguage(l.code); setOpenLang(false); }}
                        className="flex w-full items-start justify-between gap-3 rounded-[14px] px-3 py-2 text-left text-sm transition hover:bg-[var(--active)]"
                      >
                        <span
                          className="flex-1 pr-2 text-left break-words leading-tight"
                          style={{ fontSize: `${getLanguageLabelFontSize(l.label)}px`, maxWidth: "100%" }}
                        >
                          {l.label}
                        </span>
                        {language === l.code ? <span className="text-[0.72rem] text-foreground/60">✓</span> : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col gap-[8px] rounded-[28px] bg-app-panel p-[12px] shadow-sm ring-1 ring-black/5">
              {/* Display Language */}
              <div>
                <div className="mb-[4px] flex items-center justify-center gap-2 text-center text-[0.8125rem] font-bold">
                  <Languages className="h-4 w-4 text-foreground/70" />
                  <span>{t("common.language")}</span>
                </div>
                <button
                  onClick={() => { setOpenLang(true); setOpenManual(false); }}
                  className="flex w-full items-start justify-between gap-3 rounded-[14px] bg-app-panel-soft px-[12px] py-[8px] text-xs"
                  aria-label={t("common.selectDisplayLanguage")}
                >
                  <span className="min-w-0 flex-1 text-left">
                    <span
                      className="leading-tight break-words whitespace-normal"
                      style={{ fontSize: `${getLanguageLabelFontSize(current.label)}px`, maxWidth: "100%" }}
                    >
                      {current.label}
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0" />
                </button>
              </div>

              {/* Phone Auto-Connect */}
              <div className="mt-[2px] flex flex-col items-center rounded-[18px] bg-app-panel-soft px-[8px] py-[10px]">
                <div className="mb-[6px] flex items-center gap-2 text-[0.8125rem] font-bold">
                  <Smartphone className="h-4 w-4 text-foreground/70" />
                  {t("common.phoneAutoConnect")}
                </div>
                <div className="rounded-[12px] bg-white p-[6px] ring-1 ring-black/10">
                  <QRCodeDisplay value={pairUrl} size={88} />
                </div>
                <div className="mt-[6px] text-[0.625rem] font-semibold text-foreground/60">
                  {linkedPhone ? t("common.linked", { name: linkedPhone }) : t("common.unpaired")}
                </div>
                {linkedPhone && (
                  <button
                    type="button"
                    onClick={() => {
                      try { localStorage.removeItem("hki:linkedPhone"); localStorage.removeItem("hki:linkedAt"); } catch {}
                      setLinkedPhone(null);
                    }}
                    className="mt-2 rounded-full bg-app-panel px-3 py-[6px] text-[0.6875rem] font-semibold hover:bg-[var(--active)]"
                  >
                    {t("common.unlinkPhone")}
                  </button>
                )}
              </div>

              {/* Customization */}
              <div className="mt-[2px] min-h-0 flex-1 overflow-auto rounded-[18px] bg-app-panel-soft px-[10px] py-[10px]">
                <div className="mb-[8px] text-center text-[0.8125rem] font-bold">{t("common.customization")}</div>
                <div className="flex flex-col gap-2">
                  <div className="text-center text-[0.625rem] font-semibold tracking-wide text-foreground/60">
                    {t("common.changeFontSize")}
                  </div>
                  <input
                    type="range"
                    min={0.8}
                    max={1.3}
                    step={0.05}
                    value={fontScale}
                    onChange={(e) => setFontScale(parseFloat(e.target.value))}
                    className="w-full accent-[var(--brand)]"
                    aria-label={t("common.changeFontSize")}
                  />
                  <div className="text-center text-[0.625rem] font-semibold tracking-wide text-foreground/60">{t("common.changeThemeColour")}</div>
                  <div className="flex gap-2">
                    {THEMES.map((themeOption) => {
                      const active = theme === themeOption.v;
                      const bg = themeOption.v === "purple"
                        ? "linear-gradient(135deg, oklch(0.55 0.22 320), oklch(0.45 0.20 295))"
                        : themeOption.v === "dark"
                        ? "oklch(0.22 0.02 270)"
                        : "oklch(0.98 0.005 250)";
                      const fg = themeOption.v === "light" ? "#1f2937" : "#fff";
                      return (
                        <button
                          key={themeOption.v}
                          type="button"
                          onClick={() => setThemeManual(themeOption.v)}
                          aria-pressed={active}
                          className={`flex-1 rounded-[12px] px-2 py-[8px] text-[0.6875rem] font-bold transition-all active:scale-[0.97] ${active ? "ring-2 ring-[var(--brand)] shadow-md" : "ring-1 ring-black/10 hover:ring-[var(--brand)]/60"}`}
                          style={{ background: bg, color: fg }}
                        >{t(themeOption.labelKey)}</button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setOpenManual(true); setOpenLang(false); }}
                className="mt-2 w-full rounded-[18px] bg-app-panel-soft p-3 text-left text-[0.72rem] leading-snug text-foreground/70 transition hover:bg-app-panel"
              >
                <div className="mb-2 flex items-center justify-between text-[0.8125rem] font-bold text-foreground">
                  <span>{t("settings.userManualTitle")}</span>
                  <ChevronDown className="h-4 w-4 transition-transform" />
                </div>
                <p className="text-[0.72rem] text-foreground/70">{t("settings.userManualTeaser")}</p>
              </button>
            </div>
          )}
        </div>

        {/* CENTER column */}
        <div className="flex flex-col" style={{ width: W_CENTER, gap: GAP_Y }}>
          <div style={{ height: H_CENTER_TOP }}>
            <MapWidget className="h-full w-full" />
          </div>
          <div style={{ height: H_CENTER_BOT }}>
            <BrightnessCard />
          </div>
        </div>

        {/* RIGHT column */}
        <div className="flex flex-col" style={{ width: W_RIGHT, gap: GAP_Y }}>
          <div style={{ height: H_CENTER_TOP }}>
            <GearPanel />
          </div>
          <div style={{ height: H_CENTER_BOT }}>
            <StatusCard />
          </div>
        </div>
      </div>
    </div>
  );
}
