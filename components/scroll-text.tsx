"use client";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
export function ScrollText({ children, as = "span", className = "" }: { children: string; as?: "h1" | "h2" | "h3" | "p" | "span" | "div"; className?: string }) {
  return <ScrollReveal as={as} containerClassName={`content-scroll ${className}`} baseOpacity={0.2} baseRotation={0} blurStrength={7} rotationEnd="top 60%" wordAnimationEnd="bottom 65%">{children}</ScrollReveal>;
}
