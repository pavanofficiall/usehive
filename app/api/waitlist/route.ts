import { NextRequest, NextResponse } from "next/server";
import { addWaitlistEmail, isSupabaseConfigured } from "@/lib/posts";

// Main site's SheetDB endpoint backs the shared Google Sheet.
const MAIN_SITE_SHEETDB_URL = "https://sheetdb.io/api/v1/wmr37vebck4c6";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { email?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.WAITLIST_WEBHOOK_URL || MAIN_SITE_SHEETDB_URL;
  const timestamp = new Date().toISOString();
  const record = { timestamp, form: "waitlist", email, Timestamp: timestamp, "Form Type": "waitlist", Form: "waitlist", Email: email };
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(webhookUrl.includes("sheetdb.io") ? { data: [record] } : { ...record, data: { email } }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Sheet webhook returned ${response.status}`);
  } catch (error) {
    console.error("Waitlist sheet submission failed:", error);
    return NextResponse.json({ error: "Could not add you right now. Please try again." }, { status: 502 });
  }

  // Keep the current admin beta list populated when Supabase is configured.
  if (isSupabaseConfigured()) {
    try { await addWaitlistEmail(email); }
    catch (error) { console.error("Waitlist Supabase mirror failed:", error); }
  }
  return NextResponse.json({ joined: true });
}
