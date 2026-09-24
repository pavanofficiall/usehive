"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import TextType from "@/components/reactbits/TextType";

const INTRO_SEEN_KEY = "hive:intro-seen";

type Phase = "checking" | "loading" | "leaving" | "done";

function loadImage(src: string): Promise<void> {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
    if (image.complete) resolve();
  });
}

export function SiteEffects() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("checking");

  const [assetsReady, setAssetsReady] = useState(false);
  const [typed, setTyped] = useState(false);
  const finishTyping = useCallback(() => setTyped(true), []);
  useEffect(() => {
    if (phase !== "loading" || !assetsReady || !typed) return;
    const hold = window.setTimeout(() => setPhase("leaving"), 2000);
    return () => window.clearTimeout(hold);
  }, [assetsReady, typed, phase]);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(INTRO_SEEN_KEY) === "true"; } catch { /* Storage can be unavailable in private browsers. */ }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.dataset.hiveIntroReady = "true";
      window.dispatchEvent(new Event("hive:intro-ready"));
      setPhase("done");
      return;
    }
    setPhase("loading");
    let cancelled = false;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.hiveIntroReady = "false";
    const minimum = new Promise<void>(resolve => window.setTimeout(resolve, 650));
    const maximum = new Promise<void>(resolve => window.setTimeout(resolve, 2400));
    const assets = Promise.all([loadImage("/blue-sky.jpg"), loadImage("/hive-demo-poster.jpg"), document.fonts.ready]);
    Promise.race([Promise.all([minimum, assets]), maximum]).then(() => {
      if (!cancelled) setAssetsReady(true);
    });
    return () => {
      cancelled = true;
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    try { sessionStorage.setItem(INTRO_SEEN_KEY, "true"); } catch { /* Continue when browser storage is blocked. */ }
    const readyTimer = window.setTimeout(() => {
      document.documentElement.dataset.hiveIntroReady = "true";
      window.dispatchEvent(new Event("hive:intro-ready"));
    }, 40);
    const doneTimer = window.setTimeout(() => {
      document.documentElement.style.overflow = "";
      setPhase("done");
    }, 500);
    return () => { window.clearTimeout(readyTimer); window.clearTimeout(doneTimer); };
  }, [phase]);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach(element => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: .12, rootMargin: "0px 0px -4% 0px" });
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  if (phase === "checking" || phase === "done") return null;
  return <div className={phase === "leaving" ? "intro-loader leaving" : "intro-loader"} role="status" aria-label="Loading HIVE">
    <div className="intro-tagline" aria-label="On a mission to change human web into agentic.">
      <TextType text="On a mission to change human web into agentic." typingSpeed={55} initialDelay={50} loop={false} cursorCharacter="▏" onSentenceComplete={finishTyping} aria-hidden="true"/>
    </div>
  </div>;
}
