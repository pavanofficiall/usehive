"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { copyText } from "@/components/copy-text";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ShinyText from "@/components/ShinyText";
import { Waitlist1 } from "@/components/waitlist1";

const command = "npx @usehive/cli scan --install";
const agentPrompt = `Work in the root of this project. First confirm that it is a TypeScript Next.js App Router app and that Node.js is at least 22.12.0. Run ${command}. Review the detected capabilities with me: explain what each selected tool can do, and ask before approving any write or destructive capability. After generation, use .hive/mcp/.env.example to configure .hive/mcp/.env with the application's local URL and only credentials I provide. Start the app normally, then run npm run hive:mcp (or npx @usehive/cli dev if the script was not added). Run npx @usehive/cli doctor and report how to connect a local MCP client to http://127.0.0.1:3333/mcp. Never print or commit secret values.`;

export function CliCopy({ ready }: { ready: boolean }) {
  const [copied, setCopied] = useState<"command" | "agent" | null>(null);
  const [error, setError] = useState(false);
  const [betaOpen, setBetaOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [betaStatus, setBetaStatus] = useState<"idle" | "saving" | "joined">("idle");
  const [betaError, setBetaError] = useState("");

  async function copy(value: string, kind: "command" | "agent") {
    try {
      if (!await copyText(value)) throw new Error("Clipboard unavailable");
      setCopied(kind);
      setError(false);
      if (kind === "command") setBetaOpen(true);
      window.setTimeout(() => setCopied(current => current === kind ? null : current), 2200);
    } catch {
      setError(true);
    }
  }

  async function joinBeta(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBetaStatus("saving");
    setBetaError("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error || "Could not join right now. Please try again.");
      }
      setBetaStatus("joined");
    } catch (error) {
      setBetaStatus("idle");
      setBetaError(error instanceof Error ? error.message : "Could not join right now.");
    }
  }

  return (
    <div className={`cli-install ${ready ? "cli-ready" : ""}`}>
      <div className="cli-actions">
        <div className="cli-copy-row">
          <span aria-hidden="true">$</span>
          <code><ShinyText text={command} color="#d7eaf7" shineColor="#ffffff" speed={3.2} delay={1.6} spread={105} /></code>
          <button className="laser-copy" type="button" onClick={() => copy(command, "command")} aria-label="Copy HIVE CLI command">
            {copied === "command" ? <Check size={17} /> : <Copy size={17} />}
            <span>{copied === "command" ? "Copied" : "Copy"}</span>
          </button>
        </div>
        <button className="agent-copy-button" type="button" onClick={() => copy(agentPrompt, "agent")}>
          {copied === "agent" ? <Check size={17} /> : <Copy size={17} />}
          <span>{copied === "agent" ? "Copied for agent" : "Copy for agent"}</span>
        </button>
      </div>
      <a className="cli-docs-link" href="/docs">Read the CLI docs <ArrowUpRight size={14} /></a>
      <span className="sr-only" role="status">{error ? "Clipboard unavailable. Select and copy the text instead." : copied === "agent" ? "Agent prompt copied" : copied === "command" ? "CLI command copied" : ""}</span>
      <Dialog open={betaOpen} onOpenChange={setBetaOpen}>
        <DialogContent className="beta-dialog waitlist-dialog">
          <Waitlist1 email={email} onEmailChange={setEmail} onSubmit={joinBeta} status={betaStatus} error={betaError} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
