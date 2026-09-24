export type Category = "Build" | "Operate" | "Evolve";
export type PostStatus = "draft" | "published";
export type Post = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  cover_url?: string | null;
  body: string;
  category: Category;
  status: PostStatus;
  pinned: boolean;
  reading_minutes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const categories: Category[] = ["Build", "Operate", "Evolve"];

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured() { return Boolean(url && anonKey && serviceKey); }

async function request<T>(path: string, key: string, options: RequestInit = {}): Promise<T> {
  if (!url) throw new Error("Supabase URL is missing");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...options.headers
    },
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}): ${await response.text()}`);
  const body = await response.text();
  return (body ? JSON.parse(body) : null) as T;
}

export async function publicPostPage(offset = 0, limit = 6): Promise<{ posts: Post[]; hasMore: boolean }> {
  if (!url || !anonKey) return { posts: [], hasMore: false };
  const rows = await request<Post[]>(`posts?select=*&status=eq.published&pinned=eq.false&order=published_at.desc,id.desc&offset=${offset}&limit=${limit + 1}`, anonKey);
  return { posts: rows.slice(0, limit), hasMore: rows.length > limit };
}

export async function publicPinnedPost(): Promise<Post | null> {
  if (!url || !anonKey) return null;
  const rows = await request<Post[]>("posts?select=*&status=eq.published&pinned=eq.true&limit=1", anonKey);
  return rows[0] || null;
}

export async function publicPost(slug: string): Promise<{ post: Post | null; preview: boolean }> {
  if (!url || !anonKey) return { post: null, preview: true };
  const rows = await request<Post[]>(`posts?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`, anonKey);
  return { post: rows[0] || null, preview: false };
}

export async function adminPosts(): Promise<Post[]> {
  if (!serviceKey) throw new Error("Supabase is not connected");
  return request<Post[]>("posts?select=*&order=created_at.desc", serviceKey);
}

export async function createPost(post: Partial<Post>): Promise<Post> {
  if (!serviceKey) throw new Error("Supabase is not connected");
  const rows = await request<Post[]>("posts", serviceKey, { method: "POST", body: JSON.stringify(post) });
  return rows[0];
}

export async function updatePost(id: string, post: Partial<Post>): Promise<Post> {
  if (!serviceKey) throw new Error("Supabase is not connected");
  const rows = await request<Post[]>(`posts?id=eq.${encodeURIComponent(id)}`, serviceKey, { method: "PATCH", body: JSON.stringify(post) });
  return rows[0];
}

export async function deletePost(id: string): Promise<void> {
  if (!serviceKey) throw new Error("Supabase is not connected");
  await request<unknown>(`posts?id=eq.${encodeURIComponent(id)}`, serviceKey, { method: "DELETE" });
}

export async function addWaitlistEmail(email: string): Promise<void> {
  if (!serviceKey) throw new Error("Supabase is not connected");
  await request<unknown>("waitlist?on_conflict=email", serviceKey, { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ email }) });
}
