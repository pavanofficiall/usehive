"use client";

import React, { useEffect, useMemo, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePhoneLayout } from "@/components/use-phone-layout";

gsap.registerPlugin(ScrollTrigger);

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface ScrollRevealProps {
  children: string;
  as?: Tag;
  className?: string;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  wordAnimationEnd?: string;
}

// Installed with `shadcn add @react-bits/ScrollReveal-TS-TW`, then scoped to this site.
export default function ScrollReveal({
  children,
  as = "p",
  className = "",
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.18,
  baseRotation = 0,
  blurStrength = 7,
  wordAnimationEnd = "top 42%",
}: ScrollRevealProps) {
  const phone = usePhoneLayout();
  const containerRef = useRef<HTMLElement>(null);

  const words = useMemo(() => children.split(/(\s+)/).map((part, index) =>
    /^\s+$/.test(part) ? part : <span className="inline-block word" key={index}>{part}</span>
  ), [children]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const spans = element.querySelectorAll<HTMLElement>(".word");
    if (phone || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(spans, { clearProps: "opacity,filter" });
      gsap.set(element, { clearProps: "transform" });
      return;
    }
    const scroller = scrollContainerRef?.current || window;
    const trigger = { trigger: element, scroller, start: "top 92%", end: wordAnimationEnd, scrub: true };
    const animations = [
      gsap.fromTo(spans, { opacity: baseOpacity }, { opacity: 1, stagger: 0.04, ease: "none", scrollTrigger: trigger }),
    ];
    if (baseRotation) {
      animations.push(gsap.fromTo(element, { rotate: baseRotation, transformOrigin: "0% 50%" }, {
        rotate: 0, ease: "none", scrollTrigger: { ...trigger },
      }));
    }
    if (enableBlur) {
      animations.push(gsap.fromTo(spans, { filter: `blur(${blurStrength}px)` }, {
        filter: "blur(0px)", stagger: 0.04, ease: "none", scrollTrigger: { ...trigger },
      }));
    }
    return () => {
      animations.forEach(animation => {
        animation.scrollTrigger?.kill();
        animation.kill();
      });
      gsap.set(spans, { clearProps: "opacity,filter" });
      gsap.set(element, { clearProps: "transform" });
    };
  }, [phone, scrollContainerRef, enableBlur, baseOpacity, baseRotation, blurStrength, wordAnimationEnd]);

  return React.createElement(as, { ref: containerRef, className }, words);
}
