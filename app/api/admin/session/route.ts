import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, canAttempt, checkPin, clearAdminSession, createAdminSession, isAdmin, recordAttempt } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/posts";

export async function GET() {
  return NextResponse.json({ authenticated: await isAdmin(), configured: adminConfigured() && isSupabaseConfigured() });
}

export async function POST(request: NextRequest) {
  if (!adminConfigured() || !isSupabaseConfigured()) return NextResponse.json({ error: "Admin is not configured yet." }, { status: 503 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const identifier = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!canAttempt(identifier)) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  const body = await request.json().catch(() => ({})) as { pin?: unknown };
  const valid = checkPin(String(body.pin || ""));
  recordAttempt(identifier, valid);
  if (!valid) return NextResponse.json({ error: "That code was not accepted." }, { status: 401 });
  await createAdminSession();
  return NextResponse.json({ authenticated: true });
}

export async function DELETE(request: NextRequest) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  await clearAdminSession();
  return NextResponse.json({ authenticated: false });
}
