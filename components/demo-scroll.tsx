"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

export function DemoScroll() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    const region = root.current, box = frame.current, media = video.current;
    if (!region || !box || !media) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, active = false;
    const update = () => {
      raf = 0;
      const rect = region.getBoundingClientRect();
      const height = box.offsetHeight;
      const stage = box.parentElement;
      const centerTop = stage ? parseFloat(getComputedStyle(stage).top) : (innerHeight - height) / 2;
      const distance = Math.max(0, centerTop - rect.top);
      const progress = reduced.matches ? 1 : Math.min(1, distance / (innerHeight * .65));
      const startScale = innerWidth <= 700 ? .94 : .8;
      box.style.transform = `scale(${startScale + (1 - startScale) * progress})`;
      box.style.borderRadius = `${22 - 10 * progress}px`;
      const shouldPlay = progress >= .995 && rect.top <= centerTop + 2 && rect.bottom >= centerTop + height - 2;
      if (shouldPlay !== active) {
        active = shouldPlay;
        if (active) media.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
        else { media.pause(); setBlocked(false); }
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule); observer.observe(box);
    return () => { removeEventListener("scroll", schedule); removeEventListener("resize", schedule); observer.disconnect(); cancelAnimationFrame(raf); media.pause(); };
  }, []);
  return <div className="demo-hold-region" ref={root} id="demo">
    <div className="demo-center-stage">
      <div className="demo-scale-frame" ref={frame}>
        <video ref={video} src="/hive-demo.mp4" poster="/hive-demo-poster.jpg" preload="metadata" muted={muted} loop playsInline aria-label="HIVE product demo"/>
        <button type="button" className="demo-volume" aria-label={muted ? "Turn video sound on" : "Mute video"} aria-pressed={!muted} onClick={() => setMuted(value => !value)}>{muted ? <VolumeX size={19}/> : <Volume2 size={19}/>}</button>
        {blocked && <button className="demo-play" onClick={() => video.current?.play().then(() => setBlocked(false))}><Play size={18}/> Play demo</button>}
      </div>
    </div>
  </div>;
}
