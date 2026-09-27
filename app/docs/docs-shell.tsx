"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Command, Menu, Moon, Search, Sun, X } from "lucide-react";
import styles from "./docs.module.css";

type Entry = { slug: string; title: string; description: string; searchText?: string };
type Heading = { id: string; title: string };

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
      if (event.key === "Escape") setSearchOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return pages.flatMap(page => {
      const path = page.slug ? `/docs/${page.slug}` : "/docs";
      const matches = `${page.title} ${page.description} ${page.searchText || ""}`.toLowerCase().includes(term);
      const pageResult = matches ? [{ title: page.title, description: page.description, href: path }] : [];
      const pageHeadings = (page.slug === "" ? toc[""] : toc[page.slug] || [])
        .filter(heading => heading.title.toLowerCase().includes(term))
        .map(heading => ({ title: heading.title, description: page.title, href: `${path}#${heading.id}` }));
      return [...pageResult, ...pageHeadings];
    });
  }, [pages, query]);

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

    {searchOpen && <div className={styles.searchOverlay} onMouseDown={event => { if (event.target === event.currentTarget) setSearchOpen(false); }}><div className={styles.searchDialog} role="dialog" aria-modal="true" aria-label="Search documentation"><div className={styles.searchField}><Search size={20} /><input ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search documentation..." aria-label="Search documentation" /><button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={17} /></button></div><div className={styles.searchResults}>{query.trim() ? results.length ? results.map(result => <Link key={result.href} href={result.href} onClick={() => { setSearchOpen(false); setQuery(""); }}><strong>{result.title}</strong><span>{result.description}</span></Link>) : <p>No matching documentation.</p> : <p>Search pages, commands, and setup topics.</p>}</div></div></div>}
  </main>;
}

export const toc: Record<string, readonly Heading[]> = {
  "": [{ id: "requirements", title: "Before you start" }, { id: "preview", title: "Preview the scan" }, { id: "install", title: "Generate and install" }, { id: "run", title: "Run it locally" }],
  configuration: [{ id: "environment", title: "Environment" }, { id: "authentication", title: "Application auth" }, { id: "connect", title: "Connect a client" }, { id: "check", title: "Check the setup" }],
  commands: [{ id: "usage", title: "Run a command" }, { id: "reference", title: "Command reference" }, { id: "rescan", title: "When your app changes" }, { id: "scope", title: "Current scope" }],
};
