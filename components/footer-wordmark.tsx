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
      gsap.fromTo(".footer-wordmark-text", { yPercent: 55 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: .5 } });
    }, ref);
    return () => context.revert();
  }, [phone]);
  return <div className="footer-wordmark" ref={ref} aria-hidden="true"><svg className="footer-wordmark-mobile" viewBox="0 0 400 120" focusable="false" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter">
      <path d="M2 2H17V51H77V2H92V118H77V66H17V118H2Z" />
      <path d="M111 2H126V118H111Z" />
      <path d="M145 2H162L197 97L232 2H249L205 118H189Z" />
      <path d="M268 2H398V17H284V51H383V66H284V103H398V118H268Z" />
    </g>
  </svg><span className="footer-wordmark-text"><BlurText text="HIVE" animateBy="letters" delay={70} stepDuration={0.25}/></span></div>;
}
