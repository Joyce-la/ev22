import { useEffect, useRef } from "react";
import { useApp } from "@/lib/app-context";
import healTheWorld from "@/assets/heal-the-world.mp3";
import drivingLight from "@/assets/driving-light.mp3";
import kalimba2 from "@/assets/kalimba (2).mp3";
import shapeOfYou from "@/assets/shape-of-you.mp3";
import whiteChristmas from "@/assets/white-christmas.mp3";
import heyJude from "@/assets/hey-jude.mp3";
import xinYuanBianLiTie from "@/assets/xin-yuan-bian-li-tie.mp3";

// Keep this in sync with MediaCard's PLAYLIST so playback continues across pages.
export const GLOBAL_PLAYLIST = [
  { title: "Heal the World", artist: "Michael Jackson", src: healTheWorld },
  { title: "Driving Light", artist: "Ambient", src: drivingLight },
  { title: "Kalimba", artist: "Mr. Scruff", src: kalimba2 },
  { title: "Shape of You", artist: "Ed Sheeran", src: shapeOfYou },
  { title: "White Christmas", artist: "Bing Crosby", src: whiteChristmas },
  { title: "Hey Jude", artist: "The Beatles", src: heyJude },
  { title: "心愿便利贴", artist: "Local", src: xinYuanBianLiTie },
];

/**
 * A single, app-wide <audio> element that lives at the root of the app.
 * It survives page navigations so music keeps playing on Settings/Bluetooth/Car/etc.,
 * even when no MediaCard is mounted.
 */
export function GlobalAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    playing,
    setPlaying,
    progress,
    setProgress,
    volume,
    repeatOne,
    shuffle,
    trackIdx,
    setTrackIdx,
    setAudioEl,
  } = useApp();

  // Register so other components (Voice/SearchBar) can pause instantly.
  useEffect(() => {
    setAudioEl(audioRef.current);
    return () => setAudioEl(null);
  }, [setAudioEl]);

  // Mirror MediaCard's "play/pause when state or track changes" effect.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [playing, trackIdx, setPlaying]);

  useEffect(() => {
    const a = audioRef.current;
    if (a) a.volume = volume;
  }, [volume]);

  // Persist progress globally as a ratio so MediaCard reflects the same time.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      if (a.duration) setProgress(a.currentTime / a.duration);
    };
    a.addEventListener("timeupdate", onTime);
    return () => a.removeEventListener("timeupdate", onTime);
  }, [setProgress]);

  const cur = GLOBAL_PLAYLIST[trackIdx] ?? GLOBAL_PLAYLIST[0];

  const pickRandomTrack = (excludeIdx: number) => {
    if (GLOBAL_PLAYLIST.length <= 1) return excludeIdx;
    let next = excludeIdx;
    while (next === excludeIdx) next = Math.floor(Math.random() * GLOBAL_PLAYLIST.length);
    return next;
  };

  const handleEnded = () => {
    if (repeatOne) {
      const a = audioRef.current;
      if (!a) return;
      a.currentTime = 0;
      setProgress(0);
      a.play().catch(() => setPlaying(false));
      return;
    }
    const next = shuffle
      ? pickRandomTrack(trackIdx)
      : (trackIdx + 1) % GLOBAL_PLAYLIST.length;
    setTrackIdx(next);
    setProgress(0);
  };

  return (
    <audio
      ref={audioRef}
      src={cur.src}
      onEnded={handleEnded}
      preload="auto"
      style={{ display: "none" }}
    />
  );
}
