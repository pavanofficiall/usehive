import { ScrollText } from "@/components/scroll-text";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { PostCard } from "@/components/post-card";
import { BlogFeed } from "@/components/blog-feed";
import { publicPinnedPost, publicPostPage } from "@/lib/posts";
export const metadata: Metadata = { title: "Blog | HIVE", description: "Notes on building and maintaining production-ready MCP layers." };
export const dynamic = "force-dynamic";
export default async function BlogPage() {
  let pinned = null, data = { posts: [] as Awaited<ReturnType<typeof publicPostPage>>["posts"], hasMore: false }, failed = false;
  try { [pinned, data] = await Promise.all([publicPinnedPost(), publicPostPage()]); } catch { failed = true; }
  return <main className="site-shell journal-shell"><SiteHeader/><div className="journal-page"><header className="journal-intro"><ScrollText>THE HIVE JOURNAL</ScrollText><ScrollText as="h1">Ideas in motion.</ScrollText></header>{failed && <p role="status">Stories are temporarily unavailable.</p>}{pinned && <PostCard post={pinned} featured/>}<BlogFeed initialPosts={data.posts} initialHasMore={data.hasMore}/></div><SiteFooter/></main>;
}
