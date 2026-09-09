"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  Mail,
  Calendar,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import ScrambleText from "@/components/ScrambleText";
import { HiveMark, SiteFooter } from "@/app/hive-brand";
import { SiteNav } from "@/app/site-chrome";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { InvestorProfile } from "@/lib/investor-data";

interface Props {
  investor: InvestorProfile;
}

export default function PersonalizedPitchView({ investor }: Props) {
  const [copied, setCopied] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  const copyPageLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const DEFAULT_CALENDLY_URL = "https://calendly.com/use-hive/15-min";
  const calendlySrc = useMemo(() => {
    const raw = investor.contact.calendlyUrl || DEFAULT_CALENDLY_URL;
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    url.searchParams.set("hide_landing_page_details", "1");
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("background_color", "090d0b");
    url.searchParams.set("text_color", "e9f0eb");
    url.searchParams.set("primary_color", "b8f56a");
    if (investor.name) {
      url.searchParams.set("name", investor.name);
    }
    return url.toString();
  }, [investor.contact.calendlyUrl, investor.name]);

  return (
    <main className="investor-pitch-root">
      <SiteNav active="investors" />

      {/* Top Confidential Notice Bar */}
      <div className="confidential-bar">
        <div className="confidential-bar__content section-shell">
          <div className="confidential-bar__left">
            <span className="confidential-pulse" />
            <span className="confidential-badge">
              <Lock size={12} className="inline mr-1" />
              CONFIDENTIAL &amp; PROPRIETARY
            </span>
            <span className="confidential-code">REF: {investor.confidentialCode}</span>
          </div>
          <div className="confidential-bar__right">
            <span>Prepared exclusively for <strong>{investor.name}</strong> ({investor.firm})</span>
            <button
              type="button"
              onClick={copyPageLink}
              className="confidential-copy-btn"
              title="Copy personalized page URL"
            >
              {copied ? (
                <>
                  <CheckCircle2 size={12} className="text-acid" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Share URL</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="inner-hero inner-hero--pitch section-grid" id="top">
        <div className="section-shell inner-hero__shell">
          <div className="pitch-eyebrow-row">
            <span className="eyebrow">
              <i className="signal-dot" /> {investor.badge}
            </span>
            <span className="pitch-recipient-chip">
              Exclusively for <strong>{investor.name}</strong>
            </span>
          </div>

          <h1 className="pitch-hero-title">
            <ScrambleText text={investor.salutation} />
            <br />
            <em>
              <ScrambleText text="Welcome to Hive." delay={120} />
            </em>
          </h1>

          <p className="pitch-hero-subtitle">
            {investor.subheadline}
          </p>

          <div className="pitch-hero-actions">
            <a
              href={investor.deck.canvaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--pitch-primary"
            >
              <span>Open Pitch Deck on Canva</span>
              <ArrowUpRight size={17} />
            </a>

            <button
              type="button"
              onClick={() => setCalendlyOpen(true)}
              className="outline-button"
            >
              Schedule 15m with Pavan →
            </button>

            <a
              href={`mailto:${investor.contact.founderEmail}?subject=Re:%20Hive%20Seed%20Round%20Investment%20-%20${encodeURIComponent(investor.name)}`}
              className="pitch-action-link"
            >
              <Mail size={15} />
              <span>Email Founder Directly</span>
            </a>
          </div>

          {/* Personalized Note from Pavan */}
          <div className="pitch-letter-card">
            <div className="pitch-letter-header">
              <div className="pitch-letter-sender">
                <div className="sender-avatar">P</div>
                <div>
                  <strong>{investor.personalNote.founderName}</strong>
                  <small>{investor.personalNote.founderRole}</small>
                </div>
              </div>
              <div className="pitch-letter-tag">
                <Sparkles size={13} />
                <span>Personal Founder Note</span>
              </div>
            </div>

            <div className="pitch-letter-body">
              <p className="pitch-letter-greeting">{investor.personalNote.greeting}</p>
              {investor.personalNote.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pitch-letter-footer">
              <div className="founder-signoff">
                <span>Best regards,</span>
                <strong>{investor.personalNote.founderName}</strong>
                <small>usehive.tech · Bangalore / Remote</small>
              </div>
              <div className="pitch-letter-cta">
                <button
                  type="button"
                  onClick={() => setCalendlyOpen(true)}
                  className="button button--small"
                >
                  Discuss with Pavan →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="pitch-metrics section-grid">
        <div className="section-shell">
          <div className="pitch-metrics-grid">
            {investor.metrics.map((metric, i) => (
              <div key={i} className="pitch-metric-card">
                <span className="metric-label">{metric.label}</span>
                <strong className="metric-val">{metric.value}</strong>
                {metric.change && <small className="metric-sub">{metric.change}</small>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Pitch Deck Showcase */}
      <section className="pitch-deck-section section-grid" id="deck">
        <div className="section-shell">
          <div className="section-heading">
            <span className="section-number">01 / THE PITCH DECK</span>
            <h2>
              <ScrambleText text="Interactive Pitch Deck & Vision" />
            </h2>
            <p className="section-subtitle">
              {investor.deck.description}
            </p>
          </div>

          {/* Deck Container */}
          <div className="canva-deck-wrapper">
            <div className="canva-deck-header">
              <div className="deck-title-area">
                <span className="canva-tag">CANVA PRESENTATION</span>
                <h3>{investor.deck.title}</h3>
              </div>
              <div className="deck-actions">
                <a
                  href={investor.deck.canvaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button--small canva-open-btn"
                >
                  <span>Open in Fullscreen Canva</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Visual Deck Preview / Interactive Embed */}
            <div className="canva-preview-frame">
              <div className="canva-mockup">
                <div className="canva-mockup-topbar">
                  <div className="mockup-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="mockup-url">canva.link/5azjfpphmez0ki8</span>
                  <div className="mockup-controls">
                    <span className="mockup-badge">Confidential</span>
                    <a
                      href={investor.deck.canvaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mockup-external-link"
                      title="Open in new window"
                    >
                      <span>Launch Canva</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {investor.deck.canvaEmbedUrl ? (
                  <div className="canva-embed-container">
                    <iframe
                      loading="lazy"
                      src={investor.deck.canvaEmbedUrl}
                      allow="fullscreen; clipboard-write"
                      allowFullScreen
                      title={investor.deck.title}
                      className="canva-embed-iframe"
                    />
                  </div>
                ) : (
                  <div className="canva-slide-stage">
                    <div className="slide-background-glow" />
                    <div className="slide-content">
                      <HiveMark />
                      <span className="slide-kicker">INFRASTRUCTURE FOR THE AGENTIC WEB</span>
                      <h2 className="slide-headline">
                        Every website needs an agent interface.
                      </h2>
                      <p className="slide-copy">
                        Hive connects the installed web to autonomous AI agents with zero code rewrites.
                      </p>
                      <div className="slide-meta-strip">
                        <span>SEED ROUND</span>
                        <span>·</span>
                        <span>PREPARED FOR {investor.name.toUpperCase()}</span>
                        <span>·</span>
                        <span>2026</span>
                      </div>

                      <div className="slide-action-overlay">
                        <a
                          href={investor.deck.canvaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button button--pitch-primary slide-cta"
                        >
                          <ExternalLink size={16} />
                          <span>Launch Complete Canva Deck →</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Slide Breakdown Highlights */}
            <div className="deck-highlights-grid">
              {investor.deck.slideHighlights.map((slide) => (
                <div key={slide.number} className="deck-highlight-card">
                  <span className="slide-num">{slide.number}</span>
                  <h4>{slide.title}</h4>
                  <p>{slide.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Hive Fits Your Thesis */}
      <section className="pitch-thesis section-grid" id="thesis">
        <div className="section-shell">
          <div className="section-heading">
            <span className="section-number">02 / THESIS ALIGNMENT</span>
            <h2>
              <ScrambleText text={`Why Hive Aligns with Your Focus`} />
            </h2>
            <p className="section-subtitle">
              We mapped Hive&apos;s product moats directly against the foundational platform shifts you look for in early investments.
            </p>
          </div>

          <div className="thesis-alignment-grid">
            {investor.thesisAlignment.map((point) => (
              <div key={point.number} className="thesis-card">
                <div className="thesis-card__head">
                  <span className="thesis-num">{point.number}</span>
                  <ShieldCheck size={18} className="text-acid" />
                </div>
                <h3>{point.title}</h3>
                <p className="thesis-desc">{point.description}</p>
                <div className="thesis-synergy">
                  <Zap size={14} className="text-acid flex-shrink-0" />
                  <span><strong>The Moat:</strong> {point.synergyNote}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Round & Allocation Details */}
      <section className="pitch-round section-grid" id="round">
        <div className="section-shell">
          <div className="round-overview-card">
            <div className="round-card-left">
              <span className="eyebrow">Round Details</span>
              <h2>{investor.roundDetails.stage}</h2>
              <p>{investor.roundDetails.status}</p>

              <div className="round-specs-table">
                <div className="spec-row">
                  <span>Investment Instrument</span>
                  <strong>{investor.roundDetails.instrument}</strong>
                </div>
                <div className="spec-row">
                  <span>Allocation Reserved for {investor.name}</span>
                  <strong className="text-acid">{investor.roundDetails.allocationReserved}</strong>
                </div>
                <div className="spec-row">
                  <span>Target Seed Raise</span>
                  <strong>$250,000 – $500,000 Total</strong>
                </div>
                <div className="spec-row">
                  <span>Primary Use of Capital</span>
                  <strong>{investor.roundDetails.useOfFunds}</strong>
                </div>
              </div>
            </div>

            <div className="round-card-right">
              <div className="action-box">
                <div className="action-box-head">
                  <Calendar size={18} className="text-acid" />
                  <h4>Schedule Seed Discussion</h4>
                </div>
                <p>
                  15 minutes direct with Pavan to walk through the architecture, live demos, and capitalization plan.
                </p>
                <button
                  type="button"
                  onClick={() => setCalendlyOpen(true)}
                  className="button button--full"
                >
                  Lock in 15-Minute Slot →
                </button>
                <a
                  href={`mailto:${investor.contact.founderEmail}?subject=Hive%20Seed%20Investment%20-%20${encodeURIComponent(investor.name)}`}
                  className="outline-button button--full text-center"
                >
                  Email Pavan Directly
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Due Diligence Resources */}
      <section className="pitch-resources section-grid" id="resources">
        <div className="section-shell">
          <div className="section-heading">
            <span className="section-number">03 / DUE DILIGENCE &amp; RESOURCES</span>
            <h2>
              <ScrambleText text="Everything You Need to Evaluate Hive" />
            </h2>
            <p className="section-subtitle">
              Explore our live product runtime, developer documentation, and macroeconomic thesis.
            </p>
          </div>

          <div className="resources-grid">
            {investor.resources.map((res, idx) => (
              <Link
                key={idx}
                href={res.href}
                className="resource-card group"
              >
                <div className="resource-tag-row">
                  <span className="resource-tag">{res.tag}</span>
                  <ArrowUpRight size={16} className="resource-arrow" />
                </div>
                <h3>{res.title}</h3>
                <p>{res.description}</p>
                <span className="resource-action-link">
                  Explore {res.title} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Founder Contact Callout */}
      <section className="pitch-contact-footer section-grid">
        <div className="section-shell">
          <div className="investor-contact__shell">
            <span className="eyebrow">Direct Line</span>
            <h2>Ready to shape the Agentic Web with us?</h2>
            <p>
              We are deliberately curating this seed round with operators and leaders who add strategic leverage.
              Let&apos;s connect directly.
            </p>
            <div className="investor-actions">
              <button
                type="button"
                onClick={() => setCalendlyOpen(true)}
                className="button button--pitch-primary"
              >
                Talk to Pavan →
              </button>
              <a
                className="outline-button"
                href={investor.deck.canvaUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Canva Deck ↗
              </a>
            </div>
            <small>
              CONFIDENTIAL · PREPARED FOR {investor.name.toUpperCase()} · HIVE INFRASTRUCTURE INC.
            </small>
          </div>
        </div>
      </section>

      {/* Direct Calendly Modal (Zero Form Friction) */}
      <Dialog open={calendlyOpen} onOpenChange={setCalendlyOpen}>
        <DialogContent className="hive-dialog founder-dialog--calendar investor-calendly-dialog" showCloseButton>
          <div className="dialog-kicker">
            <span>HIVE / SEED ROUND</span>
            <i>CONFIDENTIAL · {investor.name.toUpperCase()}</i>
          </div>
          <DialogTitle className="dialog-question" style={{ marginTop: "16px", fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.1 }}>
            Lock in 15 minutes with Pavan.
          </DialogTitle>
          <DialogDescription className="dialog-description" style={{ marginTop: "6px" }}>
            Direct founder conversation. Pick a time that works best for you — times are automatically adjusted to your timezone.
          </DialogDescription>

          <div className="calendly-card" style={{ marginTop: "20px" }}>
            <iframe
              className="calendly-frame"
              title={`Schedule a conversation with Pavan - ${investor.name}`}
              src={calendlySrc}
            />
            <div className="calendly-foot">
              <span>Calendly · Times shown in your timezone</span>
              <a href={investor.contact.calendlyUrl} target="_blank" rel="noreferrer">Open in full tab ↗</a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </main>
  );
}
