"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
export function CliCopy({ ready }: { ready: boolean }) {
  const [copied, setCopied] = useState(false), [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false), [email, setEmail] = useState("");
  const [sending, setSending] = useState(false), [joined, setJoined] = useState(false), [error, setError] = useState("");
  const command = process.env.NEXT_PUBLIC_CLI_COMMAND || "npm i hive";
  async function copy() {
    try { await navigator.clipboard.writeText(command); setCopied(true); setFailed(false); setOpen(true); setTimeout(() => setCopied(false), 2000); }
    catch { setFailed(true); }
  }
  async function join(event: React.FormEvent) {
    event.preventDefault(); setSending(true); setError("");
    try {
      const response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json() as { error?: string; joined?: boolean };
      if (!response.ok || !data.joined) throw new Error(data.error || "Could not join right now. Please try again.");
      setJoined(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not join right now. Please try again."); }
    finally { setSending(false); }
  }
  return <><div className={`cli-install ${ready ? "cli-ready" : ""}`}><div className="cli-copy-row"><span aria-hidden="true">$</span><code>{command}</code><button className="laser-copy" type="button" onClick={copy} aria-label={copied ? "Command copied" : "Copy CLI install command"}>{copied ? <Check size={18}/> : <Copy size={18}/>}<span>{copied ? "Copied" : "Copy"}</span></button></div><span className="sr-only" role="status">{copied ? "Install command copied" : failed ? "Could not access clipboard. Select and copy the command." : ""}</span></div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="beta-dialog"><span className="beta-kicker">HIVE BETA</span><DialogTitle>{joined ? "You’re on the list." : "Build with us."}</DialogTitle><DialogDescription>{joined ? "We’ll email you when HIVE goes live." : "Join the beta list and get 500k tokens when we go live."}</DialogDescription>{!joined && <form onSubmit={join} className="beta-form"><label htmlFor="beta-email">Your email</label><Input id="beta-email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)}/><button type="submit" disabled={sending}>{sending ? "Joining…" : "Join beta list"}</button>{error && <p role="alert">{error}</p>}</form>}</DialogContent></Dialog>
  </>;
}
