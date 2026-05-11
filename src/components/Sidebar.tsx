import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Settings, Map, Mic, Bluetooth, Car, Home, Music } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useTranslation } from "react-i18next";

const items = [
  { to: "/settings", icon: Settings, key: "settings" },
  { to: "/map", icon: Map, key: "map" },
  { to: "/voice", icon: Mic, key: "voice" },
  { to: "/bluetooth", icon: Bluetooth, key: "bluetooth" },
  { to: "/car", icon: Car, key: "car" },
] as const;

// Sidebar width 60 ≈ 139 ratio scaled. Active strip height 74 ≈ 120 ratio.
export function Sidebar() {
  const { t } = useTranslation();
  const { location } = useRouterState();
  const path = location.pathname;
  const navigate = useNavigate();
  const { gear, musicExpanded, setMusicExpanded, theme, voicePopupOpen, setVoicePopupOpen } = useApp();
  const reversing = gear === "R";
  const cockpitMedia = path === "/" || path.startsWith("/voice");
  const mediaActive = musicExpanded && cockpitMedia;
  const homeIdleClass =
    theme === "purple" || theme === "dark"
      ? "text-white/80 hover:bg-white/10"
      : "text-foreground/85 hover:bg-black/5";
  const mediaLabel = t("sidebar.media");
  const mediaHint = t("sidebar.mediaHint");
  const onMediaClick = () => {
    if (cockpitMedia) {
      setMusicExpanded(!musicExpanded);
    } else {
      setMusicExpanded(true);
      navigate({ to: "/" });
    }
  };
  return (
    <aside className={`flex w-[60px] shrink-0 flex-col items-center py-[12px] ${reversing ? "bg-transparent" : "bg-[var(--sidebar-bg)]"}`}>
      <div className="flex flex-1 flex-col items-stretch gap-[8px] self-stretch px-0">
        <Link
          to="/"
          onClick={() => setMusicExpanded(false)}
          className={`flex h-[68px] w-full items-center justify-center rounded-[18px] transition-colors ${homeIdleClass}`}
          aria-label={t("common.home")}
          title={t("common.home")}
        >
          <Home className="h-[30px] w-[30px]" strokeWidth={1.6} />
        </Link>
        <button
          type="button"
          onClick={onMediaClick}
          aria-label={mediaLabel}
          aria-pressed={mediaActive}
          title={t("common.sidebarItemTitle", { label: mediaLabel, hint: mediaHint })}
          className={`flex h-[68px] w-full items-center justify-center transition-colors ${
            mediaActive
              ? "bg-[var(--active)] text-foreground"
              : theme === "purple" || theme === "dark"
                ? "text-white/80 hover:bg-white/10"
                : "text-foreground/85 hover:bg-black/5"
          }`}
        >
          <Music className="h-[30px] w-[30px]" strokeWidth={1.6} />
        </button>
        {items.map(({ to, icon: Icon, key }) => {
          const active = path.startsWith(to);
          const label = t(`sidebar.${key}`);
          const idleClass =
            theme === "purple" || theme === "dark"
              ? "text-white/80 hover:bg-white/10"
              : "text-foreground/85 hover:bg-black/5";
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              title={t("common.sidebarItemTitle", { label, hint: t("common.doubleTapHome") })}
              onClick={() => {
                if (to === "/bluetooth") setMusicExpanded(false);
                if (to === "/voice") {
                  // When already on Voice, tapping the mic dismisses the popup.
                  if (path.startsWith("/voice") && voicePopupOpen) {
                    setVoicePopupOpen(false);
                    return;
                  }
                  // When navigating into Voice, ensure the popup is shown.
                  setVoicePopupOpen(true);
                }
              }}
              onDoubleClick={(e) => {
                e.preventDefault();
                navigate({ to: "/" });
              }}
              className={`flex h-[68px] w-full items-center justify-center transition-colors ${
                active ? "bg-[var(--active)] text-foreground" : idleClass
              }`}
            >
              <Icon className="h-[30px] w-[30px]" strokeWidth={1.6} />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
