import BlurText from "@/components/reactbits/BlurText";
import CircularText from "@/components/reactbits/CircularText";
import { FooterWordmark } from "@/components/footer-wordmark";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function SiteHeader() {
  return <header className="site-header"><a href="/" className="brand" aria-label="HIVE home"><Image src="/hivelogo.svg" alt="" width={30} height={32} className="brand-mark"/><span className="brand-name">HIVE<sup>beta</sup></span></a><div className="header-tools"><nav aria-label="Main navigation"><a href="/manifesto">Manifesto</a><a href="/blog">Blog <ArrowRight size={16}/></a></nav></div></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-main"><a className="footer-logo" href="/" aria-label="HIVE home"><CircularText text="HIVE • HUMAN WEB TO AGENTIC • " spinDuration={30} onHover="slowDown" className="footer-circle"/><Image src="/hivelogo.svg" alt="HIVE" width={58} height={62}/></a><div><span><BlurText text="EXPLORE" delay={35} stepDuration={0.2} className="footer-blur"/></span><a href="/"><BlurText text="Home" delay={35} stepDuration={0.2} className="footer-blur"/></a><a href="/manifesto"><BlurText text="Manifesto" delay={35} stepDuration={0.2} className="footer-blur"/></a><a href="/blog"><BlurText text="Blog" delay={35} stepDuration={0.2} className="footer-blur"/></a></div><div><span><BlurText text="CONNECT" delay={35} stepDuration={0.2} className="footer-blur"/></span><a href="https://www.linkedin.com/company/usehive" target="_blank" rel="noopener noreferrer" className="social-label"><BlurText text="LinkedIn" delay={35} stepDuration={0.2} className="footer-blur"/></a><a href="https://x.com/usehiveai" target="_blank" rel="noopener noreferrer" className="social-label"><BlurText text="X" delay={35} stepDuration={0.2} className="footer-blur"/></a><span className="social-label"><BlurText text="Discord" delay={35} stepDuration={0.2} className="footer-blur"/></span></div></div><div className="footer-bottom"><span><BlurText text="© 2026 usehive" delay={35} stepDuration={0.2} className="footer-blur"/></span><span><BlurText text="Made for products that never stop changing." delay={35} stepDuration={0.2} className="footer-blur"/></span></div><FooterWordmark/></footer>;
}
