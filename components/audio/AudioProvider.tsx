"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { soundtrack } from "@/content/site";
import { audioSignals } from "@/lib/audioStore";
import { usePrefersReducedMotion } from "@/lib/hooks";

type AudioAPI = {
  started: boolean;
  playing: boolean;
  muted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  /** Kick off playback with a cinematic fade-in (call inside a user gesture). */
  begin: () => void;
  toggle: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  seek: (t: number) => void;
};

const Ctx = createContext<AudioAPI | null>(null);
export const useAudio = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAudio must be used inside <AudioProvider>");
  return c;
};

const POS_KEY = "ebony-audio-pos";
const TARGET = soundtrack.targetVolume;

export default function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const acRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef(0);
  const fadeRef = useRef(0);
  const reduced = usePrefersReducedMotion();

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVol] = useState(TARGET);
  const [currentTime, setCT] = useState(0);
  const [duration, setDur] = useState(0);

  // ── Lightweight UI ticker (no per-frame React renders) ──
  useEffect(() => {
    const id = setInterval(() => {
      const a = audioRef.current;
      if (!a) return;
      setCT(a.currentTime);
      if (a.duration) setDur(a.duration);
      setPlaying(!a.paused);
      audioSignals.time = a.currentTime;
      audioSignals.duration = a.duration || 0;
      audioSignals.playing = !a.paused;
      if (a.currentTime > 0) {
        try {
          localStorage.setItem(POS_KEY, String(a.currentTime));
        } catch {}
      }
    }, 300);
    return () => clearInterval(id);
  }, []);

  // ── Real-time loudness analyser → audioSignals.intensity ──
  const startAnalyser = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const buf = new Uint8Array(analyser.fftSize);
    let smooth = 0;
    const loop = () => {
      analyser.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const x = (buf[i] - 128) / 128;
        sum += x * x;
      }
      const rms = Math.sqrt(sum / buf.length);
      const level = Math.min(1, rms * 3.4);
      smooth += (level - smooth) * 0.1;
      audioSignals.intensity = reduced ? 0 : smooth;
      rafRef.current = requestAnimationFrame(loop);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [reduced]);

  const stopAnalyser = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    audioSignals.intensity = 0;
  }, []);

  const fadeTo = useCallback((target: number, ms: number) => {
    const a = audioRef.current;
    if (!a) return;
    cancelAnimationFrame(fadeRef.current);
    const start = a.volume;
    const t0 = performance.now();
    const step = (now: number) => {
      // clamp k to [0,1]: the first rAF timestamp can precede t0, which would
      // otherwise drive volume negative and throw (leaving playback silent).
      const k = Math.max(0, Math.min(1, (now - t0) / ms));
      a.volume = Math.max(0, Math.min(1, start + (target - start) * k));
      if (k < 1) fadeRef.current = requestAnimationFrame(step);
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const begin = useCallback(() => {
    const a = audioRef.current;
    setStarted(true);
    if (!a) return;

    // resume where she left off (across reloads)
    try {
      const saved = parseFloat(localStorage.getItem(POS_KEY) || "0");
      if (saved > 2 && (!a.duration || saved < a.duration - 3)) a.currentTime = saved;
    } catch {}

    // build the Web Audio graph once, for the reactive analyser
    try {
      if (!acRef.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AC) {
          const ac = new AC();
          const src = ac.createMediaElementSource(a);
          const an = ac.createAnalyser();
          an.fftSize = 1024;
          src.connect(an);
          an.connect(ac.destination);
          acRef.current = ac;
          analyserRef.current = an;
        }
      }
      acRef.current?.resume?.();
    } catch {}

    a.muted = false;
    a.volume = 0;
    a
      .play()
      .then(() => {
        setPlaying(true);
        fadeTo(muted ? 0 : volume, soundtrack.fadeSeconds * 1000);
        startAnalyser();
      })
      .catch(() => {
        /* file may be missing; the experience still runs silently */
      });
  }, [fadeTo, startAnalyser, muted, volume]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => {
        setPlaying(true);
        startAnalyser();
      }).catch(() => {});
    } else {
      a.pause();
      setPlaying(false);
      stopAnalyser();
    }
  }, [startAnalyser, stopAnalyser]);

  const setVolume = useCallback((v: number) => {
    const a = audioRef.current;
    setVol(v);
    if (a) {
      a.volume = v;
      if (v > 0 && a.muted) {
        a.muted = false;
        setMuted(false);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  }, []);

  const seek = useCallback((t: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(t, a.duration || t));
    setCT(a.currentTime);
  }, []);

  // cleanup + save on hide
  useEffect(() => {
    const save = () => {
      const a = audioRef.current;
      if (a && a.currentTime > 0) {
        try {
          localStorage.setItem(POS_KEY, String(a.currentTime));
        } catch {}
      }
    };
    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", save);
    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(fadeRef.current);
      window.removeEventListener("pagehide", save);
      window.removeEventListener("beforeunload", save);
    };
  }, []);

  return (
    <Ctx.Provider
      value={{ started, playing, muted, volume, currentTime, duration, begin, toggle, setVolume, toggleMute, seek }}
    >
      {/* the one and only audio element — metadata only, streamed on demand.
          crossOrigin lets the CDN file feed the Web-Audio analyser without
          being silenced as a tainted cross-origin source. */}
      <audio
        ref={audioRef}
        src={soundtrack.src}
        crossOrigin="anonymous"
        preload="metadata"
        loop
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration || 0)}
      />
      {children}
    </Ctx.Provider>
  );
}
