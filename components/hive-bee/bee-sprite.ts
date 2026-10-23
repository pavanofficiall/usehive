// Draws the Hex bee as true pixel art: shapes are painted on a tiny canvas, snapped to a
// fixed palette, given a dark outline, then scaled up without smoothing.

export type BeeFace = "idle" | "happy" | "blink" | "smirk" | "surprised" | "think";

const N = 34;
const OUTLINE = [20, 22, 51];
const SCREEN_GLOW = [127, 240, 255];
const PALETTE = [[255, 204, 61], [214, 146, 26], [255, 243, 196], [42, 35, 71], [14, 21, 48], [255, 255, 255], [190, 228, 255], [36, 48, 96]];

const FACES: Record<BeeFace, number[][]> = {
  idle: [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4], [5, 4], [6, 4], [7, 4], [8, 4]],
  happy: [[0, 1], [1, 0], [2, 1], [6, 1], [7, 0], [8, 1], [3, 3], [4, 4], [5, 3]],
  blink: [[0, 2], [1, 2], [2, 2], [6, 2], [7, 2], [8, 2]],
  smirk: [[0, 1], [1, 1], [2, 1], [7, 0], [7, 1], [3, 4], [4, 4], [5, 4], [6, 3]],
  surprised: [[1, 0], [1, 1], [1, 2], [7, 0], [7, 1], [7, 2], [3, 4], [4, 4], [5, 4]],
  think: [[1, 3], [4, 3], [7, 3]],
};

function nearest(r: number, g: number, b: number) {
  let best = PALETTE[0];
  let distance = Infinity;
  for (const color of PALETTE) {
    const d = (color[0] - r) ** 2 + (color[1] - g) ** 2 + (color[2] - b) ** 2;
    if (d < distance) { distance = d; best = color; }
  }
  return best;
}

function ellipse(o: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, color: string) {
  o.fillStyle = color;
  o.beginPath();
  o.ellipse(x, y, Math.max(rx, 0.1), Math.max(ry, 0.1), 0, 0, Math.PI * 2);
  o.fill();
}

function drawHexBee(o: CanvasRenderingContext2D, bob: number, wing: number) {
  o.setTransform(1, 0, 0, 1, 1, 1);
  // Wings
  for (const x of [7, 25]) {
    ellipse(o, x, 19 + bob, 4.5, 6.5 * wing, "#ffffff");
    ellipse(o, x + (x < 16 ? 0.5 : -0.5), 20 + bob, 3, 4.5 * wing, "#bee4ff");
  }
  // Antennae
  o.strokeStyle = "#2a2347";
  o.lineWidth = 1.2;
  for (const [x1, x2] of [[13, 11], [19, 21]]) {
    o.beginPath();
    o.moveTo(x1, 3 + bob);
    o.lineTo(x2, 0.5 + bob);
    o.stroke();
    ellipse(o, x2, 0.5 + bob, 1.4, 1.4, "#2a2347");
  }
  // Striped body
  o.save();
  o.beginPath();
  o.ellipse(16, 25 + bob, 7, 5, 0, 0, Math.PI * 2);
  o.clip();
  o.fillStyle = "#ffcc3d";
  o.fillRect(0, 0, N, N);
  ellipse(o, 17, 27.75 + bob, 7, 2.75, "#d6921a");
  o.fillStyle = "#2a2347";
  o.fillRect(12, 0, 2.6, N);
  o.fillRect(18.5, 0, 2.6, N);
  ellipse(o, 12.85, 22.5 + bob, 2.2, 1.4, "#fff3c4");
  o.restore();
  // Hexagon head and screen
  o.fillStyle = "#243060";
  o.beginPath();
  for (let k = 0; k < 6; k++) {
    const angle = Math.PI / 6 + (k * Math.PI) / 3;
    o.lineTo(16 + 10.5 * Math.cos(angle), 12 + bob + 10.5 * Math.sin(angle) * 0.82);
  }
  o.fill();
  o.fillStyle = "#0e1530";
  o.beginPath();
  o.roundRect(9, 8.5 + bob, 14, 8, 2);
  o.fill();
  o.setTransform(1, 0, 0, 1, 0, 0);
}

export function createBeeRenderer(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const off = document.createElement("canvas");
  off.width = off.height = N;
  const o = off.getContext("2d", { willReadFrequently: true })!;

  return function draw(time: number, face: BeeFace, options: { flip?: boolean; flapSpeed?: number; still?: boolean } = {}) {
    const t = time / 1000;
    const bob = options.still ? 0 : Math.round(Math.sin(t * 2.2) * 1.1);
    const wing = options.still ? 0.8 : 0.5 + 0.5 * Math.abs(Math.sin(t * (options.flapSpeed ?? 16)));
    o.clearRect(0, 0, N, N);
    drawHexBee(o, bob, wing);

    const image = o.getImageData(0, 0, N, N);
    const d = image.data;
    const solid = new Uint8Array(N * N);
    for (let k = 0; k < N * N; k++) {
      if (d[k * 4 + 3] > 110) {
        solid[k] = 1;
        const c = nearest(d[k * 4], d[k * 4 + 1], d[k * 4 + 2]);
        d[k * 4] = c[0]; d[k * 4 + 1] = c[1]; d[k * 4 + 2] = c[2]; d[k * 4 + 3] = 255;
      } else d[k * 4 + 3] = 0;
    }
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const k = y * N + x;
      if (solid[k]) continue;
      if ((x > 0 && solid[k - 1]) || (x < N - 1 && solid[k + 1]) || (y > 0 && solid[k - N]) || (y < N - 1 && solid[k + N])) {
        d[k * 4] = OUTLINE[0]; d[k * 4 + 1] = OUTLINE[1]; d[k * 4 + 2] = OUTLINE[2]; d[k * 4 + 3] = 255;
      }
    }
    const blink = face === "idle" && !options.still && t % 3.4 < 0.14;
    for (const [x, y] of FACES[blink ? "blink" : face]) {
      const k = ((11 + y + bob) * N + 12 + x) * 4;
      d[k] = SCREEN_GLOW[0]; d[k + 1] = SCREEN_GLOW[1]; d[k + 2] = SCREEN_GLOW[2]; d[k + 3] = 255;
    }
    o.putImageData(image, 0, 0);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    if (options.flip) ctx.setTransform(-1, 0, 0, 1, canvas.width, 0);
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
  };
}
