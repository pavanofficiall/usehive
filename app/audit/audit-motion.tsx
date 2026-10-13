"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";
import styles from "./audit.module.css";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** True while the site intro screen (SiteEffects) is still covering the page; it fires `hive:intro-ready` when done. */
export function introPending() {
  const { hiveIntro, hiveIntroReady } = document.documentElement.dataset;
  return hiveIntroReady === "false" || (hiveIntro === "pending" && hiveIntroReady !== "true");
}

/**
 * Scroll and entrance animations for the audit page, driven by data attributes so the
 * markup can stay server-rendered:
 *   data-hero          hero elements, played in order once the site intro finishes
 *   data-tilt          hero product shot that flattens out as you scroll
 *   data-reveal        fade up when scrolled into view
 *   data-stagger       fade up each direct child in sequence
 *   data-meter="72"    grow a bar to the given percentage
 *   data-count="52"    count a number up from zero
 */
export function AuditMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      heroTl.from("[data-hero]", { autoAlpha: 0, y: 28, duration: 0.9, stagger: 0.1 });
      const playHero = () => heroTl.play();
      if (introPending()) window.addEventListener("hive:intro-ready", playHero, { once: true });
      else playHero();

      gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach(node => {
        gsap.fromTo(node, { rotateX: 14, scale: 0.94, transformPerspective: 1400, transformOrigin: "50% 0%" }, {
          rotateX: 0, scale: 1, ease: "none",
          scrollTrigger: { trigger: node, start: "top 92%", end: "top 25%", scrub: 0.6 },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(node => {
        gsap.from(node, {
          autoAlpha: 0, y: 32, duration: 0.85, ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach(group => {
        gsap.from(group.children, {
          autoAlpha: 0, y: 28, duration: 0.75, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: group, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-meter]").forEach(bar => {
        gsap.fromTo(bar, { width: "0%" }, {
          width: `${bar.dataset.meter}%`, duration: 1.2, ease: "power2.out",
          scrollTrigger: { trigger: bar, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach(node => {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: Number(node.dataset.count), duration: 1.5, ease: "power2.out",
          onStart: () => { node.textContent = "0"; },
          onUpdate: () => { node.textContent = String(Math.round(counter.value)); },
          scrollTrigger: { trigger: node, start: "top 92%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return <div ref={rootRef}>{children}</div>;
}

type Step = { number: string; title: string; body: string; tag: string; visual: ReactNode };

/** Numbered steps on the left; the matching visual swaps in a sticky panel on the right as you scroll. */
export function MethodSteps({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // Active step = the last one whose top has crossed the line; robust to fast scrolls and jumps.
    const triggers = Array.from(list.children).map((item, index) => ScrollTrigger.create({
      trigger: item,
      start: "top 55%",
      onEnter: () => setActive(index),
      onLeaveBack: () => setActive(Math.max(0, index - 1)),
    }));
    return () => triggers.forEach(trigger => trigger.kill());
  }, []);

  return (
    <div className={styles.methodGrid}>
      <ol className={styles.methodList} ref={listRef}>
        {steps.map((step, index) => (
          <li key={step.number} className={index === active ? styles.methodActive : undefined}>
            <span className={styles.methodNumber}>{step.number}</span>
            <div>
              <span className={styles.methodTag}>{step.tag}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <div className={styles.methodInline}>{step.visual}</div>
            </div>
          </li>
        ))}
      </ol>
      <div className={styles.methodStage} aria-hidden="true">
        <div className={styles.methodStageInner}>
          {steps.map((step, index) => (
            <div key={step.number} className={`${styles.methodVisual} ${index === active ? styles.methodVisualOn : ""}`}>
              {step.visual}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AuditFaq({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={styles.faqList}>
      {items.map((item, index) => {
        const expanded = open === index;
        const id = `audit-faq-${index}`;
        return (
          <div className={`${styles.faqItem} ${expanded ? styles.faqOpen : ""}`} key={item.question}>
            <h3>
              <button type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setOpen(expanded ? null : index)}>
                <span>{item.question}</span>
                <Plus className={styles.faqIcon} size={18} aria-hidden="true" />
              </button>
            </h3>
            <div className={styles.faqPanel} id={id} role="region" aria-hidden={!expanded}>
              <div><p>{item.answer}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
