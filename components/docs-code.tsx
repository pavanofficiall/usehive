"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyText } from "@/components/copy-text";

export function DocsCode({ children, label = "terminal" }: { children: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      if (!await copyText(children)) throw new Error("Clipboard unavailable");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="docs-code-block">
      <div className="docs-code-toolbar"><span>{label}</span><button type="button" onClick={copy} aria-label="Copy code">{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy"}</button></div>
      <pre><code>{children}</code></pre>
    </div>
  );
}
