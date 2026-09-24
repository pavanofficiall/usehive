"use client";
import { useState } from "react";
import type { Post } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
export function BlogFeed({ initialPosts, initialHasMore }: { initialPosts: Post[]; initialHasMore: boolean }) {
  const [posts, setPosts] = useState(initialPosts), [hasMore, setHasMore] = useState(initialHasMore), [loading, setLoading] = useState(false), [error, setError] = useState(false);
  async function load() {
    setLoading(true); setError(false);
    try { const response = await fetch(`/api/posts?offset=${posts.length}`); if (!response.ok) throw new Error(); const data = await response.json() as { posts: Post[]; hasMore: boolean }; setPosts(previous => [...previous, ...data.posts.filter((post: Post) => !previous.some(item => item.id === post.id))]); setHasMore(data.hasMore); }
    catch { setError(true); } finally { setLoading(false); }
  }
  return <><div className="journal-grid">{posts.map(post => <PostCard key={post.id} post={post}/>)}</div>{hasMore && <div className="journal-more"><button onClick={load} disabled={loading}>{loading ? "Loading…" : "Load more"}</button></div>}{error && <p role="alert">Could not load more stories. Please try again.</p>}</>;
}
