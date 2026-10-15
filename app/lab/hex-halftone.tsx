"use client";

import { useEffect, useRef } from "react";

type Paint = (ctx: CanvasRenderingContext2D, width: number, height: number) => void;

type HexHalftoneProps = {
  /** Image URL or a paint function; its brightness decides each hexagon's size. */
  source: { image: string } | { paint: Paint };
  /** Distance between hexagon centres, in CSS pixels. */
  cell?: number;
  /** Colour stops from dim to bright cells. */
  palette: string[];
  /** Colour the cursor heats cells towards. */
  heat?: string;
  /** Contrast curve applied to brightness (>1 = fewer big cells). */
  gamma?: number;
  /** Smallest size every cell keeps, so the honeycomb texture shows everywhere. */
  floor?: number;
  /** Cursor influence radius, in CSS pixels. */
  radius?: number;
  className?: string;
};

type Rect = { x0: number; y0: number; x1: number; y1: number };
type Source = { x: number; y: number; r2: number; amp: number; reach: number };

const SQRT3 = Math.sqrt(3);
const SAMPLE_SCALE = 4;
const LUM_BUCKETS = 8;
const HEAT_BUCKETS = 4;
const MAX_DPR = 1.5;
const RIPPLE_SPEED = 900;
const RIPPLE_LIFE = 2.2;
const TRAIL_MAX = 12;

function hexToRgb(hex: string) {
  const value = parseInt(hex.replace("#", ""), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/** Colour table indexed by [brightness bucket][heat bucket]. */
function buildColors(palette: string[], heat: string) {
  const stops = palette.map(hexToRgb);
  const heatRgb = hexToRgb(heat);
  const table: string[] = [];
  for (let l = 0; l < LUM_BUCKETS; l++) {
    const pos = (l / (LUM_BUCKETS - 1)) * (stops.length - 1);
    const i = Math.min(Math.floor(pos), stops.length - 2);
    const base = stops[i].map((v, k) => v + (stops[i + 1][k] - v) * (pos - i));
    for (let h = 0; h < HEAT_BUCKETS; h++) {
      const t = (h / (HEAT_BUCKETS - 1)) * 0.92;
      table.push(`rgb(${base.map((v, k) => Math.round(v + (heatRgb[k] - v) * t)).join(",")})`);
    }
  }
  return table;
}

function union(a: Rect | null, b: Rect | null): Rect | null {
  if (!a) return b;
  if (!b) return a;
  return { x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) };
}

/**
 * Draws a source image as a honeycomb of hexagons whose size follows its brightness.
 * Cells swell and fuse around the cursor, leave a fading trail, and a click sends a
 * ripple through the grid. To stay smooth, each frame only repaints the region around
 * the cursor and its trail; the full grid is redrawn only during the intro and ripples.
 */
export function HexHalftone({
  source, cell = 11, palette, heat = "#dff3ff", gamma = 1.6, floor = 0.08, radius = 120, className,
}: HexHalftoneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colors = buildColors(palette, heat);
    const hex = Array.from({ length: 6 }, (_, k) => [Math.cos(Math.PI / 6 + (k * Math.PI) / 3), Math.sin(Math.PI / 6 + (k * Math.PI) / 3)]);
    const dyRow = (cell * SQRT3) / 2;
    const maxR = cell / SQRT3;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let xs = new Float32Array(0);
    let ys = new Float32Array(0);
    let base = new Float32Array(0);
    let introEnd = 0;
    let image: HTMLImageElement | null = null;
    let frame = 0;
    let running = false;
    let visible = false;
    let dirty: Rect | null = null;
    let forceFull = true;
    let lastInput = -10;
    let ambient = 0;
    const born = performance.now();

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };
    const trail: { x: number; y: number; life: number }[] = [];
    const ripples: number[][] = [];

    function sample() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = host!.clientWidth;
      height = host!.clientHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Paint the source at quarter resolution, then read one brightness value per cell.
      const sw = Math.max(1, Math.ceil(width / SAMPLE_SCALE));
      const sh = Math.max(1, Math.ceil(height / SAMPLE_SCALE));
      const off = document.createElement("canvas");
      off.width = sw;
      off.height = sh;
      const octx = off.getContext("2d", { willReadFrequently: true })!;
      if ("paint" in source) {
        source.paint(octx, sw, sh);
      } else if (image) {
        const scale = Math.max(sw / image.width, sh / image.height);
        octx.drawImage(image, (sw - image.width * scale) / 2, (sh - image.height * scale) / 2, image.width * scale, image.height * scale);
      }
      const pixels = octx.getImageData(0, 0, sw, sh).data;

      cols = Math.ceil(width / cell) + 2;
      rows = Math.ceil(height / dyRow) + 2;
      const count = cols * rows;
      xs = new Float32Array(count);
      ys = new Float32Array(count);
      const raw = new Float32Array(count);
      for (let r = 0, n = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++, n++) {
          const x = c * cell + (r % 2 ? cell / 2 : 0) - cell / 2;
          const y = r * dyRow - dyRow / 2;
          const px = Math.min(sw - 1, Math.max(0, Math.floor(x / SAMPLE_SCALE)));
          const py = Math.min(sh - 1, Math.max(0, Math.floor(y / SAMPLE_SCALE)));
          const o = (py * sw + px) * 4;
          xs[n] = x;
          ys[n] = y;
          raw[n] = ((0.2126 * pixels[o] + 0.7152 * pixels[o + 1] + 0.0722 * pixels[o + 2]) / 255) * (pixels[o + 3] / 255);
        }
      }

      // Stretch the 4th–99th percentile across the full range so any source has contrast.
      const sorted = Array.from(raw).sort((a, b) => a - b);
      const lo = sorted[Math.floor(count * 0.04)];
      const hi = Math.max(lo + 0.01, sorted[Math.floor(count * 0.99)]);
      base = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const t = Math.min(1, Math.max(0, (raw[i] - lo) / (hi - lo)));
        base[i] = floor + (1 - floor) * Math.pow(t, gamma);
      }
      introEnd = Math.hypot(width / 2, height / 2) / 1100 + 0.75;
      forceFull = true;
    }

    /** Draws every cell overlapping `rect` (or all cells) with the current heat sources. */
    function paint(rect: Rect | null, t: number, sources: Source[]) {
      const intro = !reduced && t < introEnd;
      const r0 = rect ? Math.max(0, Math.floor(rect.y0 / dyRow)) : 0;
      const r1 = rect ? Math.min(rows - 1, Math.ceil(rect.y1 / dyRow) + 1) : rows - 1;
      const c0 = rect ? Math.max(0, Math.floor(rect.x0 / cell)) : 0;
      const c1 = rect ? Math.min(cols - 1, Math.ceil(rect.x1 / cell) + 1) : cols - 1;
      const paths = colors.map(() => new Path2D());
      const used = new Uint8Array(colors.length);
      const cx = width / 2;
      const cy = height / 2;

      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const i = r * cols + c;
          const ox = xs[i];
          const oy = ys[i];
          let x = ox;
          let y = oy;

          let bloom = 1;
          if (intro) {
            bloom = (t - Math.hypot(ox - cx, oy - cy) / 1100) / 0.7;
            if (bloom <= 0) continue;
            if (bloom > 1) bloom = 1;
          }

          let heatValue = 0;
          for (let k = 0; k < sources.length; k++) {
            const s = sources[k];
            const dx = ox - s.x;
            const dy = oy - s.y;
            if (dx > s.reach || dx < -s.reach || dy > s.reach || dy < -s.reach) continue;
            const d2 = dx * dx + dy * dy;
            const f = Math.exp(-d2 / s.r2) * s.amp;
            heatValue += f;
            if (k === 0 && pointer.active) {
              // Bulge cells outward like a lens: no push at the centre, strongest near the rim.
              const d = Math.sqrt(d2) || 1;
              const push = (d / radius) * f * cell * 1.6;
              x += (dx / d) * push;
              y += (dy / d) * push;
            }
          }
          for (let k = 0; k < ripples.length; k++) {
            const [rx, ry, start] = ripples[k];
            const age = t - start;
            const d = Math.hypot(ox - rx, oy - ry) - age * RIPPLE_SPEED;
            if (d > 140 || d < -140) continue;
            heatValue += Math.exp(-((d / 46) ** 2)) * (1 - age / RIPPLE_LIFE) * 0.9;
          }
          if (heatValue > 1.4) heatValue = 1.4;

          const b = base[i];
          let size = b + heatValue * 0.55;
          if (size > 1) size = 1;
          const s = size * maxR * bloom;
          if (s < 0.45) continue;

          const lum = Math.min(LUM_BUCKETS - 1, Math.floor(Math.min(1, b + heatValue * 0.5) * LUM_BUCKETS));
          const hb = Math.min(HEAT_BUCKETS - 1, Math.floor(Math.min(1, heatValue) * HEAT_BUCKETS));
          const bucket = lum * HEAT_BUCKETS + hb;
          const path = paths[bucket];
          used[bucket] = 1;
          path.moveTo(x + hex[0][0] * s, y + hex[0][1] * s);
          for (let k = 1; k < 6; k++) path.lineTo(x + hex[k][0] * s, y + hex[k][1] * s);
          path.closePath();
        }
      }

      if (rect) {
        ctx!.save();
        ctx!.beginPath();
        ctx!.rect(rect.x0, rect.y0, rect.x1 - rect.x0, rect.y1 - rect.y0);
        ctx!.clip();
        ctx!.clearRect(rect.x0, rect.y0, rect.x1 - rect.x0, rect.y1 - rect.y0);
      } else {
        ctx!.clearRect(0, 0, width, height);
      }
      for (let k = 0; k < paths.length; k++) {
        if (!used[k]) continue;
        ctx!.fillStyle = colors[k];
        ctx!.fill(paths[k]);
      }
      if (rect) ctx!.restore();
    }

    function tick(now: number) {
      const t = (now - born) / 1000;
      const sources: Source[] = [];
      let bounds: Rect | null = null;
      const add = (x: number, y: number, r: number, amp: number) => {
        const reach = r * 2;
        sources.push({ x, y, r2: r * r, amp, reach });
        bounds = union(bounds, { x0: x - reach - cell, y0: y - reach - cell, x1: x + reach + cell, y1: y + reach + cell });
      };

      pointer.x += (pointer.tx - pointer.x) * 0.22;
      pointer.y += (pointer.ty - pointer.y) * 0.22;
      // Pointer must be the first source: only it bends the grid.
      if (pointer.active) add(pointer.x, pointer.y, radius, 1);

      if (pointer.active && frame % 2 === 0) trail.push({ x: pointer.x, y: pointer.y, life: 1 });
      for (let i = trail.length - 1; i >= 0; i--) if ((trail[i].life -= 0.06) <= 0) trail.splice(i, 1);
      if (trail.length > TRAIL_MAX) trail.splice(0, trail.length - TRAIL_MAX);
      for (const p of trail) add(p.x, p.y, radius * 0.55, p.life * 0.35);

      // A soft light drifts across the hive while nobody is interacting.
      const idle = t - lastInput > 2.5;
      ambient += ((idle ? 0.45 : 0) - ambient) * 0.03;
      if (ambient > 0.01) {
        add(width * (0.5 + 0.36 * Math.sin(t * 0.21)), height * (0.55 + 0.28 * Math.sin(t * 0.29 + 1.3)), radius * 1.15, ambient);
      }

      for (let i = ripples.length - 1; i >= 0; i--) if (t - ripples[i][2] > RIPPLE_LIFE) ripples.splice(i, 1);

      const full = forceFull || ripples.length > 0 || (!reduced && t < introEnd);
      if (full) {
        paint(null, t, sources);
        dirty = { x0: 0, y0: 0, x1: width, y1: height };
        forceFull = false;
        return;
      }
      // Repaint where heat is now plus where it was last frame, so cooled cells return to rest.
      const region = union(bounds, dirty);
      if (region) paint(region, t, sources);
      dirty = bounds;
    }

    function loop(now: number) {
      tick(now);
      frame = requestAnimationFrame(loop);
    }
    function start() {
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    const local = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const onMove = (event: PointerEvent) => {
      const p = local(event);
      if (!pointer.active) { pointer.x = p.x; pointer.y = p.y; }
      pointer.tx = p.x;
      pointer.ty = p.y;
      pointer.active = true;
      lastInput = (performance.now() - born) / 1000;
    };
    const onLeave = () => { pointer.active = false; };
    const onDown = (event: PointerEvent) => {
      const p = local(event);
      lastInput = (performance.now() - born) / 1000;
      ripples.push([p.x, p.y, lastInput]);
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    const resize = new ResizeObserver(() => { sample(); tick(performance.now()); });

    const init = () => {
      sample();
      tick(performance.now());
      resize.observe(host);
      observer.observe(host);
      if (!reduced) {
        host.addEventListener("pointermove", onMove);
        host.addEventListener("pointerleave", onLeave);
        host.addEventListener("pointerdown", onDown);
        document.addEventListener("visibilitychange", onVisibility);
      }
    };

    if ("image" in source) {
      image = new Image();
      image.decoding = "async";
      image.onload = init;
      image.src = source.image;
    } else {
      init();
      // Painted text may use a web font; re-sample once fonts have loaded.
      document.fonts?.ready.then(() => { sample(); tick(performance.now()); });
    }

    return () => {
      stop();
      observer.disconnect();
      resize.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
      if (image) image.onload = null;
    };
    // The source and palette are fixed for the lifetime of each instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
