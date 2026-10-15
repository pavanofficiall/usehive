"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { HexHalftone } from "./hex-halftone";
import styles from "./lab.module.css";

const command = "npx @usehive/cli scan --install";

// Night sky to cloud white; the cursor lights cells up in pale sky blue.
const glow = "#dff3ff";
const skyPalette = ["#0a1d33", "#123a63", "#1d5fa6", "#3d8fe0", "#7cc0ff", "#cbe8ff", "#ffffff"];

export function HeroField() {
  return <HexHalftone className={styles.field} source={{ image: "/lab/sky-source.webp" }} palette={skyPalette} cell={11} gamma={1.15} floor={0.16} radius={64} heat={glow} />;
}

/** A giant HIVE wordmark rising out of a soft dome, drawn at sampling resolution. */
function paintWordmark(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const dome = ctx.createRadialGradient(w / 2, h * 1.15, 0, w / 2, h * 1.15, w * 0.75);
  dome.addColorStop(0, "rgba(255,255,255,0.42)");
  dome.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = dome;
  ctx.fillRect(0, 0, w, h);

  let size = h * 1.1;
  ctx.font = `800 ${size}px Geist, Arial, sans-serif`;
  const measured = ctx.measureText("HIVE").width;
  size *= (w * 0.94) / measured;
  ctx.font = `800 ${size}px Geist, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const top = h * 1.12 - size * 0.72;
  const fill = ctx.createLinearGradient(0, top, 0, h);
  fill.addColorStop(0, "rgba(255,255,255,1)");
  fill.addColorStop(1, "rgba(255,255,255,0.3)");
  ctx.fillStyle = fill;
  ctx.fillText("HIVE", w / 2, h * 1.12);
}

export function FooterField() {
  return <HexHalftone className={styles.field} source={{ paint: paintWordmark }} palette={skyPalette} cell={10} gamma={1.2} floor={0.05} radius={56} heat={glow} />;
}

export function CopyCommand() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { /* Clipboard can be blocked; the command stays visible to copy by hand. */ }
  }
  return (
    <div className={styles.command}>
      <span aria-hidden="true">$</span>
      <code>{command}</code>
      <button type="button" onClick={copy} aria-label="Copy install command">
        {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
