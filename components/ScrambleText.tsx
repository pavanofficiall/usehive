"use client";

import { useEffect, useRef, useState } from "react";

type ScrambleTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
};

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]+*#_";

function scrambleCharacter(character: string) {
  if (/\s/.test(character)) return character;
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

export default function ScrambleText({
  text,
  className = "",
  delay = 0,
  duration = 860,
}: ScrambleTextProps) {
  const root = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let hasPlayed = false;

    const play = () => {
      const startedAt = performance.now();
      setIsScrambling(true);

      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const resolvedCount = Math.floor(eased * text.length);

        setDisplayText(
          [...text]
            .map((character, index) =>
              index < resolvedCount ? character : scrambleCharacter(character),
            )
            .join(""),
        );

        if (progress < 1) frame.current = requestAnimationFrame(tick);
        else {
          setDisplayText(text);
          setIsScrambling(false);
        }
      };

      frame.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasPlayed) return;
        hasPlayed = true;
        timeout.current = setTimeout(play, delay);
        observer.unobserve(element);
      },
      { threshold: 0.22, rootMargin: "0px 0px -8%" },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [delay, duration, text]);

  let characterOffset = 0;
  const tokens = text.split(/(\s+)/);

  return (
    <span
      ref={root}
      className={`scramble-text ${className}`}
      data-scrambling={isScrambling}
      role="text"
      aria-label={text}
    >
      <span className="scramble-text__content" aria-hidden="true">
        {tokens.map((token, tokenIndex) => {
          const tokenStart = characterOffset;
          characterOffset += token.length;

          if (/^\s+$/.test(token)) {
            return <span className="scramble-text__space" key={`space-${tokenIndex}`}>{token}</span>;
          }

          return (
            <span className="scramble-text__word" key={`word-${tokenIndex}`}>
              {Array.from(token).map((character, characterIndex) => {
                const displayCharacter = displayText[tokenStart + characterIndex] ?? character;
                return (
                  <span className="scramble-text__character" key={`${tokenIndex}-${characterIndex}`}>
                    <span className="scramble-text__measure">{character}</span>
                    <span className="scramble-text__animated">{displayCharacter}</span>
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </span>
  );
}
