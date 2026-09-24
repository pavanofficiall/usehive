"use client";
import { usePhoneLayout } from "@/components/use-phone-layout";
import BlurText from "@/components/reactbits/BlurText";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export function FooterWordmark() {
  const phone = usePhoneLayout();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (phone) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(".footer-wordmark-text", { yPercent: 65 }, { yPercent: 20, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: .5 } });
    }, ref);
    return () => context.revert();
  }, [phone]);
  return <div className="footer-wordmark" ref={ref} aria-hidden="true"><span className="footer-wordmark-mobile">HIVE</span><span className="footer-wordmark-text"><BlurText text="HIVE" animateBy="letters" delay={70} stepDuration={0.25}/></span></div>;
}
