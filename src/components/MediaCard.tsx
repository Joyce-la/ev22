import { useApp } from "@/lib/app-context";
import { useTranslation } from "react-i18next";
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, X } from "lucide-react";
import { useEffect, useState } from "react";
import healTheWorld from "@/assets/heal-the-world.mp3";
import drivingLight from "@/assets/driving-light.mp3";
import kalimba2 from "@/assets/kalimba (2).mp3";
import shapeOfYou from "@/assets/shape-of-you.mp3";
import whiteChristmas from "@/assets/white-christmas.mp3";
import heyJude from "@/assets/hey-jude.mp3";
import xinYuanBianLiTie from "@/assets/xin-yuan-bian-li-tie.mp3";

const PLAYLIST = [
  { title: "Heal the World", artist: "Michael Jackson", src: healTheWorld },
  { title: "Driving Light", artist: "Ambient", src: drivingLight },
  { title: "Kalimba", artist: "Mr. Scruff", src: kalimba2 },
  { title: "Shape of You", artist: "Ed Sheeran", src: shapeOfYou },
  { title: "White Christmas", artist: "Bing Crosby", src: whiteChristmas },
  { title: "Hey Jude", artist: "The Beatles", src: heyJude },
  { title: "心愿便利贴", artist: "Local", src: xinYuanBianLiTie },
];

interface Props {
  expanded?: boolean;
  onToggleExpand?: () => void;
  /** Empty panel placeholder — no track UI or controls (optional embeds). */
  hidden?: boolean;
}

export function MediaCard({ expanded = false, onToggleExpand, hidden = false }: Props) {
  const { t } = useTranslation();
  const {
    playing,
    setPlaying,
    audioEl,
    progress,
    setProgress,
    volume,
    setVolume,
    repeatOne,
    setRepeatOne,
    shuffle,
    setShuffle,
    trackIdx,
    setTrackIdx,
  } = useApp();
  // We don't render our own <audio> anymore; we just read/control the
  // app-wide one mounted in __root.tsx so playback persists across pages.
  const [durationSec, setDurationSec] = useState(0);

  const formatTime = (sec: number) => {
    const s = Number.isFinite(sec) ? Math.max(0, sec) : 0;
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  // Track duration from the global audio element so the progress bar/labels stay accurate.
  useEffect(() => {
    const a = audioEl; if (!a) return;
    const updateDuration = () => setDurationSec(Number.isFinite(a.duration) ? a.duration : 0);
    updateDuration();
    a.addEventListener("loadedmetadata", updateDuration);
    a.addEventListener("durationchange", updateDuration);
    return () => {
      a.removeEventListener("loadedmetadata", updateDuration);
      a.removeEventListener("durationchange", updateDuration);
    };
  }, [audioEl, trackIdx]);

  const seek = (v: number) => {
    setProgress(v);
    const a = audioEl;
    if (a && a.duration) a.currentTime = v * a.duration;
  };
  const pickRandomTrack = (excludeIdx: number) => {
    if (PLAYLIST.length <= 1) return excludeIdx;
    let next = excludeIdx;
    while (next === excludeIdx) next = Math.floor(Math.random() * PLAYLIST.length);
    return next;
  };
  const skip = (delta: number) => {
    const next = shuffle
      ? pickRandomTrack(trackIdx)
      : (trackIdx + delta + PLAYLIST.length) % PLAYLIST.length;
    setTrackIdx(next);
    setProgress(0);
  };

  const cur = PLAYLIST[trackIdx];
  const currentSec = durationSec ? progress * durationSec : 0;

  // Hidden placeholder mode: render a panel with no music info or controls.
  if (hidden) {
    return (
      <div
        className="relative flex h-full w-full items-center justify-center rounded-[24px] bg-app-panel shadow-sm ring-1 ring-black/5"
        aria-hidden="true"
      />
    );
  }

  if (expanded) {
    const remainingSec = Math.max(0, durationSec - currentSec);
    return (
      <div className="relative flex h-full w-full min-h-0 flex-col gap-2.5 rounded-[24px] bg-app-panel p-3 shadow-sm ring-1 ring-black/5 animate-fade-in">
        {/* Album art header — gradient + title; close sits on this panel (matches voice enlarged layout) */}
        <div className="relative h-[min(28%,140px)] min-h-[100px] shrink-0 overflow-hidden rounded-[20px] bg-gradient-to-br from-amber-300 via-rose-400 to-indigo-600 ring-2 ring-sky-400/80">
          <div className="absolute inset-0 bg-black/15" />
          {onToggleExpand && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white ring-1 ring-white/25 hover:bg-black/55"
              aria-label={t("media.collapse")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 pt-1 text-center">
            <div
              className="max-w-full whitespace-normal font-extrabold italic uppercase leading-[0.95] tracking-tight text-white drop-shadow-md"
              style={{ fontSize: "clamp(1.1rem, 3.2vmin, 1.85rem)" }}
            >
              {cur.title}
            </div>
            <div
              className="mt-1 max-w-full whitespace-normal font-bold uppercase tracking-[0.16em] text-white/95"
              style={{ fontSize: "clamp(0.55rem, 0.65rem, 0.8rem)" }}
            >
              {cur.artist}
            </div>
          </div>
        </div>

        {/* Now playing title (left-aligned) */}
        <div
          className="px-1 break-words pb-[2px] font-semibold leading-[1.2] line-clamp-3"
          style={{ fontSize: "clamp(0.85rem, 0.95rem, 1.15rem)" }}
        >
          {cur.title}
        </div>

        {/* Progress bar */}
        <div className="px-1">
          <input
            type="range" min={0} max={1} step={0.001} value={progress}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="h-1 w-full accent-foreground"
            aria-label={t("media.progress")}
          />
          <div
            className="mt-1 flex items-center justify-between tabular-nums text-foreground/60"
            style={{ fontSize: "clamp(0.55rem, 0.62rem, 0.75rem)" }}
          >
            <span>{formatTime(currentSec)}</span>
            <span>-{formatTime(remainingSec)}</span>
          </div>
        </div>

        {/* Controls: repeat, prev, play (tall pill), next, shuffle */}
        <div className="flex items-center justify-center gap-5 px-1 sm:gap-6">
          <button
            onClick={() => {
              const next = !repeatOne;
              setRepeatOne(next);
              if (next) setShuffle(false);
            }}
            className={`${repeatOne ? "text-[var(--brand)]" : "text-foreground/80"}`}
            aria-label={t("media.repeatOne")}
            aria-pressed={repeatOne}
          >
            <Repeat className="h-4 w-4" />
          </button>
          <button onClick={() => skip(-1)} aria-label={t("media.previousTrack")}><SkipBack className="h-5 w-5" /></button>
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            className="flex h-[52px] w-[42px] shrink-0 items-center justify-center rounded-[22px] bg-[var(--active)] text-foreground shadow-md ring-1 ring-foreground/15 transition hover:brightness-110 active:brightness-95"
            aria-label={t("media.playPause")}
          >
            {playing ? (
              <Pause className="h-5 w-5" strokeWidth={2.5} aria-hidden />
            ) : (
              <Play className="h-5 w-5 pl-0.5" strokeWidth={2.5} aria-hidden />
            )}
          </button>
          <button onClick={() => skip(1)} aria-label={t("media.nextTrack")}><SkipForward className="h-5 w-5" /></button>
          <button
            onClick={() => {
              const next = !shuffle;
              setShuffle(next);
              if (next) setRepeatOne(false);
            }}
            className={`${shuffle ? "text-[var(--brand)]" : "text-foreground/80"}`}
            aria-label={t("media.shuffle")}
            aria-pressed={shuffle}
          >
            <Shuffle className="h-4 w-4" />
          </button>
        </div>

        {/* Volume slider with single icon (left) */}
        <div className="flex items-center gap-2 px-1">
          <Volume2 className="h-3.5 w-3.5 text-foreground/70" />
          <input
            type="range" min={0} max={1} step={0.01} value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-1 flex-1 accent-foreground"
            aria-label={t("media.volume")}
          />
        </div>

        {/* Queue — scrollable; current track highlighted */}
        <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thick] [scrollbar-color:rgba(255,255,255,0.35)_transparent]">
          {PLAYLIST.map((tt, i) => (
            <button
              key={i}
              onClick={() => {
                setTrackIdx(i);
                setPlaying(true);
              }}
              className={`flex w-full min-w-0 items-center gap-1.5 rounded-[14px] px-3 py-2.5 text-left ${
                i === trackIdx
                  ? "bg-[var(--brand)]/22 font-semibold text-foreground ring-1 ring-[var(--brand)]/40"
                  : "bg-app-panel-soft/80 hover:brightness-95"
              }`}
              style={{ fontSize: "clamp(0.65rem, 0.75rem, 0.95rem)" }}
            >
              <span className="min-w-0 truncate font-medium">{tt.title}</span>
              <span className="shrink-0 text-foreground/55">— {tt.artist}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Compact card
  const canExpand = !!onToggleExpand;
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  return (
    <div
      className={`relative flex h-full w-full flex-col rounded-[24px] bg-app-panel px-3 pt-3 pb-2 text-foreground shadow-sm ring-1 ring-black/5 transition ${
        canExpand ? "cursor-pointer hover:ring-black/10" : ""
      }`}
      onClick={canExpand ? onToggleExpand : undefined}
      role={canExpand ? "button" : undefined}
      aria-label={canExpand ? t("media.expandPanel") : undefined}
    >
      <div className="mb-2 break-words pb-[2px] text-center text-sm font-bold leading-[1.2] text-foreground/95 line-clamp-3">
        {cur.title}
      </div>
      {/* Controls + slider: fixed-size region (does not scale with font size) */}
      <div style={{ fontSize: "16px" }}>
        <div className="grid grid-cols-3 items-center gap-[4px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const next = !repeatOne;
              setRepeatOne(next);
              if (next) setShuffle(false);
            }}
            className={`${repeatOne ? "text-[var(--brand)]" : "text-foreground/80"} justify-self-start`}
            aria-label={t("media.repeatOne")}
            aria-pressed={repeatOne}
          >
            <Repeat className="h-[14px] w-[14px]" />
          </button>
          <div className="flex items-center justify-self-center gap-[8px]">
            <button onClick={(e) => { stop(e); skip(-1); }} aria-label={t("media.previousTrack")}><SkipBack className="h-[16px] w-[16px]" /></button>
            <button
              onClick={(e) => { stop(e); setPlaying(!playing); }}
              className="flex items-center justify-center rounded-full bg-[var(--active)] hover:bg-[var(--active)]/80"
              style={{ width: 36, height: 36 }}
              aria-label={t("media.playPause")}
            >
              {playing ? <Pause className="h-[14px] w-[14px]" /> : <Play className="h-[14px] w-[14px]" />}
            </button>
            <button onClick={(e) => { stop(e); skip(1); }} aria-label={t("media.nextTrack")}><SkipForward className="h-[16px] w-[16px]" /></button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const next = !shuffle;
              setShuffle(next);
              if (next) setRepeatOne(false);
            }}
            className={`${shuffle ? "text-[var(--brand)]" : "text-foreground/80"} justify-self-end`}
            aria-label={t("media.shuffle")}
            aria-pressed={shuffle}
          >
            <Shuffle className="h-[14px] w-[14px]" />
          </button>
        </div>
        <div className="mt-[6px] flex items-center gap-[6px] px-[2px]">
          <Volume2 className="h-[12px] w-[12px] shrink-0 text-foreground/85" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            onClick={stop}
            onMouseDown={stop}
            onTouchStart={stop}
            className="h-1 flex-1 accent-[var(--brand)]"
            aria-label={t("media.volume")}
          />
          <Volume2 className="h-[12px] w-[12px] shrink-0 text-foreground/85" />
        </div>
      </div>
    </div>
  );
}
