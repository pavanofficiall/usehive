import { z } from "zod";

export const postInput = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens.").max(90),
  summary: z.string().trim().min(10).max(360),
  body: z.string().trim().min(20).max(100000),
  category: z.enum(["Build", "Operate", "Evolve"]),
  status: z.enum(["draft", "published"]),
  cover_url: z.union([z.literal(""), z.string().url().refine(value => value.startsWith("https://"), "Use an HTTPS image URL")]).optional(),
  pinned: z.boolean()
});

export function slugTaken(posts: { id: string; slug: string }[], slug: string, exceptId?: string) {
  return posts.some(post => post.slug.toLowerCase() === slug.toLowerCase() && post.id !== exceptId);
}
