"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, LogOut, Plus, Save, Trash2 } from "lucide-react";
import type { Category, Post, PostStatus } from "@/lib/posts";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type Editor = { id?: string; title: string; summary: string; cover_url: string; body: string; category: Category; status: PostStatus; pinned: boolean };
const blank: Editor = { title: "", summary: "", cover_url: "", body: "", category: "Build", status: "draft", pinned: false };

export default function AdminPage() {
  const [loaded, setLoaded] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [preview, setPreview] = useState(false);
  const [pin, setPin] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [editor, setEditor] = useState<Editor>(blank);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    const response = await fetch("/api/admin/posts", { cache: "no-store" });
    if (response.ok) { const data = await response.json() as { posts: Post[] }; setPosts(data.posts); }
    else setMessage("Could not load posts. Refresh and try again.");
  }, []);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" }).then(response => response.json() as Promise<{ configured: boolean; authenticated: boolean }>).then(data => {
      setConfigured(data.configured); setAuthenticated(data.authenticated); setLoaded(true);
      if (data.authenticated) void loadPosts();
    }).catch(() => { setLoaded(true); setMessage("Admin is temporarily unavailable."); });
  }, [loadPosts]);

  async function login(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) });
    const data = await response.json() as { error?: string; authenticated?: boolean };
    if (!response.ok) { setMessage(data.error || "Could not sign in."); setPin(""); return; }
    setAuthenticated(true); setPin(""); void loadPosts();
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false); setPosts([]); setEditor(blank);
  }

  function edit(post: Post) {
    setEditor({ id: post.id, title: post.title, summary: post.summary, cover_url: post.cover_url || "", body: post.body, category: post.category, status: post.status, pinned: post.pinned });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (preview) return;
    setSaving(true); setMessage("");
    const url = editor.id ? `/api/admin/posts/${editor.id}` : "/api/admin/posts";
    const response = await fetch(url, { method: editor.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editor) });
    const data = await response.json() as { error?: string };
    setSaving(false);
    if (!response.ok) { setMessage(data.error || "Could not save post."); return; }
    setMessage(editor.status === "published" ? "Story published." : "Draft saved.");
    setEditor(blank);
    void loadPosts();
  }

  async function remove() {
    if (!deleteId || preview) return;
    const response = await fetch(`/api/admin/posts/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    if (!response.ok) { setMessage("Could not delete this post."); return; }
    if (editor.id === deleteId) setEditor(blank);
    setMessage("Story deleted."); void loadPosts();
  }

  if (!loaded) return <main className="admin-page"><p>Loading admin…</p></main>;
  if (!authenticated && !preview) return <main className="admin-page admin-gate page-enter"><div className="admin-gate-card"><a href="/" className="article-back"><ArrowLeft size={16}/> Back to site</a><div className="eyebrow">HIVE / CONTENT STUDIO</div><h1>{configured ? "Enter your access code." : "Admin setup is next."}</h1><p>{configured ? "Use your six-digit code to manage the HIVE journal." : "Connect Supabase and set your six-digit admin code to start publishing."}</p>{configured ? <form onSubmit={login}><label htmlFor="admin-code">Six-digit access code</label><InputOTP id="admin-code" maxLength={6} value={pin} onChange={setPin} inputMode="numeric" pattern="[0-9]*" containerClassName="otp-container"><InputOTPGroup>{[0,1,2,3,4,5].map(index => <InputOTPSlot index={index} key={index} className="otp-slot"/>)}</InputOTPGroup></InputOTP><button className="admin-primary" disabled={pin.length !== 6}>Open admin</button></form> : <button className="admin-secondary" onClick={() => { setPreview(true); setPosts([]); }}>Preview admin layout</button>}{message && <p className="admin-message" role="alert">{message}</p>}</div></main>;

  return <main className="admin-page page-enter">
    <header className="admin-header"><a href="/" className="admin-brand">HIVE <span>/ CONTENT STUDIO</span></a><div><a href="/blog" target="_blank">View blog <ExternalLink size={15}/></a>{!preview && <button onClick={logout}><LogOut size={15}/> Sign out</button>}</div></header>
    <div className="admin-layout">
      <section className="admin-editor"><div className="admin-section-head"><div><span className="eyebrow">{editor.id ? "EDIT STORY" : "NEW STORY"}</span><h1>{editor.id ? "Edit story" : "Write a story"}</h1></div><button className="admin-secondary" onClick={() => setEditor(blank)}><Plus size={16}/> New</button></div>
        {preview && <div className="admin-preview-note">Layout preview. Publishing will work after Supabase and your admin code are configured.</div>}
        <form onSubmit={save}><label htmlFor="post-title">Headline</label><Input id="post-title" value={editor.title} onChange={e => setEditor({ ...editor, title: e.target.value })} placeholder="Give this story a clear headline" required minLength={3} maxLength={160}/>
          <label htmlFor="post-cover">Cover image URL</label><Input id="post-cover" type="url" value={editor.cover_url} onChange={e => setEditor({ ...editor, cover_url: e.target.value })} placeholder="https://…"/>
          <label htmlFor="post-summary">Summary</label><Textarea id="post-summary" value={editor.summary} onChange={e => setEditor({ ...editor, summary: e.target.value })} placeholder="One or two sentences that tell readers why it matters" required minLength={10} maxLength={360} rows={3}/>
          <label htmlFor="post-body">Article body</label><Textarea id="post-body" value={editor.body} onChange={e => setEditor({ ...editor, body: e.target.value })} placeholder="Write paragraphs here. Leave a blank line between paragraphs." required minLength={20} rows={14}/>
          <div className="admin-form-grid"><div><label>Category</label><Select value={editor.category} onValueChange={value => setEditor({ ...editor, category: value as Category })}><SelectTrigger className="admin-select"><SelectValue/></SelectTrigger><SelectContent>{(["Build","Operate","Evolve"] as Category[]).map(category => <SelectItem value={category} key={category}>{category}</SelectItem>)}</SelectContent></Select></div><div><label>Status</label><Select value={editor.status} onValueChange={value => setEditor({ ...editor, status: value as PostStatus })}><SelectTrigger className="admin-select"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent></Select></div></div>
          <label className="pin-toggle"><input type="checkbox" checked={editor.pinned} onChange={e => setEditor({ ...editor, pinned: e.target.checked })}/><span><strong>Pin as the lead story</strong><small>Only one story can be pinned at a time.</small></span></label>
          <div className="admin-actions"><button className="admin-primary" type="submit" disabled={saving || preview}><Save size={16}/> {saving ? "Saving…" : editor.status === "published" ? "Publish story" : "Save draft"}</button>{editor.id && <button type="button" className="admin-danger" onClick={() => setDeleteId(editor.id!)} disabled={preview}><Trash2 size={16}/> Delete</button>}</div>
        </form>{message && <p className="admin-message" role="status">{message}</p>}
      </section>
      <aside className="admin-list"><div className="admin-section-head"><div><span className="eyebrow">YOUR JOURNAL</span><h2>All stories <small>{posts.length}</small></h2></div></div><div className="admin-posts">{posts.length ? posts.map(post => <button className={editor.id === post.id ? "admin-post selected" : "admin-post"} key={post.id} onClick={() => edit(post)}><span className="admin-post-top"><span>{post.category} {post.pinned ? "· PINNED" : ""}</span><span>{post.status}</span></span><strong>{post.title}</strong><small>{post.summary}</small></button>) : <p className="admin-empty">No stories yet. Start with your first draft.</p>}</div></aside>
    </div>
    <AlertDialog open={Boolean(deleteId)} onOpenChange={open => !open && setDeleteId(null)}><AlertDialogContent className="admin-alert"><AlertDialogHeader><AlertDialogTitle>Delete this story?</AlertDialogTitle><AlertDialogDescription>This removes it from the blog and cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep story</AlertDialogCancel><AlertDialogAction onClick={remove}>Delete story</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </main>;
}
