"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUp, X } from "lucide-react";
import { localRoute, type BeeAction } from "@/lib/bee/intents";
import { createBeeRenderer, type BeeFace } from "./bee-sprite";
import { formatCall, runTool, targetFor } from "./bee-tools";
import styles from "./hive-bee.module.css";

const BOOKING_URL = "https://calendly.com/use-hive/15-min";
const SUGGESTIONS = ["Make it sunset", "Throw confetti", "Move the button left", "Add a plane animation"];

type Message = { from: "you" | "bee"; text: string; call?: { label: string; ok: boolean }; booking?: boolean };

export function HiveBee() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beeRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const motion = useRef({ x: 0, y: 0, tx: 0, ty: 0, flip: false, nextWander: 0, size: 102, arrived: null as null | (() => void) });
  const faceRef = useRef<BeeFace>("idle");
  const openRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ from: "bee", text: "Bzz! I'm the HIVE bee. Tell me what to change on this page and I'll do it with my tools." }]);

  useEffect(() => { openRef.current = open; }, [open]);

  // Appear once the site intro has finished.
  useEffect(() => {
    const show = () => setReady(true);
    if (document.documentElement.dataset.hiveIntroReady === "true" || !document.documentElement.dataset.hiveIntro) show();
    window.addEventListener("hive:intro-ready", show);
    return () => window.removeEventListener("hive:intro-ready", show);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setTeaser(true), 1800);
    const hide = window.setTimeout(() => setTeaser(false), 9000);
    return () => { window.clearTimeout(t); window.clearTimeout(hide); };
  }, [ready]);

  // Flight and drawing loop.
  useEffect(() => {
    if (!ready || !canvasRef.current || !beeRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = createBeeRenderer(canvasRef.current);
    const m = motion.current;
    const sizeFor = () => (window.innerWidth < 600 ? 68 : 102);
    m.size = sizeFor();
    m.x = m.tx = window.innerWidth - m.size - 28;
    m.y = m.ty = window.innerHeight - m.size - 28;
    let frame = 0;
    let last = performance.now();

    const wander = (now: number) => {
      const pad = 24;
      m.tx = pad + Math.random() * (window.innerWidth - m.size - pad * 2);
      m.ty = 90 + Math.random() * (window.innerHeight - m.size - 120);
      m.nextWander = now + 3500 + Math.random() * 4000;
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (openRef.current && !m.arrived) {
        // Perch on the chat panel's top edge.
        const panel = panelRef.current?.getBoundingClientRect();
        if (panel) {
          m.tx = Math.max(8, panel.left + 14);
          m.ty = Math.max(8, panel.top - m.size * 0.82);
        }
      } else if (!reduced && !m.arrived && now > m.nextWander) wander(now);
      const dx = m.tx - m.x;
      const dy = m.ty - m.y;
      const distance = Math.hypot(dx, dy);
      const speed = m.arrived ? 520 : 150;
      if (distance > 1) {
        const step = Math.min(distance, speed * dt);
        m.x += (dx / distance) * step;
        m.y += (dy / distance) * step;
        if (Math.abs(dx) > 4) m.flip = dx < 0;
      }
      if (m.arrived && distance < 6) { const done = m.arrived; m.arrived = null; done(); }
      const bee = beeRef.current!;
      bee.style.transform = `translate3d(${Math.round(m.x)}px,${Math.round(m.y)}px,0)`;
      draw(now, faceRef.current, { flip: m.flip, flapSpeed: distance > 4 ? 24 : 14, still: reduced });
      frame = requestAnimationFrame(loop);
    };
    const onResize = () => {
      m.size = sizeFor();
      m.x = Math.min(m.x, window.innerWidth - m.size - 8);
      m.y = Math.min(m.y, window.innerHeight - m.size - 8);
    };
    window.addEventListener("resize", onResize);
    frame = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", onResize); };
  }, [ready]);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [messages, busy]);

  /** Fly to an on-screen element before acting on it. */
  function flyTo(element: Element | null) {
    return new Promise<void>(resolve => {
      const m = motion.current;
      const rect = element?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return resolve();
      m.tx = Math.min(Math.max(rect.left + rect.width / 2 - m.size / 2, 8), window.innerWidth - m.size - 8);
      m.ty = Math.min(Math.max(rect.top - m.size * 0.7, 8), window.innerHeight - m.size - 8);
      const timeout = window.setTimeout(() => { m.arrived = null; resolve(); }, 1400);
      m.arrived = () => { window.clearTimeout(timeout); resolve(); };
    });
  }

  function setFace(face: BeeFace, ms?: number) {
    faceRef.current = face;
    if (ms) window.setTimeout(() => { if (faceRef.current === face) faceRef.current = "idle"; }, ms);
  }

  const add = (message: Message) => setMessages(list => [...list, message].slice(-12));

  async function ask(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setInput("");
    add({ from: "you", text: message });
    setBusy(true);
    setFace("think");
    let action: BeeAction | null = localRoute(message);
    if (!action) {
      try {
        const response = await fetch("/api/bee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, history: messages.slice(-6).map(m => ({ from: m.from, text: m.text })) }) });
        action = await response.json() as BeeAction;
        if (!response.ok || typeof action?.reply !== "string") throw new Error("Bad bee response");
      } catch {
        action = { tool: null, args: {}, reply: "My antenna lost signal. Try again in a moment.", via: "fallback" };
      }
    }

    if (action.tool) {
      await flyTo(targetFor(action.tool));
      const ok = runTool(action.tool, action.args);
      setFace(ok ? "happy" : "surprised", 2200);
      add({
        from: "bee", text: ok ? action.reply : "Hmm, I couldn't find that on this page.",
        call: { label: formatCall(action.tool, action.args), ok }, booking: action.tool === "book_meeting" && ok,
      });
    } else {
      setFace("smirk", 2200);
      add({ from: "bee", text: action.reply });
    }
    setBusy(false);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(input);
  }

  if (!ready) return null;
  return <>
    <button ref={beeRef} type="button" className={styles.bee} aria-label={open ? "Close the HIVE bee chat" : "Chat with the HIVE bee"} aria-expanded={open}
      onClick={() => { setOpen(value => !value); setTeaser(false); }}>
      <canvas ref={canvasRef} width={204} height={204} />
      {teaser && !open && <span className={styles.teaser}>Psst… I can change this page</span>}
    </button>

    {open && <section ref={panelRef} className={styles.panel} aria-label="HIVE bee chat">
      <header className={styles.head}>
        <span><b>HIVE bee</b><small>Operates this page with tools</small></span>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close chat"><X size={16} /></button>
      </header>
      <div className={styles.log} ref={listRef} aria-live="polite">
        {messages.map((message, i) => <div key={i} className={message.from === "you" ? styles.you : styles.beeMsg}>
          {message.call && <code className={message.call.ok ? styles.callOk : styles.callFail}>{message.call.ok ? "✓" : "✗"} {message.call.label}</code>}
          <p>{message.text}</p>
          {message.booking && <a className={styles.book} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Pick a time</a>}
        </div>)}
        {busy && <div className={styles.beeMsg}><p className={styles.typing}>Buzzing…</p></div>}
      </div>
      {messages.length < 3 && <div className={styles.chips}>{SUGGESTIONS.map(s => <button key={s} type="button" onClick={() => void ask(s)} disabled={busy}>{s}</button>)}</div>}
      <form className={styles.form} onSubmit={submit}>
        <input value={input} onChange={event => setInput(event.target.value)} placeholder="Make the background pink" maxLength={300} aria-label="Message the bee" />
        <button type="submit" aria-label="Send" disabled={busy || !input.trim()}><ArrowUp size={16} /></button>
      </form>
      <p className={styles.note}>Changes only happen on your screen. Refresh to reset.</p>
    </section>}
  </>;
}
