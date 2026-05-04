import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Mic, Search, X, Clock } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/lib/app-context";
import { useTranslation } from "react-i18next";

const TARGETS: { kw: string[]; to: string; labelKey: string }[] = [
  { kw: ["set", "setting", "settings", "language", "font", "theme", "brightness"], to: "/settings", labelKey: "sidebar.settings" },
  { kw: ["map", "navigation", "destination", "route", "gps"], to: "/map", labelKey: "search.quickNavigation" },
  { kw: ["voice", "mic", "command", "listen", "speak"], to: "/voice", labelKey: "sidebar.voice" },
  { kw: ["bluetooth", "phone", "pair", "device", "auto-connect", "phone-auto-connect"], to: "/bluetooth", labelKey: "search.quickPhoneConnect" },
  { kw: ["car", "drive", "driving", "mode", "cruise", "lane", "park", "parking", "auto-parking"], to: "/car", labelKey: "search.quickAutoParking" },
  { kw: ["home", "dashboard", "main"], to: "/", labelKey: "search.quickNavigation" },
];

const QUICK = [
  { key: "search.quickAutoParking", to: "/car" },
  { key: "search.quickPhoneConnect", to: "/bluetooth" },
  { key: "search.quickAdaptiveCruise", to: "/car" },
  { key: "search.quickLaneCentering", to: "/car" },
  { key: "search.quickNavigation", to: "/map" },
];

type SR = any;

function highlightMatch(label: string, q: string) {
  const query = q.trim();
  if (!query) return label;
  const idx = label.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return label;
  const before = label.slice(0, idx);
  const mid = label.slice(idx, idx + query.length);
  const after = label.slice(idx + query.length);
  return (
    <span className="min-w-0 truncate">
      <span className="text-foreground/70">{before}</span>
      <span className="font-extrabold text-foreground">{mid}</span>
      <span className="text-foreground/70">{after}</span>
    </span>
  );
}

export function SearchBar() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const [micPinned, setMicPinned] = useState(false);
  const micPinnedRef = useRef(false);
  const [forceOpen, setForceOpen] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const recogRef = useRef<SR | null>(null);
  const nav = useNavigate();
  const { playBeep, gear, language, playing, setPlaying, musicExpanded, setMusicExpanded, audioEl, voicePopupOpen, setVoicePopupOpen } = useApp();
  const { location } = useRouterState();
  const path = location.pathname;
  const reversing = gear === "R";
  const wasPlayingRef = useRef(false);
  const wasExpandedRef = useRef(false);
  const voiceSessionActiveRef = useRef(false);
  const playingRef = useRef(playing);
  const musicExpandedRef = useRef(musicExpanded);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    musicExpandedRef.current = musicExpanded;
  }, [musicExpanded]);

  const beginVoiceSession = () => {
    if (voiceSessionActiveRef.current) return;
    voiceSessionActiveRef.current = true;
    wasPlayingRef.current = playingRef.current;
    wasExpandedRef.current = musicExpandedRef.current;
    // Force pause even if panel isn't visible.
    setPlaying(false);
    try { audioEl?.pause(); } catch {}
    if (musicExpandedRef.current) setMusicExpanded(false);
  };

  const endVoiceSession = () => {
    if (!voiceSessionActiveRef.current) return;
    voiceSessionActiveRef.current = false;
    if (wasExpandedRef.current) setMusicExpanded(true);
    if (wasPlayingRef.current) setPlaying(true);
    wasPlayingRef.current = false;
    wasExpandedRef.current = false;
  };

  const speechLang = useMemo(() => {
    const map: Record<string, string> = {
      en: "en-US",
      ms: "ms-MY",
      ta: "ta-IN",
      "zh-Hans": "zh-CN",
      "zh-Hant": "zh-TW",
      iba: "ms-MY",
      melanau: "ms-MY",
      bidayuh: "ms-MY",
      kelabit: "ms-MY",
      es: "es-ES",
    };
    return map[language] ?? language ?? "en-US";
  }, [language]);

  useEffect(() => {
    const W = typeof window !== "undefined" ? (window as any) : null;
    const SRClass = W?.SpeechRecognition || W?.webkitSpeechRecognition;
    if (!SRClass) return;
    const r: SR = new SRClass();
    r.continuous = true;
    r.interimResults = true;
    r.lang = speechLang;
    r.onresult = (e: any) => {
      const text = Array.from(e.results).map((res: any) => res[0].transcript).join("");
      setQ(text);
      setFocused(true);
      setForceOpen(true);
    };
    r.onstart = () => {
      beginVoiceSession();
      setListening(true);
      setFocused(true);
      setForceOpen(true);
      playBeep("chime");
    };
    r.onend = () => {
      setListening(false);
      // Use ref so we see the latest pin state when stopping (effect closure would keep stale `micPinned === true`).
      if (micPinnedRef.current) {
        try { r.start(); } catch {}
        return;
      }
      endVoiceSession();
    };
    r.onerror = () => { setListening(false); endVoiceSession(); setMicError(t("voice.notSupported")); };
    recogRef.current = r;
  }, [playBeep, speechLang, t, setMusicExpanded, setPlaying]);

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return TARGETS.filter((t) => t.kw.some((k) => k.includes(s) || s.includes(k))).slice(0, 5);
  }, [q]);

  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("hki:searchRecent");
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) setRecent(arr.filter((x) => typeof x === "string").slice(0, 6));
    } catch {}
  }, []);
  const pushRecent = (text: string) => {
    const s = text.trim();
    if (!s) return;
    setRecent((prev) => {
      const next = [s, ...prev.filter((x) => x.toLowerCase() !== s.toLowerCase())].slice(0, 6);
      try { localStorage.setItem("hki:searchRecent", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const go = (to: string) => {
    setQ(""); setFocused(false); setForceOpen(false);
    if (listening) {
      micPinnedRef.current = false;
      setMicPinned(false);
      try { recogRef.current?.stop(); } catch {}
      setListening(false);
      endVoiceSession();
    }
    nav({ to: to as "/" });
  };

  const openDropdown = !listening && (focused || forceOpen);

  const toggleMic = () => {
    // Match the sidebar mic behavior: go to the Voice page (which owns the mic popup).
    // Also stop any in-search voice session if it was active.
    try { recogRef.current?.stop?.(); } catch {}
    micPinnedRef.current = false;
    setMicPinned(false);
    setListening(false);
    endVoiceSession();
    setMicError(null);
    if (path.startsWith("/voice") && voicePopupOpen) {
      setVoicePopupOpen(false);
      return;
    }
    setVoicePopupOpen(true);
    nav({ to: "/voice" });
  };

  const onSearch = () => {
    const trimmed = q.trim();
    if (matches[0]) {
      pushRecent(matches[0].kw?.[0] ? trimmed : trimmed);
      return go(matches[0].to);
    }
    if (trimmed) {
      pushRecent(trimmed);
      go("/voice");
    }
  };

  const suggestions = useMemo(() => {
    const trimmed = q.trim();
    if (matches.length > 0) return matches.map((m) => ({ kind: "route" as const, label: t(m.labelKey), to: m.to }));
    if (trimmed) return QUICK.map((qq) => ({ kind: "route" as const, label: t(qq.key), to: qq.to }));
    // When empty, behave more like Google: show recent items first, then quick shortcuts.
    const rec = recent.map((r) => ({ kind: "recent" as const, label: r, to: "/voice" }));
    const quick = QUICK.map((qq) => ({ kind: "route" as const, label: t(qq.key), to: qq.to }));
    return [...rec, ...quick].slice(0, 8);
  }, [matches, q, recent, t]);

  useEffect(() => {
    if (!openDropdown) return;
    setActiveIdx(0);
  }, [openDropdown, q]);

  return (
    <div className="relative w-full max-w-[274px] min-w-[220px] shrink">
      {/* Search bar — 274×52 ≈ 442×95 ratio (4.65:1) */}
      <div
        className={[
          "bg-app-panel relative flex items-center gap-2 overflow-hidden rounded-full px-3 shadow-sm ring-1 ring-black/5",
          reversing ? "opacity-40 pointer-events-none" : "",
        ].join(" ")}
        style={{ height: 52 }}
        aria-disabled={reversing}
      >
        {reversing && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] text-white">
            LOCKED
          </div>
        )}
        <button
          onClick={toggleMic}
          className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full transition ${listening ? "bg-[var(--brand)] text-white animate-mic-pulse" : "bg-app-panel-soft text-foreground/70 hover:bg-[var(--active)]"}`}
          aria-label={t("search.voiceSearch")}
        >
          <Mic className="h-[16px] w-[16px]" />
        </button>
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setForceOpen(true); }}
          onFocus={() => { setFocused(true); setForceOpen(true); }}
          onBlur={() => setTimeout(() => { setFocused(false); if (!listening) setForceOpen(false); }, 150)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setForceOpen(false);
              setFocused(false);
              return;
            }
            if (!openDropdown) {
              if (e.key === "Enter") onSearch();
              return;
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
              return;
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIdx((i) => Math.max(i - 1, 0));
              return;
            }
            if (e.key === "Enter") {
              e.preventDefault();
              const item = suggestions[activeIdx];
              if (!item) return onSearch();
              if (item.kind === "recent") {
                setQ(item.label);
                pushRecent(item.label);
                setForceOpen(true);
                return;
              }
              pushRecent(q);
              go(item.to);
            }
          }}
          placeholder={reversing ? t("topbar.searchLocked") : t("topbar.searchBar")}
          className="min-w-0 flex-1 bg-transparent text-[0.95rem] leading-tight outline-none placeholder:text-foreground/55"
        />
        <button onClick={onSearch} className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full text-foreground/70 hover:bg-[var(--active)]" aria-label={t("common.search")}>
          <Search className="h-[16px] w-[16px]" />
        </button>
      </div>

      {/* Listening overlay — 292×135 ≈ 472×217 ratio (2.18:1) */}
      {listening && (
        <div
          className="bg-app-panel absolute right-0 top-[60px] z-[1000] overflow-hidden rounded-[24px] shadow-2xl ring-1 ring-black/10"
          style={{ width: 292, height: 135 }}
        >
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand)]/15">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--brand)]/30" />
              <Mic className="h-6 w-6 text-[var(--brand)]" />
            </div>
            <div className="text-[12px] font-bold text-foreground">{t("voice.listening")}</div>
            <div className="line-clamp-1 text-[11px] text-foreground/70">{q || t("voice.sayCommand")}</div>
            <button
              onClick={toggleMic}
              className="bg-app-panel-soft absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full hover:bg-[var(--active)]"
              aria-label={t("search.stop")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {micError && (
        <div className="absolute right-0 top-[60px] z-[1000] rounded-xl bg-black/70 px-3 py-2 text-[11px] text-white">
          {micError}
        </div>
      )}

      {/* Suggestions dropdown */}
      {openDropdown && suggestions.length > 0 && (
        <div className="bg-app-panel absolute left-0 right-0 top-[60px] z-[1000] max-h-[220px] overflow-y-auto overscroll-contain rounded-2xl shadow-xl ring-1 ring-black/5 animate-fade-in">
          {suggestions.map((m, idx) => (
            <button
              key={m.label + m.to}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => {
                if (m.kind === "recent") {
                  setQ(m.label);
                  pushRecent(m.label);
                  setForceOpen(true);
                  return;
                }
                pushRecent(q);
                go(m.to);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] ${
                idx === activeIdx ? "bg-[var(--secondary)]" : "hover:bg-[var(--secondary)]"
              }`}
            >
              {m.kind === "recent" ? (
                <Clock className="h-3.5 w-3.5 opacity-60" />
              ) : (
                <Search className="h-3.5 w-3.5 opacity-60" />
              )}
              {typeof m.label === "string" ? highlightMatch(m.label, q) : m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
