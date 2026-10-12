import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getBetaUsers } from "@/lib/posts";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const users = await getBetaUsers();
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: "Could not load beta users." }, { status: 502 });
  }
}
