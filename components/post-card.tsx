import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/posts";
export function formatDate(value: string | null) {
  if (!value) return "Draft";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return <a href={`/blog/${post.slug}`} className={`journal-card ${featured ? "journal-featured" : ""} ${post.cover_url ? "" : "journal-text-only"}`}>
    {post.cover_url && <div className="journal-cover"><img src={post.cover_url} alt="" loading={featured ? "eager" : "lazy"}/></div>}
    <div className="journal-copy"><div className="journal-meta">{`${formatDate(post.published_at)} · ${post.reading_minutes} min read`}</div><h2>{post.title}</h2><p>{post.summary}</p><span className="journal-read">{featured ? "Read article" : "Read"} <ArrowUpRight size={14}/></span></div>
  </a>;
}
