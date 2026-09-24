import { ScrollText } from "@/components/scroll-text";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { formatDate } from "@/components/post-card";
import { publicPost } from "@/lib/posts";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { post } = await publicPost((await params).slug).catch(() => ({ post: null }));
  return { title: post ? `${post.title} | HIVE` : "Story | HIVE", description: post?.summary || "HIVE journal" };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  let data: Awaited<ReturnType<typeof publicPost>>;
  try { data = await publicPost((await params).slug); }
  catch { return <><div className="sky-backdrop"/><main className="site-shell"><SiteHeader/><div className="article-page"><p>Story is temporarily unavailable.</p><a href="/blog">Back to blog</a></div><SiteFooter/></main></>; }
  if (!data.post) notFound();
  const post = data.post;
  return <><div className="sky-backdrop" aria-hidden="true"/><main className="site-shell"><SiteHeader/><article className="article-page page-enter">
    <a href="/blog" className="article-back"><ArrowLeft size={16}/> All stories</a>
    <div className="eyebrow"><ScrollText>{`${post.category.toUpperCase()} / THE HIVE JOURNAL`}</ScrollText></div>
    <ScrollText as="h1">{post.title}</ScrollText><ScrollText as="p" className="article-summary">{post.summary}</ScrollText>
    <div className="article-meta"><ScrollText>{`${formatDate(post.published_at)} · ${post.reading_minutes} min read`}</ScrollText></div>
    <div className="article-body">{post.body.split(/\n\n+/).map((paragraph, index) => <ScrollText as="p" key={index}>{paragraph}</ScrollText>)}</div>
    <a href="/blog" className="article-back article-bottom"><ArrowLeft size={16}/> Back to blog</a>
  </article><SiteFooter/></main></>;
}
