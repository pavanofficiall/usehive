import type { Metadata } from "next";
import ScrambleText from "@/components/ScrambleText";
import { FounderConversation } from "../hive-interactions";
import { SiteFooter } from "../hive-brand";
import { SiteNav } from "../site-chrome";

export const metadata: Metadata = {
  title: "Pricing — Hive",
  description: "Early-access plans for making existing websites understandable and operable by AI agents.",
  openGraph: {
    title: "Hive Pricing",
    description: "Choose an early-access plan for your agent-facing website layer.",
    url: "/pricing",
  },
};

type Plan = {
  name: string;
  audience: string;
  price: string;
  cadence: string;
  description: string;
  features: readonly string[];
  action: string;
  href?: string;
  featured?: boolean;
  founder?: boolean;
};

const plans: readonly Plan[] = [
  {
    name: "Developer",
    audience: "For individual builders",
    price: "$20",
    cadence: "/ month",
    description: "Start with one production website and the core surfaces agents need.",
    features: ["1 production website", "Agent Content layer", "10 approved Agent Actions", "Daily synchronization", "MCP + WebMCP export", "Community support"],
    action: "Join Developer Waitlist →",
    href: "/developers#developer-waitlist",
  },
  {
    name: "Startup",
    audience: "For growing product teams",
    price: "$90",
    cadence: "/ month",
    description: "Coordinate richer agent interfaces across a small product portfolio.",
    features: ["Up to 5 production websites", "Expanded content surfaces", "100 approved Agent Actions", "Hourly synchronization", "Team review workflow", "Priority support"],
    action: "Join Startup Waitlist →",
    href: "/developers#developer-waitlist",
    featured: true,
  },
  {
    name: "Beta User",
    audience: "For early collaborators",
    price: "Free",
    cadence: "during beta",
    description: "Help shape Hive with a real website and direct product feedback.",
    features: ["1 beta website", "Core website mapping", "Limited content + actions", "Manual review workflow", "Beta feedback channel", "Community support"],
    action: "Apply for Beta →",
    href: "/developers#developer-waitlist",
  },
  {
    name: "Enterprise",
    audience: "For complex organizations",
    price: "Custom",
    cadence: "annual agreement",
    description: "Design the operating model, controls, and scale around your environment.",
    features: ["Custom site and action limits", "Dedicated environment", "SSO + team controls", "Policy and audit tooling", "Integration support", "SLA + procurement support"],
    action: "Talk to the Founders →",
    founder: true,
  },
];

export default function PricingPage() {
  return (
    <main>
      <SiteNav active="pricing" />

      <section className="inner-hero pricing-hero section-grid" id="top">
        <div className="section-shell inner-hero__shell pricing-hero__shell">
          <span className="eyebrow"><i className="signal-dot" /> Early-access pricing</span>
          <h1><ScrambleText text="Start small. Scale the agent layer with your product." /></h1>
          <p>Choose the operating level that fits today. Every plan keeps the human website intact while adding structured content and approved actions for agents.</p>
          <div className="pricing-note"><span>PRIVATE BETA</span><p>Plans and limits are directional while Hive is in early access.</p></div>
        </div>
      </section>

      <section className="pricing-section section-grid" aria-labelledby="plans-title">
        <div className="section-shell">
          <div className="section-heading pricing-heading reveal">
            <span className="section-number">01 / PLANS</span>
            <h2 id="plans-title"><ScrambleText text="An entry point for every stage." /></h2>
          </div>
          <div className="pricing-grid reveal">
            {plans.map((plan) => (
              <article className={plan.featured ? "pricing-card pricing-card--featured" : "pricing-card"} key={plan.name}>
                <div className="pricing-card__head">
                  <span>{plan.audience}</span>
                  {plan.featured && <i>Most popular</i>}
                </div>
                <h3>{plan.name}</h3>
                <div className="pricing-card__price"><strong>{plan.price}</strong><small>{plan.cadence}</small></div>
                <p>{plan.description}</p>
                <ul>
                  {plan.features.map((feature) => <li key={feature}><i aria-hidden="true">✓</i>{feature}</li>)}
                </ul>
                {plan.founder ? (
                  <FounderConversation className="outline-button pricing-card__action" label={plan.action} initialTopic="Partnership" />
                ) : (
                  <a className={plan.featured ? "button pricing-card__action" : "outline-button pricing-card__action"} href={plan.href}>{plan.action}</a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-example section-grid" aria-labelledby="example-title">
        <div className="section-shell pricing-example__shell reveal">
          <div>
            <span className="section-number">02 / EXAMPLE PRODUCT</span>
            <h2 id="example-title"><ScrambleText text="Built for products where context and action both matter." /></h2>
          </div>
          <article className="case-example">
            <div className="case-example__head"><span>YOURCASE.TECH</span><i>ILLUSTRATIVE USE CASE</i></div>
            <p>A product that combines specialized information with consequential workflows is exactly where an explicit agent layer becomes valuable: give agents the context they need, expose only approved actions, and keep both aligned with the live product.</p>
            <a href="https://yourcase.tech" target="_blank" rel="noreferrer">Visit YourCase.tech ↗</a>
          </article>
        </div>
      </section>

      <section className="pricing-cta section-grid" aria-labelledby="pricing-cta-title">
        <div className="section-shell pricing-cta__shell reveal">
          <span className="eyebrow">Not sure where to start?</span>
          <h2 id="pricing-cta-title"><ScrambleText text="Bring the website. We'll map the path." /></h2>
          <div><a className="button" href="/developers#developer-waitlist">Join the Waitlist →</a><FounderConversation className="outline-button" /></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
