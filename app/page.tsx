"use client";

import { ScrollText } from "@/components/scroll-text";
import { useEffect, useState } from "react";
import BlurText from "@/components/reactbits/BlurText";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import { DemoScroll } from "@/components/demo-scroll";
import { CliCopy } from "@/components/cli-copy";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function Home() {
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const update = () => setIntroReady(document.documentElement.dataset.hiveIntroReady === "true");
    update();
    window.addEventListener("hive:intro-ready", update);
    return () => window.removeEventListener("hive:intro-ready", update);
  }, []);

  return <>
    <div className="sky-backdrop" aria-hidden="true" />
    <main className="site-shell home-shell">
      <SiteHeader />
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-intro">
          <h1 id="hero-title">
            <span className="hero-title-line"><BlurText text="Build your MCP layer." play={introReady} delay={45} stepDuration={0.22} animationFrom={{ filter: "blur(22px)", opacity: 0, y: 28 }} animationTo={[{ filter: "blur(11px)", opacity: 0.45, y: 8 }, { filter: "blur(0px)", opacity: 1, y: 0 }]}/></span>
            <span className="hero-title-line hero-title-italic"><BlurText text="Keep it in sync." play={introReady} delay={55} stepDuration={0.25} animationFrom={{ filter: "blur(24px)", opacity: 0, y: 32 }} animationTo={[{ filter: "blur(12px)", opacity: 0.4, y: 9 }, { filter: "blur(0px)", opacity: 1, y: 0 }]}/></span>
          </h1>
          <p className={introReady ? "hero-copy hero-copy-ready" : "hero-copy"}>A developer CLI to build a production ready MCP layer for your product, then keep it current as the product changes.</p>
          <CliCopy ready={introReady}/>
        </div>
        <DemoScroll/>
      </section>

      <section className="idea-section" aria-label="How HIVE works">
        <div className="section-glow-line" aria-hidden="true" />
        <div className="idea-inner">
          <ScrollText as="div" className="idea-overline">THE IDEA</ScrollText>
          <ScrollReveal containerClassName="idea-title" textClassName="idea-title-text" baseOpacity={0.18} baseRotation={0} blurStrength={10} rotationEnd="top center" wordAnimationEnd="center center">
            One MCP layer. Built to keep up.
          </ScrollReveal>
          <div className="concept-row">
            <div className="concept-image reveal"><img src="/concept-build.jpg" alt="HIVE CLI demo still" width={1280} height={720} loading="lazy"/></div>
            <div className="concept-copy"><ScrollText as="span" className="concept-kicker">BUILD</ScrollText><ScrollText as="h3">Start with the product you already have.</ScrollText><ScrollText as="p">HIVE helps developers create a production ready MCP server or layer through a CLI, so AI clients can work with the product.</ScrollText></div>
          </div>
          <div className="concept-row concept-row-reverse">
            <div className="concept-image reveal"><img src="/concept-sync.jpg" alt="Blue sky texture" width={1280} height={720} loading="lazy"/></div>
            <div className="concept-copy"><ScrollText as="span" className="concept-kicker">STAY CURRENT</ScrollText><ScrollText as="h3">Ship changes without leaving the layer behind.</ScrollText><ScrollText as="p">As your product changes, HIVE keeps the MCP layer in sync. The interface developers and agents use stays aligned with what your product can do.</ScrollText></div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  </>;
}
