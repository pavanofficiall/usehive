import type { MetadataRoute } from "next";
import { publicPinnedPost, publicPostPage } from "@/lib/posts";

export const dynamic = "force-dynamic";

const origin = "https://www.usehive.tech";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    { url: `${origin}/`, priority: 1 },
    { url: `${origin}/docs`, priority: 0.9 },
    { url: `${origin}/docs/configuration`, priority: 0.7 },
    { url: `${origin}/docs/commands`, priority: 0.7 },
    { url: `${origin}/manifesto`, priority: 0.7 },
    { url: `${origin}/blog`, priority: 0.7 },
  ];

  try {
    const pinned = await publicPinnedPost();
    const seen = new Set<string>();
    const addPost = (post: { slug: string; updated_at: string; published_at: string | null }) => {
      if (!post.slug || seen.has(post.slug)) return;
      seen.add(post.slug);
      urls.push({
        url: `${origin}/blog/${encodeURIComponent(post.slug)}`,
        lastModified: post.updated_at || post.published_at || undefined,
        priority: 0.6,
      });
    };
    if (pinned) addPost(pinned);

    let offset = 0;
    while (true) {
      const { posts, hasMore } = await publicPostPage(offset, 100);
      posts.forEach(addPost);
      if (!hasMore) break;
      offset += posts.length;
    }
  } catch {
    // Keep the static pages discoverable if the blog database is temporarily unavailable.
  }

  return urls;
}
