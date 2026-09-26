import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/site-chrome";
import styles from "./manifesto.module.css";

export const metadata: Metadata = {
  title: "The Hive manifesto",
  description: "Built to be used, not looked at. The Hive manifesto on software made for agents.",
};

function Label({ children, number }: { children: React.ReactNode; number: string }) {
  return (
    <div className={styles.labelRow}>
      <span className={styles.label}>{children}</span>
      <span className={styles.labelNumber} aria-hidden="true">{number} / 09</span>
    </div>
  );
}

export default function ManifestoPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="/" aria-label="HIVE home">
          <Image src="/hivelogo.svg" alt="" width={30} height={30} />
          <span>HIVE</span>
        </a>
        <nav className={styles.headerNav} aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <span aria-current="page">Manifesto</span>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="manifesto-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.heroMarker} aria-hidden="true">✳</span>
          <h1 id="manifesto-title">Built to be used,<br /><span>not looked at.</span></h1>
          <p>The Hive manifesto</p>
        </div>
        <span className={styles.heroRule} aria-hidden="true" />
      </section>

      <section className={`${styles.section} ${styles.mission}`} aria-labelledby="mission-label">
        <div className={`${styles.sectionInner} reveal`}>
          <Label number="02"><span id="mission-label">our mission</span></Label>
          <p className={styles.missionStatement}>Our mission is to rebuild software&apos;s interface layer for its next trillion users, who won&apos;t be humans but agents, and compress the next hundred years of that future into ten.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.wrongRace}`} aria-labelledby="wrong-race-label">
        <div className={`${styles.sectionInner} reveal`}>
          <Label number="03"><span id="wrong-race-label">the wrong race</span></Label>
          <div className={styles.proseGrid}>
            <div className={styles.sideNote} aria-hidden="true"><span>01</span><span>the bottleneck</span></div>
            <div className={styles.prose}>
              <p>Everyone is teaching agents to pretend to be human. Better vision, better clicking, better guessing which rectangle is the checkout button. But the bottleneck was never agent capability. Today&apos;s agents are smart enough. The bottleneck is that software was never built for them.</p>
              <p>People using agents don&apos;t care how things get done. They care that they get done. Yet we force agents through interfaces designed for eyeballs: they burn tokens on UI noise, and one renamed button silently breaks the whole workflow.</p>
              <p>This isn&apos;t theoretical. I once asked an AI assistant about my own account, my own data, and it couldn&apos;t reach it. It took extra prompts to work around limits I didn&apos;t know existed, on a plan I&apos;d already paid for. That&apos;s when it clicked. This is the thing I want to change.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.atmSection}`} aria-labelledby="atm-label">
        <div className={`${styles.sectionInner} reveal`}>
          <Label number="04"><span id="atm-label">the atm lesson</span></Label>
          <div className={styles.atmGrid}>
            <div className={styles.atmFrame}>
              <Image src="/manifesto-atm.jpg" alt="A vintage 1980s ATM machine rendered in grainy lime and charcoal duotone" width={1024} height={1536} sizes="(max-width: 760px) 100vw, 46vw" />
            </div>
            <div className={styles.atmCopy}>
              <p>Banks didn&apos;t build a robot to walk into a branch, wait in line, and fill out a slip. They built the ATM: a machine-native interface to the same system. Nobody asked the robot to get better at standing in line.</p>
              <p>That&apos;s exactly what we&apos;re doing with agents today. Building better robots for the line, instead of building the ATM. Agents don&apos;t need better eyes for our screens. They need software with an interface made for them. Direct, programmatic. Intent in, result out.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.beforeAgents}`} aria-labelledby="before-agents-label">
        <div className={`${styles.sectionInner} reveal`}>
          <Label number="05"><span id="before-agents-label">software before agents</span></Label>
          <div className={styles.beforeContent}>
            <p>The web first gave humans pages to look at. Then it gave software APIs to call, and the API economy exploded. Stripe, Twilio, Plaid. Nobody predicted them from the HTML spec. They emerged the moment machines could talk to machines reliably.</p>
            <p>Agents are where software was before APIs. Powerful, but every integration bespoke, every workflow one redesign away from breaking. Once any application can expose a dependable, production-grade layer for agents, with auth, permissions, and sync built in, builders will stack on it the same way. The agent economy will be unplanned, distributed, and built by builders.</p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.plan}`} aria-labelledby="plan-label">
        <div className={`${styles.sectionInner} reveal`}>
          <Label number="06"><span id="plan-label">the plan</span></Label>
          <div className={styles.planRows}>
            <div className={styles.planRow}><span className={styles.stepNumber}>01</span><p><strong>Step one.</strong> Give every application an agent-usable layer, without the headache of hand-rolling MCP servers.</p></div>
            <div className={styles.planRow}><span className={styles.stepNumber}>02</span><p><strong>Step two.</strong> Make it production-grade, so when you change something for humans, it never breaks for agents.</p></div>
            <div className={styles.planRow}><span className={styles.stepNumber}>03</span><p><strong>Step three.</strong> Build the systems the agent economy will need. Agent payments, agent shopping, agent paywalls. Structured AI, controlled AI.</p></div>
          </div>
        </div>
      </section>

      <section className={`${styles.closing} reveal`} aria-label="Closing statement">
        <p>we&apos;re not teaching agents to see.<br /><span>we&apos;re building software to be used.</span></p>
      </section>

      <section className={`${styles.quoteSection} reveal`} aria-label="A quote from Pavan Babar">
        <blockquote className={styles.quote}>
          <span className={styles.openQuote} aria-hidden="true">“</span>
          <p>Future is just a visualization of your current understanding of your present. The more you advance in the present, the better future you see.</p>
          <span className={styles.closeQuote} aria-hidden="true">”</span>
          <footer>— Pavan Babar</footer>
        </blockquote>
      </section>

      <section className={`${styles.appendix} reveal`} aria-labelledby="appendix-label">
        <div className={styles.appendixInner}>
          <h2 id="appendix-label">appendix:</h2>
          <ol>
            <li>The &quot;next trillion users&quot; line is something I stumbled on while researching. It rewired how I think about who software is for.</li>
            <li>Screen-driven agents burn the majority of their tokens on rendering and parsing UI, not on the task. The interface is the tax.</li>
            <li>Managing MCP servers, auth, permissions, and sync in production is a second full-time job for startups. That&apos;s the headache Hive removes first.</li>
          </ol>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
