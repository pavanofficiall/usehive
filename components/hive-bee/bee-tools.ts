// What each bee tool does to the page. Every change is visual, lives only in this
// visitor's browser, and is undone by `reset` or a page refresh.

import { BACKGROUND_PRESETS, type BeeArgs, type BeeTool } from "@/lib/bee/intents";

const STYLE_ID = "hive-bee-style";
const TEXT_ID = "hive-bee-text";
const SECTIONS = { top: "body", demo: ".demo-hold-region", idea: ".idea-section", footer: ".site-footer" } as const;

/** Element the bee should fly to before acting, if any. */
export function targetFor(tool: BeeTool): Element | null {
  if (tool === "move_button") return document.querySelector(".cli-install");
  if (tool === "write_text") return document.getElementById("hero-title");
  if (tool === "set_background") return document.querySelector(".hero");
  return null;
}

function background(color: string) {
  const preset = BACKGROUND_PRESETS[color];
  if (preset === "") return removeStyle();
  const value = preset ?? (CSS.supports("color", color) ? color : null);
  if (!value) return false;
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `.sky-backdrop{background:${value}!important;filter:none!important;transition:background .6s ease}html{background:${preset ? "#0b1026" : value}}`;
  return true;
}

function removeStyle() {
  document.getElementById(STYLE_ID)?.remove();
  return true;
}

function moveButton(position: NonNullable<BeeArgs["position"]>) {
  const box = document.querySelector<HTMLElement>(".cli-install");
  if (!box) return false;
  box.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1)";
  if (position === "center") { box.style.transform = ""; return true; }
  box.style.transform = "";
  const rect = box.getBoundingClientRect();
  const margin = 24;
  const dx = position === "left" ? margin - rect.left : window.innerWidth - margin - rect.right;
  box.style.transform = `translateX(${Math.round(dx)}px)`;
  return true;
}

function writeText(text: string) {
  const title = document.getElementById("hero-title");
  if (!title) return false;
  let note = document.getElementById(TEXT_ID);
  if (!note) {
    note = document.createElement("p");
    note.id = TEXT_ID;
    note.style.cssText = "margin:0 auto 18px;max-width:720px;font-style:italic;font-weight:600;font-size:clamp(22px,3vw,34px);line-height:1.2;letter-spacing:-.02em;color:#0b2a44;text-align:center";
    title.insertAdjacentElement("afterend", note);
  }
  note.textContent = text.slice(0, 60);
  return true;
}

function confetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2147483000";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  const colors = ["#ffcc3d", "#7ff0ff", "#ff6b8b", "#6d8cff", "#ffffff"];
  const bits = Array.from({ length: 140 }, () => ({
    x: canvas.width / 2 + (Math.random() - 0.5) * 200, y: canvas.height * 0.35,
    vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4,
    size: 4 + Math.random() * 5, color: colors[Math.floor(Math.random() * colors.length)], spin: Math.random() * 6,
  }));
  const start = performance.now();
  const frame = (now: number) => {
    const age = (now - start) / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const b of bits) {
      b.vy += 0.35; b.x += b.vx; b.y += b.vy; b.vx *= 0.99;
      ctx.fillStyle = b.color;
      ctx.fillRect(Math.round(b.x), Math.round(b.y), b.size, b.size * (0.5 + 0.5 * Math.abs(Math.sin(age * 8 + b.spin))));
    }
    if (age < 2.8) requestAnimationFrame(frame); else canvas.remove();
  };
  requestAnimationFrame(frame);
  return true;
}

function scrollTo(section: NonNullable<BeeArgs["section"]>) {
  if (section === "top") { window.scrollTo({ top: 0, behavior: "smooth" }); return true; }
  const element = document.querySelector(SECTIONS[section]);
  if (!element) return false;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

function reset() {
  removeStyle();
  document.getElementById(TEXT_ID)?.remove();
  const box = document.querySelector<HTMLElement>(".cli-install");
  if (box) box.style.transform = "";
  return true;
}

/** Runs a tool. Returns false if the page didn't have what it needed. */
export function runTool(tool: BeeTool, args: BeeArgs): boolean {
  switch (tool) {
    case "set_background": return args.color ? background(args.color) : false;
    case "move_button": return args.position ? moveButton(args.position) : false;
    case "write_text": return args.text ? writeText(args.text) : false;
    case "confetti": return confetti();
    case "scroll_to": return args.section ? scrollTo(args.section) : false;
    case "book_meeting": return true;
    case "reset": return reset();
  }
}

/** How the call is shown in the chat, like an MCP tool call. */
export function formatCall(tool: BeeTool, args: BeeArgs) {
  const shown = Object.entries(args).filter(([, value]) => value !== undefined).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(", ");
  return `${tool}(${shown ? `{ ${shown} }` : ""})`;
}
