import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import FooterWordmark from "@/components/FooterWordmark";

type SocialIconProps = { name: "github" | "instagram" | "linkedin" | "reddit" | "x" };

function SocialIcon({ name }: SocialIconProps) {
  const paths: Record<SocialIconProps["name"], ReactNode> = {
    github: <path d="M12 2.5a9.7 9.7 0 0 0-3.07 18.9c.48.09.66-.2.66-.46v-1.7c-2.7.59-3.27-1.14-3.27-1.14-.44-1.12-1.08-1.42-1.08-1.42-.88-.6.07-.59.07-.59.97.07 1.48 1 1.48 1 .87 1.48 2.27 1.05 2.83.8.08-.62.34-1.05.61-1.3-2.15-.24-4.41-1.07-4.41-4.8 0-1.06.38-1.92 1-2.6-.1-.24-.43-1.23.1-2.56 0 0 .81-.26 2.67.99a9.3 9.3 0 0 1 4.86 0c1.85-1.25 2.66-.99 2.66-.99.53 1.33.2 2.32.1 2.57.62.67 1 1.53 1 2.59 0 3.73-2.27 4.55-4.43 4.79.35.3.66.89.66 1.8v2.56c0 .26.17.55.67.46A9.7 9.7 0 0 0 12 2.5Z" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.1" /><circle cx="17.4" cy="6.7" r=".8" className="social-icon__fill" /></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10v7m0-10.2v.1M11.2 17v-7m0 3.1c0-1.7 1.1-3.1 3-3.1 2.1 0 2.8 1.4 2.8 3.5V17" /></>,
    reddit: <><circle cx="12" cy="13" r="7.2" /><path d="M7.9 12.4a1.1 1.1 0 1 0 0 .1m8.2-.1a1.1 1.1 0 1 0 0 .1M8.7 16c1.8 1.3 4.8 1.3 6.6 0M12.4 5.8l1-3.1 3.1.7" /><circle cx="18" cy="5" r="1.7" /></>,
    x: <path d="M4 3.5h4.6l3.9 5.2 4.6-5.2h2.1l-5.7 6.7L20 20.5h-4.6l-4.2-5.7-5 5.7H4l6.2-7.2L4 3.5Zm3.5 1.7 8.8 13.6h1.9L9.4 5.2H7.5Z" />,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

const socials = [
  { label: "GitHub", icon: "github" as const, href: process.env.NEXT_PUBLIC_GITHUB_URL },
  { label: "Instagram", icon: "instagram" as const, href: "https://www.instagram.com/usehive.tech/" },
  { label: "LinkedIn", icon: "linkedin" as const, href: "https://www.linkedin.com/company/usehive" },
  { label: "Reddit", icon: "reddit" as const, href: process.env.NEXT_PUBLIC_REDDIT_URL },
  { label: "X", icon: "x" as const, href: "https://x.com/usehiveai" },
];

export function HiveMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "hive-mark hive-mark--compact" : "hive-mark"} aria-hidden="true">
      <Image src="/hive-logo.png" alt="" width={54} height={54} unoptimized />
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="section-shell footer-shell">
        <div>
          <Link className="brand" href="/#top" aria-label="Hive home">
            <HiveMark compact />
            <span>Hive</span>
          </Link>
          <p>Infrastructure for the Agentic Web.</p>
        </div>
        <div className="footer-links">
          <Link href="/#how-it-works">How It Works</Link>
          <Link href="/developers">Developers</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/investors">Investors</Link>
          <a href="mailto:hello@usehive.tech">Contact</a>
        </div>
        <div className="footer-meta">
          <div className="footer-socials" aria-label="Hive social profiles">
            {socials.map((social) => social.href ? (
              <a href={social.href} key={social.label} target="_blank" rel="noreferrer" aria-label={social.label}>
                <SocialIcon name={social.icon} />
              </a>
            ) : (
              <span key={social.label} aria-label={`${social.label} link coming soon`} aria-disabled="true" title={`${social.label} link coming soon`}>
                <SocialIcon name={social.icon} />
              </span>
            ))}
          </div>
          <span>© 2026 Hive</span>
        </div>
      </div>
      <FooterWordmark />
    </footer>
  );
}
