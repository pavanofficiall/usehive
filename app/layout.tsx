import type { Metadata } from "next";
import "./globals.css";
import { SiteEffects } from "@/components/site-effects";

export const metadata: Metadata = {
  title: "HIVE | Build an MCP layer that stays in sync",
  description: "HIVE is a developer CLI for building a production-ready MCP layer and keeping it current as your product changes.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

// Decide whether this browser tab needs the intro before the page can paint.
const introBlocker = `(function(){
  var seen=false;
  try{seen=sessionStorage.getItem('hive:intro-seen')==='true';}catch(e){}
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!seen&&!reduced){
    document.documentElement.setAttribute('data-hive-intro','pending');
  }
})()`;

// This cover is in the server-rendered HTML and does not depend on the CSS bundle.
const introCoverStyle = `html[data-hive-intro="pending"] #hive-boot-screen{position:fixed;inset:0;z-index:2147483646;display:block;background:#050a10;pointer-events:all}#hive-boot-screen{display:none}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: introCoverStyle }} />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: introBlocker }} />
      </head>
      <body className="antialiased"><div id="hive-boot-screen" aria-hidden="true"/><SiteEffects/>{children}</body>
    </html>
  );
}
