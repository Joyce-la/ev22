import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TrafficWidget } from "@/components/TrafficWidget";
import { MapWidget } from "@/components/MapWidget";
import { GearPanel } from "@/components/GearPanel.tsx";
import { MediaCard } from "@/components/MediaCard";
import { ClimateCard } from "@/components/ClimateCard";
import { BrightnessCard } from "@/components/BrightnessCard";
import { StatusCard } from "@/components/StatusCard";
import { Mic } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CockpitLayout } from "@/components/CockpitLayout";
import { useApp } from "@/lib/app-context";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/voice")({ component: VoicePage });

const TARGETS: { kw: string[]; to: string }[] = [
  // Match SearchBar voice command behavior (English keywords).
  { kw: ["set", "setting", "settings", "language", "font", "theme", "brightness"], to: "/settings" },
  { kw: ["map", "navigation", "destination", "route", "gps"], to: "/map" },
  { kw: ["voice", "mic", "command", "listen", "speak"], to: "/voice" },
  { kw: ["bluetooth", "phone", "pair", "device", "auto-connect", "phone-auto-connect"], to: "/bluetooth" },
  { kw: ["car", "drive", "driving", "mode", "cruise", "lane", "park", "parking", "auto-parking"], to: "/car" },
  { kw: ["home", "dashboard", "main"], to: "/" },
  // A few common Chinese keywords (helps when display language is Chinese).
  { kw: ["设置", "语言", "字体", "主题", "亮度"], to: "/settings" },
  { kw: ["导航", "地图", "路线", "目的地"], to: "/map" },
  { kw: ["蓝牙", "配对", "手机"], to: "/bluetooth" },
  { kw: ["车辆", "车", "驾驶", "泊车"], to: "/car" },
  { kw: ["主页", "首页"], to: "/" },
];

function VoicePage() {
  const { t } = useTranslation();
  const [spokenText, setSpokenText] = useState("");
  const [listening, setListening] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [popupAltText, setPopupAltText] = useState(false);
  const recogRef = useRef<any>(null);
  const { playBeep, language, playing, setPlaying, audioEl, gear, musicExpanded, setMusicExpanded, voicePopupOpen, setVoicePopupOpen } = useApp();
  const navigate = useNavigate();
  const wasPlayingRef = useRef(false);
  const voiceSessionActiveRef = useRef(false);
  const didChimeRef = useRef(false);
  const playingRef = useRef(playing);
  const keepListeningRef = useRef(true);
  const lastNavAtRef = useRef(0);
  const navLockedRef = useRef(false);
  const toggleMusic = () => setMusicExpanded(!musicExpanded);

  // Keep this ref in sync immediately (not one-render-late).
  playingRef.current = playing;

  const forcePauseAudioNow = () => {
    // 1) Pause via the registered global ref when available.
    try { audioEl?.pause(); } catch {}
    // 2) If the ref isn't ready yet (first load), pause the DOM <audio> directly.
    try {
      const el = document.querySelector("audio") as HTMLAudioElement | null;
      el?.pause();
    } catch {}
  };

  // Entering the Voice page should immediately pause music display/playback,
  // even if SpeechRecognition autostart is blocked by the browser.
  useLayoutEffect(() => {
    beginVoiceSession();
    return () => {
      // Resume when leaving Voice page.
      endVoiceSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beginVoiceSession = () => {
    if (voiceSessionActiveRef.current) return;
    voiceSessionActiveRef.current = true;
    // Capture whether music was playing right before Voice took over.
    wasPlayingRef.current = playingRef.current;
    // Pause playback while on the Voice page (keep the music panel visible).
    setPlaying(false);
    forcePauseAudioNow();
    // One more microtask later to catch engines that start/resume audio slightly after state flips.
    window.setTimeout(() => forcePauseAudioNow(), 0);
  };

  const endVoiceSession = () => {
    if (!voiceSessionActiveRef.current) return;
    voiceSessionActiveRef.current = false;
    if (wasPlayingRef.current) {
      setPlaying(true);
      // Some browsers need a "kick" after mic usage; try to resume the audio element too.
      window.setTimeout(() => {
        try { audioEl?.play?.(); } catch {}
      }, 0);
    }
    wasPlayingRef.current = false;
  };

  // While staying on the Voice page, keep music playback forced OFF
  // (even if some component tries to turn it back on).
  useEffect(() => {
    if (!voiceSessionActiveRef.current) return;
    if (playing) setPlaying(false);
    forcePauseAudioNow();
  }, [playing, setPlaying, audioEl]);

  // If the global audio element registers *after* we entered Voice,
  // pause it immediately so there is no brief "leak" of sound.
  useEffect(() => {
    if (!voiceSessionActiveRef.current) return;
    forcePauseAudioNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioEl]);

  useEffect(() => {
    setSpokenText("");
  }, [t]);

  const maybeNavigateBySpeech = (finalText: string) => {
    const now = Date.now();
    if (navLockedRef.current) return;
    if (now - lastNavAtRef.current < 1200) return;
    const s = finalText.trim().toLowerCase();
    if (!s) return;
    const hit = TARGETS.find((tt) => tt.kw.some((k) => s.includes(k.toLowerCase())));
    if (!hit) return;
    lastNavAtRef.current = now;
    navLockedRef.current = true;
    // Stop listening immediately to prevent repeat triggers during navigation.
    keepListeningRef.current = false;
    try { recogRef.current?.stop(); } catch {}
    setListening(false);
    navigate({ to: hit.to as "/" });
  };

  // Pause/resume voice listening when reversing (gear === "R") on the Voice page.
  useEffect(() => {
    const r = recogRef.current;
    if (!r) return;
    if (gear === "R") {
      // Reversing: stop mic, do not auto-restart.
      keepListeningRef.current = false;
      try { r.stop(); } catch {}
      setListening(false);
    } else {
      // Any other gear (P/N/D): mic should be on while still on the Voice page.
      keepListeningRef.current = true;
      // Allow chime to play again on the next start after coming out of reverse.
      didChimeRef.current = false;
      window.setTimeout(() => tryStart(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gear]);

  const tryStart = () => {
    const r = recogRef.current;
    if (!r) return;
    try {
      setNeedsGesture(false);
      beginVoiceSession();
      r.start();
      setListening(true);
    } catch {
      // Common in Chrome: NotAllowedError unless started from a user gesture.
      setNeedsGesture(true);
      setListening(false);
      // Don't keep auto-restarting while we require a gesture.
      keepListeningRef.current = false;
    }
  };

  useEffect(() => {
    keepListeningRef.current = true;
    navLockedRef.current = false;
    const W = window as any;
    const SRClass = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SRClass) { setSpokenText(t("voice.notSupported")); return; }
    const langMap: Record<string, string> = {
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
    const r = new SRClass();
    r.continuous = true;
    r.interimResults = true;
    r.lang = langMap[language] ?? language ?? "en-US";
    r.onresult = (e: any) => {
      const text = Array.from(e.results)
        .map((res: any) => String(res?.[0]?.transcript ?? ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      setSpokenText(text);
      // Keep music paused while on Voice page.
      beginVoiceSession();

      // Only navigate on FINAL results (reduces accidental triggers).
      const finalText = Array.from(e.results)
        .filter((res: any) => !!res?.isFinal)
        .map((res: any) => String(res?.[0]?.transcript ?? ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (finalText) maybeNavigateBySpeech(finalText);
    };
    r.onstart = () => {
      setListening(true);
      setNeedsGesture(false);
      // SpeechRecognition auto-restarts in many browsers; don't chime every restart.
      if (!didChimeRef.current) {
        didChimeRef.current = true;
        playBeep("chime");
      }
    };
    r.onend = () => {
      // Many engines auto-stop after a short silence even in continuous mode.
      // Keep listening pinned while on the Voice page (Google-Translate style).
      if (!keepListeningRef.current) {
        setListening(false);
        return;
      }
      window.setTimeout(() => {
        if (!keepListeningRef.current) return;
        try {
          // Keep UI in listening state; just restart recognition.
          setListening(true);
          r.start();
        } catch {}
      }, 120);
    };
    r.onerror = (ev: any) => {
      const err = String(ev?.error ?? "");
      // If permission/gesture is required, stop retrying and show the "tap to start" state.
      if (err === "not-allowed" || err === "service-not-allowed") {
        keepListeningRef.current = false;
        setListening(false);
        setNeedsGesture(true);
        return;
      }
      // Try to recover from transient errors by restarting.
      if (!keepListeningRef.current) return;
      window.setTimeout(() => {
        if (!keepListeningRef.current) return;
        try {
          setListening(true);
          r.start();
          setNeedsGesture(false);
        } catch {
          keepListeningRef.current = false;
          setListening(false);
          setNeedsGesture(true);
        }
      }, 220);
    };
    recogRef.current = r;
    // Try autostart; if blocked, we will start on the first tap.
    window.setTimeout(() => tryStart(), 0);
    return () => {
      keepListeningRef.current = false;
      didChimeRef.current = false;
      try { r.stop(); } catch {}
    };
  }, [playBeep, language, t]);

  // Alternate the popup label text every 2s (when visible).
  useEffect(() => {
    if (!voicePopupOpen) return;
    setPopupAltText(false);
    const id = window.setInterval(() => setPopupAltText((v) => !v), 2000);
    return () => window.clearInterval(id);
  }, [voicePopupOpen]);

  return (
    <div
      className="relative h-full"
      onPointerDown={() => {
        // If the browser blocked autostart, a tap anywhere starts listening.
        if (needsGesture) {
          keepListeningRef.current = true;
          tryStart();
        }
      }}
    >
      {/* Listening overlay — 472×217 ratio scaled to ~292×135 */}
      {voicePopupOpen && (
      <div className="pointer-events-none absolute left-1/2 top-2 z-[1500] -translate-x-1/2" style={{ width: 292 }}>
        <div
          className="pointer-events-auto relative flex h-[135px] flex-col items-center justify-center gap-2 overflow-hidden rounded-[24px] bg-[var(--panel)] px-4 shadow-2xl ring-1 ring-white/10 backdrop-blur-md"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Boost contrast (especially in purple theme) without changing layout */}
          <div className="pointer-events-none absolute inset-0 bg-black/30" />
          <div className={`relative flex h-12 w-12 items-center justify-center rounded-full ${listening ? "bg-[var(--brand)]/20" : "bg-[var(--panel-soft)]"}`}>
            <span className={`absolute inset-0 animate-ping rounded-full ${listening ? "bg-[var(--brand)]/30" : "bg-foreground/10"}`} />
            <Mic className={`h-6 w-6 ${listening ? "text-[var(--brand)]" : "text-foreground/60"}`} />
          </div>
          <div className="text-[12px] font-bold text-foreground">
            {popupAltText ? t("voice.tapToStart") : t("voice.listening")}
          </div>
          <div className="w-full text-center text-[12px] leading-snug text-foreground/80">
            <div className="line-clamp-3 break-words">
              {spokenText || t("voice.sayCommand")}
            </div>
          </div>
        </div>
      </div>
      )}

      <CockpitLayout
        leftTop={musicExpanded ? <MediaCard expanded onToggleExpand={toggleMusic} /> : <TrafficWidget className="h-full w-full" />}
        leftTopLarge={musicExpanded}
        leftMiddle={musicExpanded ? undefined : <MediaCard onToggleExpand={toggleMusic} />}
        leftBottom={<ClimateCard />}
        centerTop={<MapWidget className="h-full w-full" />}
        centerBottom={<BrightnessCard />}
        rightTop={<GearPanel />}
        rightBottom={<StatusCard />}
      />
    </div>
  );
}
