"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const frameworks = ["Next.js", "React", "Shopify", "WordPress", "Other"];

const founderTopics = [
  "Investing in Hive",
  "Technical thesis",
  "Partnership",
  "Design partnership",
  "Agent infrastructure",
  "General conversation",
  "Other",
];

const investmentRanges = [
  "Under $100K",
  "$100K–$500K",
  "$500K–$2M",
  "$2M+",
  "Prefer not to say",
];

async function postJson(path: string, payload: Record<string, string>) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) {
    throw new Error(result.error || "Something went wrong. Please try again.");
  }
}

function validHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [framework, setFramework] = useState("");
  const [agentGoal, setAgentGoal] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "joined" | "details-saving" | "complete">("idle");
  const [error, setError] = useState("");

  async function join(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setError("");
    setStatus("saving");
    try {
      await postJson("/api/waitlist", { email });
      setStatus("joined");
    } catch (caught) {
      setStatus("idle");
      setError(caught instanceof Error ? caught.message : "Please try again.");
    }
  }

  async function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setError("");
    setStatus("details-saving");
    try {
      await postJson("/api/waitlist", { email, websiteUrl, framework, agentGoal });
      setStatus("complete");
    } catch (caught) {
      setStatus("joined");
      setError(caught instanceof Error ? caught.message : "Please try again.");
    }
  }

  return (
    <div className="waitlist-card" id="developer-waitlist">
      {status === "idle" || status === "saving" ? (
        <>
          <form className="waitlist-inline" onSubmit={join}>
            <label className="sr-only" htmlFor="waitlist-email">Your email</label>
            <Input
              id="waitlist-email"
              className="hive-form-control"
              type="email"
              autoComplete="email"
              placeholder="your@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button className="button waitlist-submit" type="submit" disabled={status === "saving"}>
              {status === "saving" ? "Joining…" : "Join the Waitlist →"}
            </button>
          </form>
          <p className="form-note">Early access updates only. No noise.</p>
        </>
      ) : (
        <div className="waitlist-success" aria-live="polite">
          <span className="success-icon">✓</span>
          <div>
            <strong>You&apos;re on the list.</strong>
            <p>We&apos;ll reach out when early access opens.</p>
          </div>
        </div>
      )}

      {(status === "joined" || status === "details-saving") && (
        <form className="waitlist-details" onSubmit={saveDetails}>
          <div className="optional-head">
            <strong>Want to help us build Hive?</strong>
            <span>Optional · your email is already saved</span>
          </div>
          <div className="optional-grid">
            <label>
              <span>Website URL</span>
              <Input
                className="hive-form-control"
                type="url"
                inputMode="url"
                placeholder="https://yourwebsite.com"
                value={websiteUrl}
                onChange={(event) => setWebsiteUrl(event.target.value)}
              />
            </label>
            <label>
              <span>Framework</span>
              <select
                className="hive-select"
                value={framework}
                onChange={(event) => setFramework(event.target.value)}
              >
                <option value="">Select framework</option>
                {frameworks.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <label>
            <span>What should an agent be able to do on your website?</span>
            <Textarea
              className="hive-form-control hive-textarea"
              placeholder="Search documentation, book a demo, place an order…"
              value={agentGoal}
              onChange={(event) => setAgentGoal(event.target.value)}
            />
          </label>
          <button className="outline-button" type="submit" disabled={status === "details-saving"}>
            {status === "details-saving" ? "Saving…" : "Share optional details →"}
          </button>
        </form>
      )}

      {status === "complete" && (
        <p className="details-complete" aria-live="polite">Thanks — this helps us shape early access.</p>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}

const humanView = ["Navigation", "DOM", "Buttons", "Forms", "Scripts", "Images", "UI"];
const agentView = ["Company", "Products", "Pricing", "Documentation", "FAQs", "Capabilities"];
const readinessPreview = [
  { label: "Content", width: "72%", note: "structured preview" },
  { label: "Actions", width: "42%", note: "potential actions" },
  { label: "Structure", width: "64%", note: "mapped example" },
  { label: "Discoverability", width: "48%", note: "endpoint preview" },
];

export function AgentPreview() {
  const [url, setUrl] = useState("");
  const [scannedUrl, setScannedUrl] = useState("");
  const [phase, setPhase] = useState<"idle" | "scanning" | "complete">("idle");
  const [activeView, setActiveView] = useState<"human" | "content" | "actions" | "readiness">("content");
  const [error, setError] = useState("");

  const hostname = useMemo(() => {
    if (!scannedUrl) return "yourwebsite.com";
    try {
      return new URL(scannedUrl).hostname;
    } catch {
      return "yourwebsite.com";
    }
  }, [scannedUrl]);

  function scan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validHttpUrl(url)) {
      setError("Enter a complete URL, including https://.");
      return;
    }

    setError("");
    setPhase("scanning");
    window.setTimeout(() => {
      setScannedUrl(url);
      setActiveView("content");
      setPhase("complete");
    }, 850);
  }

  return (
    <div className="agent-preview reveal">
      <form className="scan-form" onSubmit={scan}>
        <div>
          <label htmlFor="scan-url">Website URL</label>
          <Input
            id="scan-url"
            className="hive-form-control"
            type="url"
            inputMode="url"
            placeholder="https://yourwebsite.com"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            required
          />
        </div>
        <button className="button" type="submit" disabled={phase === "scanning"}>
          {phase === "scanning" ? "Scanning preview…" : "Scan Website →"}
        </button>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}

      {phase === "idle" && (
        <div className="scan-idle" aria-hidden="true">
          <span /><span /><span /><span />
          <strong>Enter a website to reveal its example agent interface.</strong>
        </div>
      )}

      {phase === "scanning" && (
        <div className="scan-progress" aria-live="polite">
          <div className="scan-beam"><i /></div>
          <span>Previewing content, structure and possible capabilities…</span>
        </div>
      )}

      {phase === "complete" && (
        <div className="scan-result" aria-live="polite">
          <div className="preview-disclaimer">
            <span>EXAMPLE AGENT VIEW</span>
            <p>Illustrative preview for {hostname}. This is not a measured readiness score.</p>
          </div>
          <div className="preview-workbench">
            <div className="preview-tabs" role="tablist" aria-label="Example website views">
              {[
                ["human", "Human website", "Visual layer"],
                ["content", "Agent content", "Structured knowledge"],
                ["actions", "Agent actions", "Callable capabilities"],
                ["readiness", "Readiness", "Illustrative map"],
              ].map(([key, label, note], index) => (
                <button
                  className={activeView === key ? "preview-tab preview-tab--active" : "preview-tab"}
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={activeView === key}
                  onClick={() => setActiveView(key as typeof activeView)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{label}</strong>
                  <small>{note}</small>
                </button>
              ))}
            </div>

            <div className="preview-canvas" role="tabpanel">
              <div className="preview-canvas-head">
                <span>{activeView === "human" ? "https://" : "hive://"}{hostname}</span>
                <i>{activeView === "readiness" ? "PREVIEW · NOT MEASURED" : "EXAMPLE OUTPUT"}</i>
              </div>

              {activeView === "human" && (
                <article className="preview-view preview-view--human">
                  <div className="preview-view-head"><span>HUMAN WEBSITE</span><i>VISUAL INTERFACE</i></div>
                  <strong>{hostname}</strong>
                  <div className="preview-chip-grid">
                    {humanView.map((item) => <span key={item}>{item}</span>)}
                  </div>
                  <div className="preview-page-skeleton" aria-hidden="true"><i /><i /><i /></div>
                </article>
              )}

              {activeView === "content" && (
                <article className="preview-view preview-view--agent">
                  <div className="preview-view-head"><span>AGENT CONTENT</span><i>STRUCTURED PREVIEW</i></div>
                  <strong>hive://{hostname}/content</strong>
                  <div className="preview-agent-rows">
                    {agentView.map((item, index) => (
                      <span key={item}><i>{String(index + 1).padStart(2, "0")}</i>{item}<b>→</b></span>
                    ))}
                  </div>
                </article>
              )}

              {activeView === "actions" && (
                <article className="preview-view preview-view--actions">
                  <div className="preview-view-head"><span>AGENT ACTIONS</span><i>CALLABLE PREVIEW</i></div>
                  <strong>Available capabilities</strong>
                  <div className="preview-action-rows">
                    {[
                      ["search_products", "GET", "AVAILABLE"],
                      ["submit_form", "POST", "POTENTIAL"],
                      ["book_appointment", "POST", "POTENTIAL"],
                      ["place_order", "POST", "REQUIRES SETUP"],
                    ].map(([action, method, status]) => (
                      <code key={action}><i>{method}</i><span>{action}()</span><b>{status}</b></code>
                    ))}
                  </div>
                </article>
              )}

              {activeView === "readiness" && (
                <div className="readiness-preview">
                  <div className="readiness-title">
                    <span>AGENT READINESS</span>
                    <i>ILLUSTRATIVE · NOT A SCORE</i>
                  </div>
                  <p className="readiness-note">A sample map of the surfaces Hive would inspect—not a live audit of {hostname}.</p>
                  <div className="readiness-grid">
                    {readinessPreview.map((item) => (
                      <div className="readiness-row" key={item.label}>
                        <div><span>{item.label}</span><small>{item.note}</small></div>
                        <b><i style={{ width: item.width }} /></b>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <a className="button scan-cta" href="#developer-waitlist">Join the waitlist to agentize your website →</a>
        </div>
      )}
    </div>
  );
}

const developerModuleContent = {
  content: {
    eyebrow: "WHAT AGENTS KNOW",
    title: "Agent Content",
    copy: "Turn the information already on your site into a clean, discoverable knowledge layer.",
    rows: ["Products", "Pricing", "Documentation", "FAQs", "Policies"],
  },
  actions: {
    eyebrow: "WHAT AGENTS CAN DO",
    title: "Agent Actions",
    copy: "Expose approved capabilities through structured interfaces instead of fragile simulated clicks.",
    rows: ["search()", "submit_form()", "book()", "add_to_cart()", "place_order()"],
  },
  sync: {
    eyebrow: "HOW IT STAYS CURRENT",
    title: "Continuous Sync",
    copy: "Detect meaningful website changes and keep the human and agent-facing layers aligned.",
    rows: ["Content changed", "Capability mapped", "Interface updated", "Agent layer current"],
  },
};

export function DeveloperModules() {
  const [activeModule, setActiveModule] = useState<keyof typeof developerModuleContent>("content");
  const activeContent = developerModuleContent[activeModule];

  return (
    <div className="developer-modules reveal">
      <div className="module-selector" role="tablist" aria-label="Hive developer modules">
        {(Object.keys(developerModuleContent) as Array<keyof typeof developerModuleContent>).map((key, index) => {
          const item = developerModuleContent[key];
          return (
            <button
              className={activeModule === key ? "module-tab module-tab--active" : "module-tab"}
              key={key}
              type="button"
              role="tab"
              aria-selected={activeModule === key}
              onClick={() => setActiveModule(key)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><strong>{item.title}</strong><small>{item.eyebrow}</small></div>
              <i>↗</i>
            </button>
          );
        })}
      </div>

      <article className={`module-canvas module-canvas--${activeModule}`} role="tabpanel">
        <div className="module-copy">
          <span>{activeContent.eyebrow}</span>
          <h3>{activeContent.title}</h3>
          <p>{activeContent.copy}</p>
        </div>
        <div className="module-diagram" aria-label={`${activeContent.title} example`}>
          <div className="module-source">
            <small>SOURCE</small>
            <strong>yourcompany.com</strong>
            <i>LIVE WEBSITE</i>
          </div>
          <div className="module-transfer" aria-hidden="true"><i /><b>H</b><i /></div>
          <div className="module-output">
            <small>{activeModule === "sync" ? "CHANGE STREAM" : "HIVE INTERFACE"}</small>
            {activeContent.rows.map((row, index) => (
              <code key={row}><i>{String(index + 1).padStart(2, "0")}</i><span>{row}</span><b>{activeModule === "sync" ? (index === activeContent.rows.length - 1 ? "CURRENT" : "✓") : "READY"}</b></code>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

type FounderStep = "name" | "company" | "topic" | "range" | "email" | "schedule" | "complete";

export function FounderConversation({
  label = "Talk to the Founders →",
  className = "button",
  initialTopic = "",
}: {
  label?: string;
  className?: string;
  initialTopic?: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<FounderStep>("name");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState(initialTopic);
  const [investmentRange, setInvestmentRange] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const DEFAULT_CALENDLY_URL = "https://calendly.com/use-hive/15-min";
  const calendlyUrl = (process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() || DEFAULT_CALENDLY_URL);

  const calendlySrc = useMemo(() => {
    if (!calendlyUrl.startsWith("https://calendly.com/")) return "";
    const url = new URL(calendlyUrl);
    url.searchParams.set("hide_landing_page_details", "1");
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("background_color", "090d0b");
    url.searchParams.set("text_color", "e9f0eb");
    url.searchParams.set("primary_color", "b8f56a");
    if (name.trim()) url.searchParams.set("name", name.trim());
    if (email.trim()) url.searchParams.set("email", email.trim());
    return url.toString();
  }, [calendlyUrl, email, name]);

  const flow = topic === "Investing in Hive"
    ? ["name", "company", "topic", "range", "email", "schedule"]
    : ["name", "company", "topic", "email", "schedule"];
  const progress = step === "complete" ? flow.length : Math.max(0, flow.indexOf(step));

  function next() {
    setError("");
    if (step === "name") {
      if (!name.trim()) return setError("Enter your name to continue.");
      return setStep("company");
    }
    if (step === "company") {
      if (!company.trim()) return setError("Enter your firm or company.");
      return setStep("topic");
    }
    if (step === "topic") {
      if (!topic) return setError("Choose what you'd like to discuss.");
      return setStep(topic === "Investing in Hive" ? "range" : "email");
    }
    if (step === "range") {
      if (!investmentRange) return setError("Select a range to continue.");
      return setStep("email");
    }
    if (step === "email") {
      const emailInput = document.getElementById("founder-email") as HTMLInputElement | null;
      if (!emailInput?.checkValidity()) {
        emailInput?.reportValidity();
        return;
      }
      return setStep("schedule");
    }
  }

  function back() {
    setError("");
    if (step === "company") setStep("name");
    if (step === "topic") setStep("company");
    if (step === "range") setStep("topic");
    if (step === "email") setStep(topic === "Investing in Hive" ? "range" : "topic");
    if (step === "schedule") setStep("email");
  }

  const saveScheduledConversation = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await postJson("/api/founder-conversations", {
        name,
        company,
        topic,
        investmentRange,
        email,
        preferredTime: "Scheduled via Calendly",
      });
      setStep("complete");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Please try again.");
    } finally {
      setSaving(false);
    }
  }, [company, email, investmentRange, name, saving, topic]);

  useEffect(() => {
    if (!open || step !== "schedule" || !calendlySrc) return;

    const onCalendlyMessage = (event: MessageEvent) => {
      if (event.origin !== "https://calendly.com") return;
      const payload = event.data as { event?: string } | null;
      if (payload?.event === "calendly.event_scheduled") {
        void saveScheduledConversation();
      }
    };

    window.addEventListener("message", onCalendlyMessage);
    return () => window.removeEventListener("message", onCalendlyMessage);
  }, [calendlySrc, open, saveScheduledConversation, step]);

  const titles: Record<Exclude<FounderStep, "complete">, string> = {
    name: "What's your name?",
    company: "Where do you work?",
    topic: "What would you like to talk about?",
    range: "What's your typical investment range?",
    email: "What's the best email to reach you?",
    schedule: "Let's find a time.",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className={className} type="button">{label}</button>
      </DialogTrigger>
      <DialogContent
        className={step === "schedule" ? "hive-dialog founder-dialog founder-dialog--calendar" : "hive-dialog founder-dialog"}
        showCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="dialog-progress" aria-hidden="true">
          <span style={{ width: `${Math.max(8, (progress / flow.length) * 100)}%` }} />
        </div>

        {step === "complete" ? (
          <div className="dialog-complete" aria-live="polite">
            <span className="success-icon">✓</span>
            <DialogTitle>Looking forward to the conversation.</DialogTitle>
            <DialogDescription>
              Your Calendly time is booked. The Hive founders will see you there.
            </DialogDescription>
            <button className="button" type="button" onClick={() => setOpen(false)}>Done</button>
          </div>
        ) : (
          <>
            <div className="dialog-kicker">
              <span>HIVE / FOUNDER CONVERSATION</span>
              <i>{String(progress + 1).padStart(2, "0")} / {String(flow.length).padStart(2, "0")}</i>
            </div>
            <DialogTitle className="dialog-question">{titles[step]}</DialogTitle>
            <DialogDescription className="dialog-description">
              {step === "range"
                ? "This helps us understand context. We are not currently fundraising."
                : step === "schedule"
                  ? calendlySrc
                    ? "Choose an available time in Calendly. Times are shown in your local timezone."
                    : "Live Calendly availability will appear here as soon as the public event link is connected."
                  : "One question at a time. Your answers stay with the Hive founding team."}
            </DialogDescription>

            <div className="dialog-answer">
              {step === "name" && (
                <Input className="hive-form-control dialog-input" autoFocus placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && next()} />
              )}
              {step === "company" && (
                <Input className="hive-form-control dialog-input" autoFocus placeholder="Firm / Company" value={company} onChange={(event) => setCompany(event.target.value)} onKeyDown={(event) => event.key === "Enter" && next()} />
              )}
              {step === "topic" && (
                <div className="choice-grid">
                  {founderTopics.map((item) => (
                    <button className={topic === item ? "choice-card choice-card--active" : "choice-card"} type="button" key={item} onClick={() => setTopic(item)}>
                      <span>{item}</span><i>{topic === item ? "✓" : "→"}</i>
                    </button>
                  ))}
                </div>
              )}
              {step === "range" && (
                <div className="choice-grid choice-grid--single">
                  {investmentRanges.map((item) => (
                    <button className={investmentRange === item ? "choice-card choice-card--active" : "choice-card"} type="button" key={item} onClick={() => setInvestmentRange(item)}>
                      <span>{item}</span><i>{investmentRange === item ? "✓" : "→"}</i>
                    </button>
                  ))}
                </div>
              )}
              {step === "email" && (
                <Input id="founder-email" className="hive-form-control dialog-input" type="email" autoFocus autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} onKeyDown={(event) => event.key === "Enter" && next()} required />
              )}
              {step === "schedule" && (
                calendlySrc ? (
                  <div className="calendly-card">
                    <iframe
                      className="calendly-frame"
                      title="Schedule a conversation with the Hive founders"
                      src={calendlySrc}
                    />
                    <div className="calendly-foot">
                      <span>{saving ? "Saving your booking…" : "Calendly · times shown in your timezone"}</span>
                      <a href={calendlyUrl} target="_blank" rel="noreferrer">Open in a new tab ↗</a>
                    </div>
                  </div>
                ) : (
                  <div className="calendly-card calendly-card--pending">
                    <div className="calendar-mark" aria-hidden="true"><span>H</span><i /></div>
                    <strong>Calendly is ready to connect.</strong>
                    <p>Add the Hive public event link to enable live availability and timezone-aware booking here.</p>
                    <a className="button" href={`mailto:hello@usehive.tech?subject=${encodeURIComponent("Founder conversation")}&body=${encodeURIComponent(`Hi Hive, I'd like to schedule a founder conversation.\n\nName: ${name}\nCompany: ${company}\nTopic: ${topic}`)}`}>Email the founders →</a>
                  </div>
                )
              )}
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}
            {step !== "schedule" && (
              <div className="dialog-controls">
                {step !== "name" ? (
                  <button className="back-button" type="button" onClick={back}>← Back</button>
                ) : (
                  <button className="back-button" type="button" onClick={() => setStep("schedule")}>
                    Skip to calendar 📅
                  </button>
                )}
                <button className="button" type="button" onClick={next}>Continue →</button>
              </div>
            )}
            {step === "schedule" && (
              <button className="back-button schedule-back" type="button" onClick={back}>← Back</button>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function DesignPartnerDialog({
  label = "Become a Design Partner →",
  className = "outline-button",
}: {
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    websiteUrl: "",
    company: "",
    framework: "",
    agentGoal: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    if (!element.checkValidity()) {
      element.reportValidity();
      return;
    }

    setSaving(true);
    setError("");
    try {
      await postJson("/api/design-partners", form);
      setComplete(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className={className} type="button">{label}</button>
      </DialogTrigger>
      <DialogContent className="hive-dialog partner-dialog" showCloseButton>
        {complete ? (
          <div className="dialog-complete" aria-live="polite">
            <span className="success-icon">✓</span>
            <DialogTitle>Application received.</DialogTitle>
            <DialogDescription>
              Thanks for offering Hive a real website to learn from. We&apos;ll review the fit and reach out by email.
            </DialogDescription>
            <button className="button" type="button" onClick={() => setOpen(false)}>Done</button>
          </div>
        ) : (
          <>
            <div className="dialog-kicker"><span>HIVE / DESIGN PARTNERS</span><i>EARLY ACCESS</i></div>
            <DialogTitle className="dialog-question">Build the agent-ready web with us.</DialogTitle>
            <DialogDescription className="dialog-description">
              Early design partners work directly with the Hive team while the product is being developed.
            </DialogDescription>
            <form className="partner-form" onSubmit={submit}>
              <div className="partner-grid">
                <label><span>Name</span><Input className="hive-form-control" value={form.name} onChange={(event) => update("name", event.target.value)} required /></label>
                <label><span>Work email</span><Input className="hive-form-control" type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} required /></label>
                <label><span>Website URL</span><Input className="hive-form-control" type="url" placeholder="https://" value={form.websiteUrl} onChange={(event) => update("websiteUrl", event.target.value)} required /></label>
                <label><span>Company</span><Input className="hive-form-control" value={form.company} onChange={(event) => update("company", event.target.value)} required /></label>
                <label className="partner-wide"><span>Framework</span><select className="hive-select" value={form.framework} onChange={(event) => update("framework", event.target.value)} required><option value="">Select framework</option>{frameworks.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className="partner-wide"><span>What should an agent be able to do on your website?</span><Textarea className="hive-form-control hive-textarea" value={form.agentGoal} onChange={(event) => update("agentGoal", event.target.value)} required /></label>
              </div>
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="partner-submit">
                <p>No guaranteed acceptance or fixed timeline. We&apos;re selecting sites that help test the core thesis.</p>
                <button className="button" type="submit" disabled={saving}>{saving ? "Submitting…" : "Apply for Early Access →"}</button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
