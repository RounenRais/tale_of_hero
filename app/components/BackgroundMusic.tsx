"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);

  // autoplay dene + engellenirse ilk etkileşimde başlat
  useEffect(() => {
    const audio = new Audio("/audio/bg.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.muted = true; // güvenli autoplay
    audioRef.current = audio;

    const tryPlay = async () => {
      try {
        await audio.play();
      } catch {
      }
    };

    tryPlay();

    const resumeOnGesture = async () => {
      try {
        await audio.play();
      } catch {}
      window.removeEventListener("pointerdown", resumeOnGesture);
      window.removeEventListener("keydown", resumeOnGesture);
      window.removeEventListener("touchstart", resumeOnGesture);
    };
    window.addEventListener("pointerdown", resumeOnGesture, { once: true });
    window.addEventListener("touchstart", resumeOnGesture, { once: true });
    window.addEventListener("keydown", resumeOnGesture, { once: true });
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMute = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
      } catch {}
    }

    const next = !muted;
    setMuted(next);
    a.muted = next;
  };

  return (
    <button onClick={toggleMute} aria-label={muted ? "Sesi aç" : "Sesi kapat"} className="z-1">
      <Image alt="music" src={muted ? "/sprites/mute.png" : "/sprites/opensound.png"} width={20} height={20}/>
    </button>
  );
}
