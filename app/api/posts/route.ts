import { NextRequest, NextResponse } from "next/server";
import { publicPostPage } from "@/lib/posts";
export async function GET(request: NextRequest) {
  const offset = Number(request.nextUrl.searchParams.get("offset") || 0);
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > 100000) return NextResponse.json({ error: "Invalid offset" }, { status: 400 });
  try { return NextResponse.json(await publicPostPage(offset), { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ error: "Could not load stories" }, { status: 502 }); }
}
