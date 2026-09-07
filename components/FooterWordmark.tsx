"use client";

import { useEffect, useRef, useState } from "react";

export default function FooterWordmark() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={visible ? "footer-wordmark footer-wordmark--visible" : "footer-wordmark"}
      ref={root}
      aria-label="Hive"
    >
      {Array.from("HIVE").map((letter, index) => (
        <span className="footer-wordmark__letter" key={`${letter}-${index}`} aria-hidden="true">
          {letter}
        </span>
      ))}
    </div>
  );
}
