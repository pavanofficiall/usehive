"use client";

import { useEffect, useRef, useState } from "react";
import { resolveSocialEmbed } from "@/lib/social-embed";

type XWindow = Window & { twttr?: { widgets?: { load: (element?: HTMLElement | null) => void } } };

export function SocialEmbed({ url }: { url: string }) {
  const embed = resolveSocialEmbed(url);
  const [loadX, setLoadX] = useState(false);
  const xRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadX || embed?.kind !== "x") return;
    const xWindow = window as XWindow;
    const render = () => xWindow.twttr?.widgets?.load(xRef.current);
    let script = document.getElementById("hive-x-widgets") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "hive-x-widgets";
      script.src = "https://platform.x.com/widgets.js";
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", render);
    render();
    return () => script?.removeEventListener("load", render);
  }, [loadX, embed?.kind, url]);

  if (!embed) return null;

  return <section className={`article-embed article-embed-${embed.kind}`} aria-label={`${embed.label} embed`}>
    {embed.kind === "youtube" && <div className="article-embed-video"><iframe src={embed.embedUrl} title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>}
    {embed.kind === "x" && (loadX
      ? <div ref={xRef} className="article-embed-x-content"><blockquote className="twitter-tweet" data-theme="dark"><a href={embed.url}>View post on X</a></blockquote></div>
      : <button type="button" className="article-embed-load" onClick={() => setLoadX(true)}>Load X post</button>)}
    {(embed.kind === "reddit" || embed.kind === "linkedin") && <iframe className="article-embed-post" src={embed.embedUrl} title={`${embed.label} post`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" />}
    <a className="article-embed-source" href={embed.url} target="_blank" rel="noopener noreferrer">{embed.kind === "link" ? `Open ${embed.label}` : `View on ${embed.label}`} ↗</a>
  </section>;
}
