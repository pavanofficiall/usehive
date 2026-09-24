import { NextRequest, NextResponse } from "next/server";
import { addWaitlistEmail, isSupabaseConfigured } from "@/lib/posts";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "The waitlist is not open yet." }, { status: 503 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { email?: unknown };
  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  try { await addWaitlistEmail(email); return NextResponse.json({ joined: true }); }
  catch { return NextResponse.json({ error: "Could not add you right now. Please try again." }, { status: 502 }); }
}
