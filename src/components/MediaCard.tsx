import { useApp } from "@/lib/app-context";
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
  /**
   * When true, render an empty placeholder panel only — no song info, no
   * controls, no audio interaction. Used on pages like /voice where the
   * MediaCard is mounted but should not display any music.
   */
  hidden?: boolean;
}

export function MediaCard({ expanded = false, onToggleExpand, hidden = false }: Props) {
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
        className="relative flex h-full w-full items-center justify-center rounded-[24px] bg-[var(--panel)] shadow-sm ring-1 ring-black/5"
        aria-hidden="true"
      />
    );
  }

  if (expanded) {
    const remainingSec = Math.max(0, durationSec - currentSec);
    return (
      <div className="relative flex h-full w-full flex-col gap-2.5 rounded-[24px] bg-[var(--panel)] p-3 shadow-sm ring-1 ring-black/5 animate-fade-in">
        {/* Album art card */}
        <div className="relative h-[120px] shrink-0 overflow-hidden rounded-[18px] bg-gradient-to-br from-amber-300 via-rose-400 to-indigo-600 ring-2 ring-sky-400">
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <div className="max-w-full whitespace-normal text-[30px] font-extrabold italic uppercase leading-[0.95] tracking-tight text-white drop-shadow">
              {cur.title}
            </div>
            <div className="mt-1 max-w-full whitespace-normal text-[10px] font-bold uppercase tracking-[0.16em] text-white/95">
              {cur.artist}
            </div>
          </div>
        </div>

        {/* Now playing title (left-aligned) */}
        <div className="px-1 truncate text-[15px] font-semibold leading-none">{cur.title}</div>

        {/* Progress bar */}
        <div className="px-1">
          <input
            type="range" min={0} max={1} step={0.001} value={progress}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="h-1 w-full accent-foreground"
            aria-label="Progress"
          />
          <div className="mt-1 flex items-center justify-between text-[10px] tabular-nums text-foreground/60">
            <span>{formatTime(currentSec)}</span>
            <span>-{formatTime(remainingSec)}</span>
          </div>
        </div>

        {/* Controls: repeat, prev, play (big circle), next, random */}
        <div className="flex items-center justify-center gap-6 px-1">
          <button
            onClick={() => {
              const next = !repeatOne;
              setRepeatOne(next);
              if (next) setShuffle(false);
            }}
            className={`${repeatOne ? "text-[var(--brand)]" : "text-foreground/80"}`}
            aria-label="Repeat current"
            aria-pressed={repeatOne}
          >
            <Repeat className="h-4 w-4" />
          </button>
          <button onClick={() => skip(-1)} aria-label="Previous"><SkipBack className="h-5 w-5" /></button>
          <button
            onClick={() => setPlaying(!playing)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background shadow"
            aria-label="Play/Pause"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button onClick={() => skip(1)} aria-label="Next"><SkipForward className="h-5 w-5" /></button>
          <button
            onClick={() => {
              const next = !shuffle;
              setShuffle(next);
              if (next) setRepeatOne(false);
            }}
            className={`${shuffle ? "text-[var(--brand)]" : "text-foreground/80"}`}
            aria-label="Shuffle"
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
            aria-label="Volume"
          />
        </div>

        {/* Playlist as light pills */}
        <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
          {PLAYLIST.map((tt, i) => (
            <button
              key={i}
              onClick={() => {
                setTrackIdx(i);
                setPlaying(true);
              }}
              className={`flex w-full items-center gap-2 rounded-[14px] px-3 py-2 text-left text-[12px] ${
                i === trackIdx
                  ? "bg-[var(--brand)]/20 font-semibold text-foreground ring-1 ring-[var(--brand)]/35"
                  : "bg-[var(--panel-soft)] hover:brightness-95"
              }`}
            >
              <span className="truncate font-medium">{tt.title}</span>
              <span className="text-foreground/55">– {tt.artist}</span>
            </button>
          ))}
        </div>

        {onToggleExpand && (
          <button onClick={onToggleExpand} className="absolute right-3 top-3 z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/35 text-white hover:bg-black/50" aria-label="Collapse">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  // Compact card
  const canExpand = !!onToggleExpand;
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  return (
    <div
      className={`relative flex h-full w-full flex-col rounded-[24px] bg-[var(--panel)] px-3 py-2.5 text-foreground shadow-sm ring-1 ring-black/5 transition ${
        canExpand ? "cursor-pointer hover:ring-black/10" : ""
      }`}
      onClick={canExpand ? onToggleExpand : undefined}
      role={canExpand ? "button" : undefined}
      aria-label={canExpand ? "Expand music panel" : undefined}
    >
      <div className="mb-1.5 truncate text-center text-sm font-bold leading-tight text-foreground/95">
        {cur.title}
      </div>
      <div className="grid grid-cols-3 items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const next = !repeatOne;
            setRepeatOne(next);
            if (next) setShuffle(false);
          }}
          className={`${repeatOne ? "text-[var(--brand)]" : "text-foreground/80"} justify-self-start`}
          aria-label="Repeat current"
          aria-pressed={repeatOne}
        >
          <Repeat className="h-3.5 w-3.5" />
        </button>
        <div className="flex items-center justify-self-center gap-2">
          <button onClick={(e) => { stop(e); skip(-1); }} aria-label="Previous"><SkipBack className="h-4 w-4" /></button>
          <button onClick={(e) => { stop(e); setPlaying(!playing); }} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--active)] hover:bg-[var(--active)]/80" aria-label="Play/Pause">
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button onClick={(e) => { stop(e); skip(1); }} aria-label="Next"><SkipForward className="h-4 w-4" /></button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const next = !shuffle;
            setShuffle(next);
            if (next) setRepeatOne(false);
          }}
          className={`${shuffle ? "text-[var(--brand)]" : "text-foreground/80"} justify-self-end`}
          aria-label="Shuffle"
          aria-pressed={shuffle}
        >
          <Shuffle className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 px-0.5">
        <Volume2 className="h-3 w-3 shrink-0 text-foreground/85" />
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
          aria-label="Volume"
        />
        <Volume2 className="h-3 w-3 shrink-0 text-foreground/85" />
      </div>
    </div>
  );
}
