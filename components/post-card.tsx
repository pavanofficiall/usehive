import { ScrollText } from "@/components/scroll-text";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/posts";
export function formatDate(value: string | null) {
  if (!value) return "Draft";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return <a href={`/blog/${post.slug}`} className={`journal-card ${featured ? "journal-featured" : ""} ${post.cover_url ? "" : "journal-text-only"}`}>
    {post.cover_url && <div className="journal-cover"><img src={post.cover_url} alt="" loading={featured ? "eager" : "lazy"}/></div>}
    <div className="journal-copy"><div className="journal-meta"><ScrollText>{`${formatDate(post.published_at)} · ${post.reading_minutes} min read`}</ScrollText></div><ScrollText as="h2">{post.title}</ScrollText><ScrollText as="p">{post.summary}</ScrollText><span className="journal-read"><ScrollText>{featured ? "Read article" : "Read"}</ScrollText> <ArrowUpRight size={14}/></span></div>
  </a>;
}
