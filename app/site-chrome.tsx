"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FounderConversation } from "./hive-interactions";
import { HiveMark } from "./hive-brand";

const navItems = [
  { label: "How It Works", href: "/#how-it-works", key: "home" },
  { label: "Developers", href: "/developers", key: "developers" },
  { label: "Docs", href: "/docs", key: "docs" },
  { label: "Pricing", href: "/pricing", key: "pricing" },
  { label: "Investors", href: "/investors", key: "investors" },
] as const;

export function SiteNav({ active = "home" }: { active?: "home" | "developers" | "docs" | "pricing" | "investors" }) {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setCompact(window.scrollY > 34));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <nav className={compact ? "site-nav site-nav--compact" : "site-nav"} aria-label="Primary navigation">
      <div className="nav-shell">
        <Link className="brand" href="/#top" aria-label="Hive home">
          <HiveMark compact />
          <span>Hive</span>
        </Link>
        <div className="nav-links" aria-label="Site pages">
          {navItems.map((item) => (
            <Link
              className={active === item.key && item.key !== "home" ? "nav-link--active" : undefined}
              href={item.href}
              key={`${item.label}-${item.href}`}
              aria-current={active === item.key && item.key !== "home" ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <FounderConversation className="nav-text-action" label="Talk to Founders" />
          <a className="button button--small nav-waitlist" href="/developers#developer-waitlist">
            <span className="nav-waitlist__full">Join Waitlist</span>
            <span className="nav-waitlist__short">Join</span>
          </a>
          <div className="nav-mobile-menu">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button className="nav-menu-trigger" type="button" aria-label="Open navigation">
                  <Menu aria-hidden="true" />
                </button>
              </SheetTrigger>
              <SheetContent className="mobile-nav-sheet" side="right">
                <SheetHeader className="mobile-nav-head">
                  <span className="mobile-nav-brand"><HiveMark compact /><b>Hive</b></span>
                  <SheetTitle>Explore Hive</SheetTitle>
                  <SheetDescription>Infrastructure for the Agentic Web.</SheetDescription>
                </SheetHeader>
                <div className="mobile-nav-links">
                  {navItems.map((item, index) => (
                    <Link
                      className={active === item.key && item.key !== "home" ? "mobile-nav-link mobile-nav-link--active" : "mobile-nav-link"}
                      href={item.href}
                      key={`mobile-${item.label}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <i>{String(index + 1).padStart(2, "0")}</i>
                      <span>{item.label}</span>
                      <b aria-hidden="true">→</b>
                    </Link>
                  ))}
                </div>
                <div className="mobile-nav-footer">
                  <FounderConversation className="button" label="Talk to Founders →" />
                  <a href="mailto:hello@usehive.tech" onClick={() => setMenuOpen(false)}>hello@usehive.tech</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function ProtocolStatement() {
  const root = useRef<HTMLDivElement>(null);
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const element = root.current;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const travel = Math.max(1, rect.height - window.innerHeight * 0.42);
        const progress = Math.max(0, Math.min(0.999, (window.innerHeight * 0.58 - rect.top) / travel));
        setActiveLine(Math.min(2, Math.floor(progress * 3)));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const lines = ["The protocols are arriving.", "The existing web isn't ready.", "Hive bridges the gap."];

  return (
    <div className="protocol-statement" ref={root} aria-label={lines.join(" ")}>
      <div className="protocol-statement__sticky" aria-hidden="true">
        {lines.map((line, index) => (
          <p
            className={index === activeLine ? "protocol-statement__line protocol-statement__line--active" : index < activeLine ? "protocol-statement__line protocol-statement__line--passed" : "protocol-statement__line"}
            key={line}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
