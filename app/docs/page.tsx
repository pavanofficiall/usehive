import type { Metadata } from "next";
import ScrambleText from "@/components/ScrambleText";
import { SiteFooter } from "../hive-brand";
import { SiteNav } from "../site-chrome";

export const metadata: Metadata = {
  title: "Docs — Hive",
  description: "An introduction to Hive's agent content, approved actions, and continuous synchronization model.",
  openGraph: {
    title: "Hive Documentation",
    description: "Understand the concepts behind an agent-facing layer for your existing website.",
    url: "/docs",
  },
};

const lifecycle = [
  ["01", "Connect", "Point Hive at the website and establish ownership."],
  ["02", "Map", "Translate pages, product concepts, and interaction paths into structured surfaces."],
  ["03", "Approve", "Choose what agents may understand and which actions they may invoke."],
  ["04", "Synchronize", "Keep the agent-facing layer aligned as the underlying website changes."],
];

export default function DocsPage() {
  return (
    <main>
      <SiteNav active="docs" />

      <section className="inner-hero docs-hero section-grid" id="top">
        <div className="section-shell inner-hero__shell docs-hero__shell">
          <span className="eyebrow"><i className="signal-dot" /> Documentation / Introduction</span>
          <h1><ScrambleText text="A machine interface for the website you already run." /></h1>
          <p>Hive creates a structured, governed layer that helps AI agents understand a product and invoke approved capabilities without depending on the visual interface.</p>
          <div className="docs-status"><span>DOCS v0.1</span><i />Conceptual preview for private beta</div>
        </div>
      </section>

      <section className="docs-section section-grid">
        <div className="section-shell docs-layout">
          <aside className="docs-sidebar" aria-label="Documentation sections">
            <span>ON THIS PAGE</span>
            <a href="#overview">Overview</a>
            <a href="#model">Core model</a>
            <a href="#lifecycle">Lifecycle</a>
            <a href="#manifest">Manifest</a>
            <a href="#safety">Safety model</a>
          </aside>

          <div className="docs-content">
            <section id="overview">
              <span className="section-number">01 / OVERVIEW</span>
              <h2><ScrambleText text="One product. Two interfaces." /></h2>
              <p>Your current website remains the source of truth and the interface people use. Hive adds a second surface designed for software: explicit concepts, predictable structure, and controlled actions.</p>
              <div className="docs-equation" aria-label="Existing website plus Hive equals human and agent interfaces">
                <span>EXISTING WEBSITE</span><i>+</i><strong>HIVE</strong><i>=</i><span>HUMANS + AGENTS</span>
              </div>
            </section>

            <section id="model">
              <span className="section-number">02 / CORE MODEL</span>
              <h2><ScrambleText text="Content to understand. Actions to invoke. Sync to stay current." /></h2>
              <div className="docs-concepts">
                <article><i>01</i><h3>Agent Content</h3><p>Structured representations of products, pricing, documentation, policies, and other information already published on the site.</p></article>
                <article><i>02</i><h3>Agent Actions</h3><p>Named, approved operations such as search, submit, book, or purchase—with clear inputs and product-side controls.</p></article>
                <article><i>03</i><h3>Continuous Sync</h3><p>Change detection and review keep the machine surface aligned with the live website instead of creating a stale second product.</p></article>
              </div>
            </section>

            <section id="lifecycle">
              <span className="section-number">03 / LIFECYCLE</span>
              <h2><ScrambleText text="From live website to governed interface." /></h2>
              <div className="docs-lifecycle">
                {lifecycle.map(([index, title, copy]) => <article key={title}><i>{index}</i><div><h3>{title}</h3><p>{copy}</p></div></article>)}
              </div>
            </section>

            <section id="manifest">
              <span className="section-number">04 / ILLUSTRATIVE MANIFEST</span>
              <h2><ScrambleText text="Make the interface inspectable." /></h2>
              <p>This conceptual manifest shows the shape of an agent-facing surface. The private-beta implementation may evolve.</p>
              <div className="docs-code">
                <div><span>hive.manifest.json</span><i>ILLUSTRATIVE</i></div>
                <pre><code>{`{
  "site": "yourcompany.com",
  "content": ["products", "docs", "pricing"],
  "actions": [
    {
      "name": "book_demo",
      "approval": "required"
    }
  ],
  "sync": "continuous"
}`}</code></pre>
              </div>
            </section>

            <section id="safety">
              <span className="section-number">05 / SAFETY MODEL</span>
              <h2><ScrambleText text="Explicit by design." /></h2>
              <div className="docs-safety">
                <p>Hive is designed around intentional exposure rather than unrestricted automation. Teams decide which content is represented, which actions exist, and where approval or authentication belongs.</p>
                <ul><li>Ownership verification before mapping</li><li>Allowlisted actions and clear schemas</li><li>Human review before sensitive changes ship</li><li>Authentication remains with the underlying product</li></ul>
              </div>
            </section>

            <div className="docs-next">
              <span>READY TO EXPLORE?</span>
              <div><h2><ScrambleText text="Start with the developer workflow." /></h2><a className="button" href="/developers">Open Developers →</a></div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
