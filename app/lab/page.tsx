import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { ArrowRight } from "lucide-react";
import { CopyCommand, FooterField, HeroField } from "./lab-client";
import styles from "./lab.module.css";

const geist = localFont({ src: "../../public/fonts/47c091c982e8e934.woff2", weight: "300 800", variable: "--font-geist", display: "swap" });

export const metadata: Metadata = {
  title: "HIVE | Lab",
  description: "Experimental HIVE homepage: an interactive honeycomb hero and footer.",
  robots: { index: false, follow: false },
};

const explore = [["Home", "/"], ["Docs", "/docs"], ["Manifesto", "/manifesto"], ["Blog", "/blog"], ["Audit", "/audit"]];
const connect = [["LinkedIn", "https://www.linkedin.com/company/usehive"], ["X", "https://x.com/usehiveai"]];

export default function LabPage() {
  return (
    <div className={`${styles.page} ${geist.variable}`}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="HIVE home">
          <Image src="/hivelogo.svg" alt="" width={26} height={28} className={styles.logo} />
          HIVE
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/docs">Docs</Link>
          <Link href="/manifesto">Manifesto</Link>
          <Link href="/blog">Blog</Link>
        </nav>
        <Link href="/docs" className={styles.headerCta}>Get started</Link>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="lab-title">
          <HeroField />
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}><span aria-hidden="true" /> Human web → agentic</p>
            <h1 id="lab-title">Build your MCP layer.<br /><em>Keep it in sync.</em></h1>
            <p className={styles.lede}>HIVE helps developers create a production-ready MCP server or layer through a CLI, so AI clients can work with the product.</p>
            <CopyCommand />
          </div>
          <p className={styles.hint} aria-hidden="true">Move through the hive · click to send a pulse</p>
        </section>

        <section className={styles.bridge} aria-label="What HIVE does">
          <p className={styles.bridgeKicker}>The idea</p>
          <h2>The web was built for humans.<br /><em>HIVE rewires it for agents.</em></h2>
          <div className={styles.bridgeGrid}>
            <article>
              <span>01 · Start</span>
              <h3>Start with the product you already have.</h3>
              <p>Scan your app, review its capabilities, and generate a local MCP server that works with your existing APIs.</p>
            </article>
            <article>
              <span>02 · Stay current</span>
              <h3>Ship changes without leaving the layer behind.</h3>
              <p>As your product changes, HIVE keeps the MCP layer in sync with what your product can actually do.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <p className={styles.footerLine}>Made for products<br /><em>that never stop changing.</em></p>
          <div className={styles.footerLinks}>
            <div>
              <span>Explore</span>
              {explore.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
            </div>
            <div>
              <span>Connect</span>
              {connect.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label} <ArrowRight size={13} aria-hidden="true" /></a>)}
            </div>
          </div>
        </div>
        <div className={styles.footerField}>
          <FooterField />
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 usehive</span>
          <span>Human web to agentic</span>
        </div>
      </footer>
    </div>
  );
}
