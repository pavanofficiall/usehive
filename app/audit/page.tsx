import type { Metadata } from "next";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import styles from "./audit.module.css";

export const metadata: Metadata = {
  title: "AI agent reliability audits | HIVE",
  description:
    "HIVE tests your AI agent with 50+ real prompts and edge cases, repairs what we can, and gives you a full report of every prompt, failure, and fix.",
  alternates: { canonical: "/audit" },
};

const auditEmail = "mailto:pavan@usehive.tech?subject=Audit%20my%20agent";

const benefits = [
  {
    number: "01",
    title: "Catch breaks before users do.",
    body: "Agents can fail quietly. Users rarely file a bug report. They just leave.",
  },
  {
    number: "02",
    title: "Get the exact prompt that broke it.",
    body: "Your engineers can reproduce the failure and fix it in hours, not days.",
  },
  {
    number: "03",
    title: "Stay correct as your product changes.",
    body: "A backend update can quietly change what your agent does. We look for those gaps.",
  },
  {
    number: "04",
    title: "Have proof you can share.",
    body: "Show customers and investors what you tested, what broke, and what you fixed.",
  },
];

const steps = [
  { number: "01", title: "Share your setup", body: "Give us access to the agent or MCP server you want tested." },
  { number: "02", title: "We try to break it", body: "We run 50+ real prompts and edge cases against the way people actually use it." },
  { number: "03", title: "We repair what we can", body: "We fix issues within reach and document anything that needs your team." },
  { number: "04", title: "You get the full report", body: "Every prompt, every failure, and every fix. Nothing hidden behind a score." },
];

function AuditButton({ children, secondary = false }: { children: React.ReactNode; secondary?: boolean }) {
  return (
    <a className={secondary ? styles.secondaryButton : styles.primaryButton} href={secondary ? "#method" : auditEmail}>
      {children} {secondary ? <ArrowDownRight size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
    </a>
  );
}

export default function AuditPage() {
  return (
    <div className={`home-shell ${styles.page}`}>
      <div className={styles.skyStage}>
        <SiteHeader />
        <main>
          <section className={styles.hero} aria-labelledby="audit-title">
            <div className={styles.heroInner}>
              <p className={styles.heroEyebrow}><span className={styles.statusDot} aria-hidden="true" /> HIVE / AGENT RELIABILITY AUDITS</p>
              <h1 id="audit-title">We break your AI agent <em>so your users never see it break.</em></h1>
              <p className={styles.heroCopy}>50+ real prompts and edge cases. We find the failures, repair what we can, and show you exactly what happened.</p>
              <div className={styles.heroActions}>
                <AuditButton>Get a free audit</AuditButton>
                <AuditButton secondary>See how it works</AuditButton>
              </div>
              <div className={styles.heroProof} aria-label="What the audit covers">
                <span>50+ prompts</span><span>Edge cases</span><span>Repairs included</span><span>Full report</span>
              </div>
            </div>
          </section>

          <section className={styles.benefits} aria-labelledby="benefits-title">
            <div className={styles.container}>
              <div className={styles.sectionLabel}><span>01 / WHY AUDIT</span><span>FIND THE FAILURES FIRST</span></div>
              <div className={styles.sectionHeading}>
                <h2 id="benefits-title">Know where it breaks.<br /><em>Before anyone else does.</em></h2>
                <p>Reliable agents are built by testing the messy stuff. We make that work visible.</p>
              </div>
              <div className={styles.benefitGrid}>
                {benefits.map((benefit) => (
                  <article className={styles.benefitCard} key={benefit.number}>
                    <span className={styles.cardNumber}>{benefit.number} / 04</span>
                    <div><h3>{benefit.title}</h3><p>{benefit.body}</p></div>
                    <ArrowRight className={styles.cardArrow} size={20} aria-hidden="true" />
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.method} id="method" aria-labelledby="method-title">
            <div className={styles.container}>
              <div className={styles.sectionLabel}><span>02 / THE METHOD</span><span>FOUR CLEAR STEPS</span></div>
              <div className={styles.methodLayout}>
                <div className={styles.methodIntro}>
                  <h2 id="method-title">No mystery.<br /><em>Just the work.</em></h2>
                  <p>We test the agent you actually ship, then give you the evidence to make it better.</p>
                </div>
                <ol className={styles.stepList}>
                  {steps.map((step) => (
                    <li key={step.number}>
                      <span className={styles.stepNumber}>{step.number}</span>
                      <div><h3>{step.title}</h3><p>{step.body}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className={styles.audience} aria-labelledby="audience-title">
            <div className={styles.container}>
              <div className={styles.sectionLabel}><span>03 / WHO IT&apos;S FOR</span><span>REAL USERS. REAL STAKES.</span></div>
              <div className={styles.audienceContent}>
                <h2 id="audience-title">Shipping an agent or MCP server to real users?</h2>
                <p>If people rely on it to get things done, it should survive more than a happy-path demo.</p>
              </div>
            </div>
          </section>

          <section className={styles.pricing} aria-labelledby="pricing-title">
            <div className={styles.container}>
              <div className={styles.sectionLabel}><span>04 / PRICING</span><span>ONE AUDIT. THE FULL PICTURE.</span></div>
              <div className={styles.priceCard}>
                <div className={styles.priceMain}>
                  <p className={styles.priceEyebrow}>AGENT RELIABILITY AUDIT</p>
                  <h2 id="pricing-title">See the weak spots.<br /><em>Fix the important ones.</em></h2>
                  <p className={styles.priceAmount}>₹4,999<span> / audit</span></p>
                  <p className={styles.priceNote}>Free for the first cohort of audits.</p>
                  <AuditButton>Get a free audit</AuditButton>
                </div>
                <div className={styles.included}>
                  <h3>What&apos;s included</h3>
                  <ul>
                    <li>50+ real prompts and edge cases</li>
                    <li>Failures you can reproduce</li>
                    <li>Repairs where possible</li>
                    <li>A full prompt-by-prompt report</li>
                    <li>Every failure and fix documented</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.finalCta} aria-labelledby="final-title">
            <div className={styles.container}>
              <p className={styles.finalEyebrow}>READY TO FIND OUT?</p>
              <h2 id="final-title">Let&apos;s find the breaks <em>before your users do.</em></h2>
              <AuditButton>Get a free audit</AuditButton>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
