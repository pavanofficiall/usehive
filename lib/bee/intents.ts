// Shared by the browser and /api/bee: the bee's tools, a fast local router for common
// requests, and its replies. No DOM or Node APIs here.

export const BEE_TOOLS = {
  set_background: "Change the page background colour or mood (sunset, ocean, night, a colour name).",
  move_button: "Move the install command box left, right or back to the centre.",
  write_text: "Write a short line of text on the page.",
  confetti: "Throw confetti to celebrate.",
  scroll_to: "Scroll to a part of the page: top, demo, idea or footer.",
  book_meeting: "Book a call or meeting with the HIVE team.",
  reset: "Undo every change and restore the page.",
} as const;

export type BeeTool = keyof typeof BEE_TOOLS;
export type BeeArgs = { color?: string; position?: "left" | "right" | "center"; text?: string; section?: Section };
export type BeeAction = { tool: BeeTool | null; args: BeeArgs; reply: string; via: "local" | "jev" | "gemini" | "fallback" };
type Section = "top" | "demo" | "idea" | "footer";

export const isBeeTool = (value: unknown): value is BeeTool => typeof value === "string" && value in BEE_TOOLS;

export const BACKGROUND_PRESETS: Record<string, string> = {
  sunset: "linear-gradient(180deg,#ff9a5c 0%,#ff6b8b 55%,#7b5cff 100%)",
  ocean: "linear-gradient(180deg,#36d1dc 0%,#2b6fd6 100%)",
  night: "linear-gradient(180deg,#0b1026 0%,#26215c 100%)",
  forest: "linear-gradient(180deg,#a8e063 0%,#2f7d4a 100%)",
  candy: "linear-gradient(135deg,#ffb3d9 0%,#b3e5ff 100%)",
  honey: "linear-gradient(180deg,#ffe29a 0%,#ffb93d 100%)",
  sky: "",
};

const COLOR_WORDS = ["red", "orange", "yellow", "green", "blue", "purple", "violet", "pink", "black", "white", "gray", "grey", "teal", "cyan", "magenta", "gold", "lavender", "coral", "mint", "navy", "beige", "brown"];

const TEASES = [
  "Bzzt. What are your expectations from a bee the size of a raisin? Try \"make it sunset\" or \"throw confetti\".",
  "I'm one tiny bee, not a whole dev team. I can change the background, move the button, write a line, or book you a call.",
  "That's above my pay grade, and my pay is pollen. Ask me to \"move the button left\" instead.",
  "Ambitious! Sadly my wings only carry small changes. Try \"write hello world\".",
  "If I could do that, I'd be a whole hive. For now: backgrounds, buttons, confetti, and booking calls.",
  "Nice try. I only have the tools I was given, which is exactly how MCP works. Want to see one? Say \"party time\".",
];

export const randomTease = () => TEASES[Math.floor(Math.random() * TEASES.length)];

export function parseColor(message: string): string | null {
  const lower = message.toLowerCase();
  for (const preset of Object.keys(BACKGROUND_PRESETS)) if (new RegExp(`\\b${preset}\\b`).test(lower)) return preset;
  const hex = lower.match(/#[0-9a-f]{3}(?:[0-9a-f]{3})?\b/);
  if (hex) return hex[0];
  for (const word of COLOR_WORDS) if (new RegExp(`\\b${word}\\b`).test(lower)) return word === "grey" ? "gray" : word;
  return null;
}

export function parsePosition(message: string): BeeArgs["position"] | null {
  const lower = message.toLowerCase();
  if (/\bleft\b/.test(lower)) return "left";
  if (/\bright\b/.test(lower)) return "right";
  if (/\b(center|centre|middle|back)\b/.test(lower)) return "center";
  return null;
}

export function parseSection(message: string): Section | null {
  const lower = message.toLowerCase();
  if (/\b(top|start|beginning|header)\b/.test(lower)) return "top";
  if (/\b(demo|video)\b/.test(lower)) return "demo";
  if (/\b(idea|how it works|features?)\b/.test(lower)) return "idea";
  if (/\b(footer|bottom|end)\b/.test(lower)) return "footer";
  return null;
}

export function parseText(message: string): string | null {
  const quoted = message.match(/["“']([^"”']{1,60})["”']/);
  if (quoted) return quoted[1].trim();
  const after = message.match(/\b(?:write|say|type|add text|show)\s+(.{1,60})$/i);
  return after ? after[1].replace(/\b(on the page|on the site|here)\b/gi, "").trim() || null : null;
}

const replies: Record<BeeTool, (args: BeeArgs) => string> = {
  set_background: ({ color }) => color === "sky" ? "Back to blue skies." : `Repainted. Very ${color}.`,
  move_button: ({ position }) => position === "center" ? "Button's back in the middle." : `Shoved it ${position}. Bees are strong.`,
  write_text: () => "Written. My handwriting is mostly buzzing.",
  confetti: () => "Party in the hive!",
  scroll_to: ({ section }) => `Flying you to the ${section}.`,
  book_meeting: () => "Here's a slot with the HIVE team. Tap below to pick a time.",
  reset: () => "All tidy again. Nobody saw anything.",
};

export const replyFor = (tool: BeeTool, args: BeeArgs) => replies[tool](args);

/** Missing-argument nudge when a tool was chosen but its details weren't given. */
export function needsArgs(tool: BeeTool, args: BeeArgs): string | null {
  if (tool === "set_background" && !args.color) return "Which colour? Try \"make it sunset\" or \"make it pink\".";
  if (tool === "move_button" && !args.position) return "Left, right or centre?";
  if (tool === "write_text" && !args.text) return "Write what? Put it in quotes, like write \"hello\".";
  if (tool === "scroll_to" && !args.section) return "Where to? Top, demo, idea or footer.";
  return null;
}

export function argsFor(tool: BeeTool, message: string): BeeArgs {
  if (tool === "set_background") return { color: parseColor(message) ?? undefined };
  if (tool === "move_button") return { position: parsePosition(message) ?? undefined };
  if (tool === "write_text") return { text: parseText(message) ?? undefined };
  if (tool === "scroll_to") return { section: parseSection(message) ?? undefined };
  return {};
}

/** Instant, free handling of obvious requests. Returns null when the AI should decide. */
export function localRoute(message: string): BeeAction | null {
  const m = message.trim().toLowerCase();
  if (!m) return null;
  const done = (tool: BeeTool): BeeAction => {
    const args = argsFor(tool, message);
    const missing = needsArgs(tool, args);
    return missing ? { tool: null, args: {}, reply: missing, via: "local" } : { tool, args, reply: replyFor(tool, args), via: "local" };
  };
  if (/^(hi|hey|hello|yo|sup|hola)\b/.test(m) && m.split(/\s+/).length <= 3) return { tool: null, args: {}, reply: "Bzz, hi! I can change this page. Try \"make it sunset\" or \"throw confetti\".", via: "local" };
  if (/\b(reset|undo|restore|revert)\b/.test(m)) return done("reset");
  if (/\b(confetti|celebrate|party)\b/.test(m)) return done("confetti");
  if (/\b(book|schedule)\b|\b(meeting|demo call|talk to (the )?team)\b/.test(m)) return done("book_meeting");
  if (/\b(write|say|type)\b/.test(m) && parseText(message)) return done("write_text");
  if (/\b(move|align|shift|put|push)\b/.test(m) && /\b(button|cta|command|box|install)\b/.test(m) && parsePosition(message)) return done("move_button");
  if (/\b(scroll|go to|take me|jump)\b/.test(m) && parseSection(message)) return done("scroll_to");
  // Any message naming a colour or mood ("make backgrounddd gold", "what about pink") repaints, unless it targets something else.
  if (parseColor(message) && !/\b(button|cta|box|install|text|write|say|scroll|game|play)\b/.test(m)) return done("set_background");
  return null;
}
