import type { Metadata } from "next";
import ScrambleText from "@/components/ScrambleText";
import { FounderConversation } from "../hive-interactions";
import { HiveMark, SiteFooter } from "../hive-brand";
import { SiteNav } from "../site-chrome";

export const metadata: Metadata = {
  title: "Investors — Hive",
  description: "The infrastructure thesis behind Hive and the emerging agent-facing web.",
  openGraph: {
    title: "The Hive Thesis",
    description: "Infrastructure for a web with two kinds of users: humans and AI agents.",
    url: "/investors",
  },
};

const shifts = [
  { number: "01", label: "WEB 1", title: "Pages", copy: "Information was published for humans to read." },
  { number: "02", label: "WEB 2", title: "Applications", copy: "Interfaces were built for humans to click and operate." },
  { number: "03", label: "AGENTIC WEB", title: "Machine Interfaces", copy: "Software needs structured surfaces agents can understand and use." },
];

const infrastructureReasons = [
  { index: "01", title: "The installed web remains", copy: "Businesses already run through websites and applications. The agent layer has to meet them where they are." },
  { index: "02", title: "Interfaces are fragmenting", copy: "Every agent should not need a custom integration or rely on brittle visual automation for every product." },
  { index: "03", title: "Change is continuous", copy: "A useful machine interface must evolve with the underlying website, content and product capabilities." },
];

export default function InvestorsPage() {
  return (
    <main>
      <SiteNav active="investors" />

      <section className="inner-hero inner-hero--investors section-grid" id="top">
        <div className="section-shell inner-hero__shell">
          <span className="eyebrow"><i className="signal-dot" /> The Hive thesis</span>
          <h1>
            <ScrambleText text="Infrastructure for a web with " />
            <em><ScrambleText text="two kinds of users." delay={130} /></em>
          </h1>
          <p>Humans will continue using interfaces. AI agents will need a second, structured way to understand and operate the same products.</p>
          <div className="inner-hero__actions">
            <FounderConversation className="button" initialTopic="Investing in Hive" />
            <a className="outline-button" href="mailto:hello@usehive.tech?subject=Hive%20Pitch%20Deck">View Pitch Deck →</a>
          </div>
          <div className="stage-note"><span className="status-light" /> Not currently fundraising · Building the product and thesis</div>
        </div>
      </section>

      <section className="investor-shift section-grid" aria-labelledby="shift-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <span className="section-number">01 / THE SHIFT</span>
            <h2 id="shift-title"><ScrambleText text="The web's next user is not human." /></h2>
          </div>
          <div className="shift-grid reveal">
            {shifts.map((shift, index) => (
              <article className={index === 2 ? "shift-card shift-card--active" : "shift-card"} key={shift.label}>
                <div><span>{shift.label}</span><i>{shift.number}</i></div>
                <h3>{shift.title}</h3><p>{shift.copy}</p>
                {index < shifts.length - 1 && <b aria-hidden="true">→</b>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="investor-product section-grid" aria-labelledby="product-layer-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <span className="section-number">02 / THE PRODUCT LAYER</span>
            <div className="section-copy-block">
              <h2 id="product-layer-title"><ScrambleText text="Hive gives the existing web an agent interface." /></h2>
              <p>The product sits above existing applications and turns their information and approved operations into a synchronized machine-facing layer.</p>
            </div>
          </div>
          <div className="investor-product-grid reveal">
            <article><span>01</span><HiveMark compact /><h3>Understand</h3><p>Map website content, structure and interactions into product concepts.</p></article>
            <article><span>02</span><HiveMark compact /><h3>Interface</h3><p>Expose Agent Content and Agent Actions through structured surfaces.</p></article>
            <article><span>03</span><HiveMark compact /><h3>Synchronize</h3><p>Keep the machine interface aligned as the underlying website changes.</p></article>
          </div>
          <div className="investor-equation reveal" aria-label="Hive product model">
            <span>EXISTING WEBSITE</span><i>+</i><strong>HIVE</strong><i>=</i><span>AGENT-READY BUSINESS</span>
          </div>
        </div>
      </section>

      <section className="infrastructure-case section-grid" aria-labelledby="case-title">
        <div className="section-shell">
          <div className="section-heading reveal">
            <span className="section-number">03 / WHY INFRASTRUCTURE</span>
            <h2 id="case-title"><ScrambleText text="A shared layer, not another destination." /></h2>
          </div>
          <div className="infrastructure-grid reveal">
            {infrastructureReasons.map((reason) => <article key={reason.index}><span>{reason.index}</span><h3>{reason.title}</h3><p>{reason.copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="investor-vision section-grid" aria-labelledby="investor-vision-title">
        <div className="section-shell investor-vision__shell reveal">
          <span className="eyebrow">The long view</span>
          <h2 id="investor-vision-title"><ScrambleText text="Every website becomes part of the agentic web." /></h2>
          <p>Hive&apos;s ambition is to become the infrastructure layer connecting existing websites to the agents that will discover, understand and operate them.</p>
          <div className="investor-vision__diagram" aria-label="Human and agent interfaces share one application">
            <article><small>HUMANS</small><strong>Visual UI</strong></article>
            <i aria-hidden="true" />
            <div><HiveMark /><strong>APPLICATION</strong></div>
            <i aria-hidden="true" />
            <article><small>AGENTS</small><strong>Hive Interface</strong></article>
          </div>
        </div>
      </section>

      <section className="investor-contact section-grid" aria-labelledby="investor-contact-title">
        <div className="section-shell investor-contact__shell reveal">
          <span className="eyebrow">Founder conversations</span>
          <h2 id="investor-contact-title"><ScrambleText text="Thinking deeply about the agentic web?" /></h2>
          <p>We&apos;re not currently fundraising. We&apos;re speaking with investors, builders and infrastructure leaders who are exploring the same platform shift.</p>
          <div className="investor-actions">
            <FounderConversation className="button" initialTopic="Investing in Hive" />
            <a className="outline-button" href="mailto:hello@usehive.tech?subject=Hive%20Pitch%20Deck">View Pitch Deck →</a>
          </div>
          <small>Not currently fundraising. Building, learning and staying close to the people shaping this market.</small>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
