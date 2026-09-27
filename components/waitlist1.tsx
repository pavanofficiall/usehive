"use client";

import type { FormEvent } from "react";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Waitlist1Props {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: "idle" | "saving" | "joined";
  error: string;
}

export function Waitlist1({ email, onEmailChange, onSubmit, status, error }: Waitlist1Props) {
  return (
    <section className="waitlist1">
      <div className="waitlist1-art" aria-hidden="true" />
      <div className="waitlist1-content">
        <DialogHeader className="waitlist1-header">
          <span className="waitlist1-eyebrow">HIVE CLI BETA</span>
          <DialogTitle>Join the beta list</DialogTitle>
          <DialogDescription>Get 500k tokens when v1 launches.</DialogDescription>
        </DialogHeader>
        {status === "joined" ? (
          <p className="waitlist1-success" role="status">You&apos;re on the beta list. We&apos;ll email you when v1 is ready.</p>
        ) : (
          <form className="waitlist1-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="beta-email">Your email</label>
            <input id="beta-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => onEmailChange(event.target.value)} placeholder="Your email address" />
            <button type="submit" disabled={status === "saving"}>{status === "saving" ? "Joining..." : "Join beta list"}</button>
            {error && <p className="waitlist1-error" role="alert">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
