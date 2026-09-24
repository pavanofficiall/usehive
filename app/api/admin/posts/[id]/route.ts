import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin-auth";
import { adminPosts, deletePost, updatePost } from "@/lib/posts";

const schema = z.object({
  title: z.string().trim().min(3).max(160),
  summary: z.string().trim().min(10).max(360),
  body: z.string().trim().min(20).max(100000),
  category: z.enum(["Build", "Operate", "Evolve"]),
  status: z.enum(["draft", "published"]),
  cover_url: z.union([z.literal(""), z.string().url().refine(value => value.startsWith("https://"), "Use an HTTPS image URL")]).optional(),
  pinned: z.boolean()
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please complete the title, summary and article body." }, { status: 400 });
  const { id } = await params;
  try {
    const existing = (await adminPosts()).find(post => post.id === id);
    if (!existing) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    if (parsed.data.pinned) for (const post of (await adminPosts()).filter(post => post.pinned && post.id !== id)) await updatePost(post.id, { pinned: false });
    const reading_minutes = Math.max(1, Math.ceil(parsed.data.body.trim().split(/\s+/).length / 220));
    const published_at = parsed.data.status === "published" ? (existing.published_at || new Date().toISOString()) : null;
    const post = await updatePost(id, { ...parsed.data, reading_minutes, published_at, updated_at: new Date().toISOString() });
    return NextResponse.json({ post });
  } catch { return NextResponse.json({ error: "Could not save this post." }, { status: 502 }); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  try { await deletePost((await params).id); return NextResponse.json({ deleted: true }); }
  catch { return NextResponse.json({ error: "Could not delete this post." }, { status: 502 }); }
}
