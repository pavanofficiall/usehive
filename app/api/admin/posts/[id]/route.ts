import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { adminPosts, deletePost, updatePost } from "@/lib/posts";
import { postInput, slugTaken } from "@/lib/post-input";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const parsed = postInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check the post fields." }, { status: 400 });
  const { id } = await params;
  try {
    const allPosts = await adminPosts();
    const existing = allPosts.find(post => post.id === id);
    if (!existing) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    if (slugTaken(allPosts, parsed.data.slug, id)) return NextResponse.json({ error: "This article link is already in use. Choose another." }, { status: 409 });
    if (parsed.data.pinned) for (const post of (await adminPosts()).filter(post => post.pinned && post.id !== id)) await updatePost(post.id, { pinned: false });
    const reading_minutes = Math.max(1, Math.ceil(parsed.data.body.trim().split(/\s+/).length / 220));
    const published_at = parsed.data.status === "published" ? (existing.published_at || new Date().toISOString()) : null;
    const post = await updatePost(id, { ...parsed.data, reading_minutes, published_at, updated_at: new Date().toISOString() });
    return NextResponse.json({ post });
  } catch (error) { const duplicate = String(error).includes("23505") || String(error).includes("409"); return NextResponse.json({ error: duplicate ? "This article link is already in use. Choose another." : "Could not save this post." }, { status: duplicate ? 409 : 502 }); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  try { await deletePost((await params).id); return NextResponse.json({ deleted: true }); }
  catch { return NextResponse.json({ error: "Could not delete this post." }, { status: 502 }); }
}
