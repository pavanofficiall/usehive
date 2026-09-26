import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { DocsCode } from "@/components/docs-code";
import styles from "./docs.module.css";

export const docPages = [
  { slug: "", title: "Get started", description: "Scan your app, review its capabilities, and run a local MCP server." },
  { slug: "configuration", title: "Configuration", description: "Point the generated server at your application and connect a local MCP client." },
  { slug: "commands", title: "CLI reference", description: "The commands you need to inspect, generate, run, and re-scan." },
] as const;

type PageSlug = (typeof docPages)[number]["slug"];

function GetStarted() {
  return <>
    <section className={styles.section} id="requirements"><h2>Before you start</h2><p>Use Node.js 22.12 or newer. HIVE CLI currently scans an existing <strong>TypeScript Next.js App Router</strong> project. Run commands from that project&apos;s root.</p></section>
    <section className={styles.section} id="preview"><h2>Preview the scan</h2><p>See discovered capabilities without writing files.</p><DocsCode>{"npx @usehive/cli scan --dry-run"}</DocsCode></section>
    <section className={styles.section} id="install"><h2>Generate and install</h2><p>Run the interactive scan. Review the methods, routes, risk labels, and permission evidence before selecting tools. Read operations start selected; write and destructive operations start unselected.</p><DocsCode>{"npx @usehive/cli scan --install"}</DocsCode><p>HIVE generates the selected MCP tools inside <code>.hive/</code> and installs the generated server&apos;s dependencies.</p></section>
    <section className={styles.section} id="run"><h2>Run it locally</h2><p>Start your application normally. Copy the generated environment template and set <code>HIVE_APP_BASE_URL</code> to your running app&apos;s origin. Add an existing app credential only if its API needs one.</p><DocsCode>{"cp .hive/mcp/.env.example .hive/mcp/.env\nnpm run hive:mcp"}</DocsCode><p>The Streamable HTTP endpoint is <code>http://127.0.0.1:3333/mcp</code>. If your project already had a <code>hive:mcp</code> script, HIVE leaves it unchanged; use <code>npx @usehive/cli dev</code> instead.</p></section>
  </>;
}

function Configuration() {
  return <>
    <section className={styles.section} id="environment"><h2>Environment</h2><p>Set values in <code>.hive/mcp/.env</code>, not in your application&apos;s public environment. The generated <code>.env.example</code> is the starting point.</p><DocsCode label=".hive/mcp/.env">{"HIVE_APP_BASE_URL=http://localhost:3000\nHIVE_MCP_PORT=3333"}</DocsCode><p><code>HIVE_APP_BASE_URL</code> points to the app whose existing APIs the tools call. The MCP server listens on loopback at port <code>3333</code> by default.</p></section>
    <section className={styles.section} id="authentication"><h2>Application auth</h2><p>If your app&apos;s APIs require authentication, configure an existing bearer token with <code>HIVE_APP_BEARER_TOKEN</code> or an existing cookie with <code>HIVE_APP_COOKIE</code>. Set <code>HIVE_FORWARD_AUTH=true</code> only when you intend to forward incoming Authorization or Cookie headers to the app. <code>HIVE_MCP_TOKEN</code> optionally protects the local MCP endpoint and is never forwarded to the app.</p><p>Keep credential values out of source control and shared logs.</p></section>
    <section className={styles.section} id="connect"><h2>Connect a client</h2><p>Run your app and the generated server, then configure a local MCP client with Streamable HTTP at:</p><DocsCode label="MCP endpoint">{"http://127.0.0.1:3333/mcp"}</DocsCode><p>Only capabilities approved during review appear as tools. This release is a local, single-user runtime; it does not set up hosted deployment or production OAuth.</p></section>
    <section className={styles.section} id="check"><h2>Check the setup</h2><DocsCode>{"npx @usehive/cli doctor"}</DocsCode><p><code>doctor</code> checks the local project, generated files, dependencies, and manifest consistency. It does not verify every application credential or API response.</p></section>
  </>;
}

const commands = [
  ["scan --dry-run", "Preview discovery without writing files."],
  ["scan --install", "Review, generate approved tools, and install generated dependencies."],
  ["scan --read-only", "Approve only supported read operations explicitly."],
  ["scan --json", "Output machine-readable analysis without writing files."],
  ["scan --select <names>", "Select named capabilities from a previous scan for scripts or CI."],
  ["scan --no-script", "Generate without changing your app's package.json."],
  ["generate", "Re-scan, review, and regenerate selected tools."],
  ["inspect", "Show the generated manifest and candidates."],
  ["dev", "Run the generated local Streamable HTTP server."],
  ["dev --stdio", "Run the generated server with stdio transport."],
  ["doctor", "Check the local generated setup."],
] as const;

function Commands() {
  return <>
    <section className={styles.section} id="usage"><h2>Run a command</h2><p>Use <code>npx @usehive/cli</code> from the application root, followed by one of the commands below. Every command also accepts <code>-C /path/to/app</code> to target another application root.</p><DocsCode>{"npx @usehive/cli inspect"}</DocsCode></section>
    <section className={styles.section} id="reference"><h2>Command reference</h2><div className={styles.commandList}>{commands.map(([name, purpose]) => <div className={styles.commandItem} key={name}><code>{name}</code><span>{purpose}</span></div>)}</div></section>
    <section className={styles.section} id="rescan"><h2>When your app changes</h2><p>Run <code>generate</code> again. HIVE reports new, changed, removed, and unchanged candidates, then asks you to review selections again. It does not silently carry approval over to changed code.</p><DocsCode>{"npx @usehive/cli generate"}</DocsCode></section>
    <section className={styles.section} id="scope"><h2>Current scope</h2><p>The published CLI supports one TypeScript Next.js App Router application root at a time and generates a local MCP server. Other frameworks, automatic deployment, and production OAuth are not part of this release.</p></section>
  </>;
}

export function DocsPage({ slug }: { slug: PageSlug }) {
  const index = docPages.findIndex(page => page.slug === slug);
  const current = docPages[index];
  const previous = docPages[index - 1];
  const next = docPages[index + 1];

  return <main className={styles.page}>
    <header className={styles.header}>
      <Link className={styles.brand} href="/docs" aria-label="HIVE CLI docs home"><Image src="/hivelogo.svg" alt="" width={28} height={30} /><span>HIVE <em>CLI Docs</em></span></Link>
      <Link className={styles.homeLink} href="/"><ArrowLeft size={15} /> Back to home</Link>
    </header>
    <div className={styles.layout}>
      <aside className={styles.sidebar}><span className={styles.sidebarLabel}>DOCUMENTATION</span><nav aria-label="Documentation pages">{docPages.map((page, pageIndex) => <Link key={page.slug} href={page.slug ? `/docs/${page.slug}` : "/docs"} aria-current={page.slug === slug ? "page" : undefined}><span>{String(pageIndex + 1).padStart(2, "0")}</span>{page.title}</Link>)}</nav><a className={styles.npmLink} href="https://www.npmjs.com/package/@usehive/cli" target="_blank" rel="noopener noreferrer">View on npm <ArrowUpRight size={14} /></a></aside>
      <article className={styles.article}>
        <div className={styles.kicker}>HIVE CLI / {String(index + 1).padStart(2, "0")}</div>
        <h1>{current.title}</h1>
        <p className={styles.lead}>{current.description}</p>
        {slug === "" ? <GetStarted /> : slug === "configuration" ? <Configuration /> : <Commands />}
        <nav className={styles.pager} aria-label="Documentation pagination">
          {previous ? <Link href={previous.slug ? `/docs/${previous.slug}` : "/docs"}><ArrowLeft size={18} /><span><small>Previous</small>{previous.title}</span></Link> : <span />}
          {next ? <Link href={`/docs/${next.slug}`}><span><small>Next</small>{next.title}</span><ArrowRight size={18} /></Link> : <span />}
        </nav>
      </article>
    </div>
  </main>;
}
