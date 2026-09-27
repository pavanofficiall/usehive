import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { adminPosts, createPost, updatePost } from "@/lib/posts";
import { postInput, slugTaken } from "@/lib/post-input";

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json({ posts: await adminPosts() }); }
  catch { return NextResponse.json({ error: "Could not load posts from Supabase." }, { status: 502 }); }
}

export async function POST(request: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const parsed = postInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check the post fields." }, { status: 400 });
  const data = parsed.data;
  const reading_minutes = Math.max(1, Math.ceil(data.body.trim().split(/\s+/).length / 220));
  try {
    if (slugTaken(await adminPosts(), data.slug)) return NextResponse.json({ error: "This article link is already in use. Choose another." }, { status: 409 });
    if (data.pinned) for (const post of (await adminPosts()).filter(post => post.pinned)) await updatePost(post.id, { pinned: false });
    const post = await createPost({ ...data, reading_minutes, published_at: data.status === "published" ? new Date().toISOString() : null });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) { const duplicate = String(error).includes("23505") || String(error).includes("409"); return NextResponse.json({ error: duplicate ? "This article link is already in use. Choose another." : "Could not create this post." }, { status: duplicate ? 409 : 502 }); }
}
