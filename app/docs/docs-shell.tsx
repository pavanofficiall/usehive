"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Command, Menu, Moon, Search, Sun, X } from "lucide-react";
import styles from "./docs.module.css";

type Entry = { slug: string; title: string; description: string; searchText?: string };
type Heading = { id: string; title: string; keywords?: string };

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function DocsShell({ pages, slug, children }: {
  pages: readonly Entry[];
  slug: string;
  children: React.ReactNode;
}) {
  const index = pages.findIndex(page => page.slug === slug);
  const current = pages[index];
  const previous = pages[index - 1];
  const next = pages[index + 1];
  const headings = toc[slug] || [];
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = window.localStorage.getItem("hive-docs-theme");
    if (saved === "light") setTheme("light");
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        window.setTimeout(() => searchRef.current?.focus(), 0);
      }
      if (event.key === "Escape") { setSearchOpen(false); setQuery(""); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const scored: { title: string; description: string; href: string; score: number }[] = [];
    for (const page of pages) {
      const path = page.slug ? `/docs/${page.slug}` : "/docs";
      for (const heading of toc[page.slug] || []) {
        const title = heading.title.toLowerCase();
        const haystack = `${title} ${(heading.keywords || "").toLowerCase()}`;
        if (!terms.every(term => haystack.includes(term))) continue;
        let score = 0;
        for (const term of terms) score += title.startsWith(term) ? 6 : new RegExp(`\\b${escapeRegExp(term)}`).test(title) ? 4 : title.includes(term) ? 3 : 1;
        scored.push({ title: heading.title, description: page.title, href: `${path}#${heading.id}`, score });
      }
      const pageText = `${page.title} ${page.description} ${page.searchText || ""}`.toLowerCase();
      if (terms.every(term => pageText.includes(term))) {
        const score = terms.reduce((sum, term) => sum + (page.title.toLowerCase().includes(term) ? 5 : 0.5), 0);
        scored.push({ title: page.title, description: page.description, href: path, score });
      }
    }
    return scored.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [pages, query]);

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function go(href: string) {
    closeSearch();
    router.push(href);
  }

  function onSearchKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return;
    if (event.key === "ArrowDown") { event.preventDefault(); setActive(i => (i + 1) % results.length); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive(i => (i - 1 + results.length) % results.length); }
    if (event.key === "Enter") { event.preventDefault(); go(results[active].href); }
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("hive-docs-theme", nextTheme);
  }

  return <main className={styles.page} data-docs-theme={theme}>
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.menuButton} type="button" aria-label={menuOpen ? "Close documentation menu" : "Open documentation menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        <Link className={styles.brand} href="/docs" aria-label="HIVE CLI docs home"><Image src="/hivelogo.svg" alt="" width={27} height={29} /><span>HIVE <em>CLI Docs</em></span></Link>
      </div>
      <div className={styles.headerActions}>
        <button className={styles.searchTrigger} type="button" onClick={() => { setSearchOpen(true); window.setTimeout(() => searchRef.current?.focus(), 0); }}><Search size={16} /><span>Search documentation...</span><kbd><Command size={11} /> K</kbd></button>
        <button className={styles.themeButton} type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
        <Link className={styles.homeLink} href="/"><ArrowLeft size={15} /><span>Home</span></Link>
      </div>
    </header>

    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
        <span className={styles.sidebarLabel}>GET STARTED</span>
        <nav aria-label="Documentation pages">{pages.map(page => <Link key={page.slug} href={page.slug ? `/docs/${page.slug}` : "/docs"} aria-current={page.slug === slug ? "page" : undefined} onClick={() => setMenuOpen(false)}>{page.title}</Link>)}</nav>
        <div className={styles.sidebarDivider} />
        <span className={styles.sidebarLabel}>RESOURCES</span>
        <a className={styles.npmLink} href="https://www.npmjs.com/package/@usehive/cli" target="_blank" rel="noopener noreferrer">Package on npm <ArrowUpRight size={14} /></a>
      </aside>

      <article className={styles.article}>
        <div className={styles.breadcrumb}>Docs <span>/</span> {current.title}</div>
        <h1>{current.title}</h1>
        <p className={styles.lead}>{current.description}</p>
        {children}
        <nav className={styles.pager} aria-label="Documentation pagination">
          {previous ? <Link href={previous.slug ? `/docs/${previous.slug}` : "/docs"}><ArrowLeft size={18} /><span><small>Previous</small>{previous.title}</span></Link> : <span />}
          {next ? <Link href={`/docs/${next.slug}`}><span><small>Next</small>{next.title}</span><ArrowRight size={18} /></Link> : <span />}
        </nav>
      </article>

      <aside className={styles.toc} aria-label="On this page"><div className={styles.tocInner}><span className={styles.sidebarLabel}>ON THIS PAGE</span><nav>{headings.map(heading => <a key={heading.id} href={`#${heading.id}`}>{heading.title}</a>)}</nav></div></aside>
    </div>

    {searchOpen && <div className={styles.searchOverlay} onMouseDown={event => { if (event.target === event.currentTarget) closeSearch(); }}><div className={styles.searchDialog} role="dialog" aria-modal="true" aria-label="Search documentation"><div className={styles.searchField}><Search size={20} /><input ref={searchRef} value={query} onChange={event => { setQuery(event.target.value); setActive(0); }} onKeyDown={onSearchKey} placeholder="Search documentation..." aria-label="Search documentation" /><button type="button" aria-label="Close search" onClick={closeSearch}><X size={17} /></button></div><div className={styles.searchResults}>{query.trim() ? results.length ? results.map((result, i) => <Link key={result.href} href={result.href} data-active={i === active || undefined} onMouseEnter={() => setActive(i)} onClick={closeSearch}><strong>{result.title}</strong><span>{result.description}</span></Link>) : <p>No matching documentation.</p> : <p>Search pages, commands, and setup topics.</p>}</div></div></div>}
  </main>;
}

export const toc: Record<string, readonly Heading[]> = {
  "": [
    { id: "requirements", title: "Before you start", keywords: "requirements node typescript next.js app router" },
    { id: "preview", title: "Preview the scan", keywords: "scan dry-run preview" },
    { id: "install", title: "Generate and install", keywords: "install generate npx global" },
    { id: "run", title: "Run it locally", keywords: "run hive:mcp dev start server local" },
    { id: "sync", title: "Keep it in sync", keywords: "sync rescan re-scan update changes" },
    { id: "host", title: "Use it from Claude or ChatGPT", keywords: "deploy host vercel claude chatgpt connector remote" },
  ],
  configuration: [
    { id: "environment", title: "Environment", keywords: "env .env HIVE_APP_BASE_URL HIVE_MCP_PORT HIVE_HTTP_TIMEOUT_MS variables" },
    { id: "authentication", title: "Application auth", keywords: "auth authentication bearer token cookie HIVE_FORWARD_AUTH api key" },
    { id: "connect", title: "Connect a client", keywords: "connect client claude cursor chatgpt mcp config HIVE_MCP_TOKEN" },
    { id: "deploy", title: "Host on Vercel", keywords: "deploy host vercel secret link rotate-key app-url project claude chatgpt connector" },
    { id: "permissions", title: "Permissions", keywords: "permissions policy policy.json mode read-only off allow deny tools enable disable" },
    { id: "logs", title: "Action log", keywords: "logs log actions.jsonl HIVE_LOG HIVE_LOG_ARGS audit" },
    { id: "remote", title: "Remote access", keywords: "remote tunnel HIVE_ALLOWED_HOSTS HIVE_ALLOWED_ORIGINS ngrok" },
    { id: "check", title: "Check the setup", keywords: "doctor check network debug troubleshoot" },
  ],
  commands: [
    { id: "usage", title: "Run a command", keywords: "usage npx hive run" },
    { id: "reference", title: "Command reference", keywords: "commands scan install sync check tools enable disable mode logs inspect dev stdio doctor deploy rotate-key project json select" },
    { id: "rescan", title: "When your app changes", keywords: "sync rescan re-scan drift breaking safe change accept-changed ci" },
    { id: "scope", title: "Current scope", keywords: "scope limits limitations oauth" },
  ],
};
