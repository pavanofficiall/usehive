import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin-auth";
import { adminPosts, createPost, updatePost } from "@/lib/posts";

const schema = z.object({
  title: z.string().trim().min(3).max(160),
  summary: z.string().trim().min(10).max(360),
  body: z.string().trim().min(20).max(100000),
  category: z.enum(["Build", "Operate", "Evolve"]),
  status: z.enum(["draft", "published"]),
  cover_url: z.union([z.literal(""), z.string().url().refine(value => value.startsWith("https://"), "Use an HTTPS image URL")]).optional(),
  pinned: z.boolean()
});

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json({ posts: await adminPosts() }); }
  catch { return NextResponse.json({ error: "Could not load posts from Supabase." }, { status: 502 }); }
}

export async function POST(request: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please complete the title, summary and article body." }, { status: 400 });
  const data = parsed.data;
  const slug = data.title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
  if (!slug) return NextResponse.json({ error: "The title needs at least one letter or number." }, { status: 400 });
  const reading_minutes = Math.max(1, Math.ceil(data.body.trim().split(/\s+/).length / 220));
  try {
    if (data.pinned) for (const post of (await adminPosts()).filter(post => post.pinned)) await updatePost(post.id, { pinned: false });
    const post = await createPost({ ...data, slug, reading_minutes, published_at: data.status === "published" ? new Date().toISOString() : null });
    return NextResponse.json({ post }, { status: 201 });
  } catch { return NextResponse.json({ error: "Could not create this post. Check the title and try again." }, { status: 502 }); }
}
