import type { Metadata } from "next";
import ScrambleText from "@/components/ScrambleText";
import { DeveloperModules, DesignPartnerDialog, WaitlistForm } from "../hive-interactions";
import { HiveMark, SiteFooter } from "../hive-brand";
import { SiteNav } from "../site-chrome";

export const metadata: Metadata = {
  title: "Developers — Hive",
  description: "Explore how Hive turns existing websites into structured interfaces for AI agents.",
  openGraph: {
    title: "Hive for Developers",
    description: "Build an agent-facing layer for the websites you already operate.",
    url: "/developers",
  },
};

const workflow = [
  ["01", "Connect Website"],
  ["02", "Verify Ownership"],
  ["03", "Map the Product"],
  ["04", "Review Interfaces"],
  ["05", "Keep in Sync"],
];

const contentRows = ["Products", "Pricing", "Documentation", "FAQs", "Policies"];
const actionRows = ["search()", "submit_form()", "book()", "add_to_cart()", "place_order()"];

export default function DevelopersPage() {
  return (
    <main>
      <SiteNav active="developers" />

      <section className="inner-hero inner-hero--developers section-grid" id="top">
        <div className="section-shell inner-hero__shell">
          <span className="eyebrow"><i className="signal-dot" /> Hive for developers</span>
          <h1>
            <ScrambleText text="Build once." />
            <br />
            <em><ScrambleText text="Serve humans and agents." delay={130} /></em>
          </h1>
          <p>Hive gives teams a way to create and maintain an agent-facing interface for an existing website—without turning it into a second product.</p>
          <div className="inner-hero__actions">
            <a className="button" href="#developer-waitlist">Join Developer Waitlist →</a>
            <DesignPartnerDialog />
          </div>
          <div className="inner-hero__rail" aria-label="Hive developer principles">
            <span>Existing website</span><i />
            <span>Structured content</span><i />
            <span>Callable actions</span><i />
            <span>Continuous sync</span>
          </div>
        </div>
      </section>

      <section className="developer-deep section-grid" aria-labelledby="workflow-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <span className="section-number">01 / THE WORKFLOW</span>
            <div className="section-copy-block">
              <h2 id="workflow-title"><ScrambleText text="A developer layer for the web you already have." /></h2>
              <p>The early workflow is designed around understanding the application first, then exposing only the content and actions a team approves.</p>
            </div>
          </div>
          <div className="developer-flow reveal" aria-label="Hive developer workflow">
            {workflow.map(([index, label], itemIndex) => (
              <div className={itemIndex === 3 ? "developer-step developer-step--active" : "developer-step"} key={label}>
                <span>{index}</span><strong>{label}</strong>
                {itemIndex < workflow.length - 1 && <i aria-hidden="true">→</i>}
              </div>
            ))}
          </div>
          <DeveloperModules />
        </div>
      </section>

      <section className="developer-surfaces section-grid" aria-labelledby="surfaces-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <span className="section-number">02 / TWO SURFACES</span>
            <h2 id="surfaces-title"><ScrambleText text="Information to understand. Capabilities to invoke." /></h2>
          </div>
          <div className="surface-grid reveal">
            <article className="surface-card surface-card--content">
              <div className="surface-card__head"><span>AGENT CONTENT</span><i>WHAT IT KNOWS</i></div>
              <p>Structured representations of the information already available through the website.</p>
              <div className="surface-rows">
                {contentRows.map((row, index) => <code key={row}><i>{String(index + 1).padStart(2, "0")}</i><span>/content/{row.toLowerCase()}</span><b>GET</b></code>)}
              </div>
            </article>
            <article className="surface-card surface-card--actions">
              <div className="surface-card__head"><span>AGENT ACTIONS</span><i>WHAT IT CAN DO</i></div>
              <p>Explicit, approved operations that replace fragile navigation and simulated clicks.</p>
              <div className="surface-rows">
                {actionRows.map((row, index) => <code key={row}><i>{String(index + 1).padStart(2, "0")}</i><span>{row}</span><b>CALL</b></code>)}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="developer-layer section-grid" aria-labelledby="layer-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <span className="section-number">03 / THE LAYER</span>
            <h2 id="layer-title"><ScrambleText text="Above the application. Below every agent." /></h2>
          </div>
          <div className="layer-diagram reveal" aria-label="Hive sits between an existing application and agents">
            <article><small>YOUR PRODUCT</small><strong>Existing Website</strong><span>UI · APIs · Forms · Content</span></article>
            <div className="layer-connector" aria-hidden="true"><i /><i /><i /></div>
            <article className="layer-diagram__hive"><HiveMark /><strong>Hive</strong><span>Understand · Interface · Sync</span></article>
            <div className="layer-connector" aria-hidden="true"><i /><i /><i /></div>
            <article><small>AGENT ECOSYSTEM</small><strong>AI Agents</strong><span>MCP · WebMCP · Agent clients</span></article>
          </div>
          <p className="layer-note reveal">Hive is not a chatbot or a replacement frontend. It is the interface layer that helps agents understand and operate the existing product.</p>
        </div>
      </section>

      <section className="developer-join section-grid" aria-labelledby="join-title">
        <div className="section-shell developer-join__shell">
          <div className="developer-join__copy reveal">
            <span className="eyebrow">Early access</span>
            <h2 id="join-title"><ScrambleText text="Help shape the agent-ready web." /></h2>
            <p>Join the developer waitlist or apply with a real website to work directly with the Hive team.</p>
          </div>
          <div className="developer-join__form reveal"><WaitlistForm /></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
