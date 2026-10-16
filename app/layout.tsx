import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { SiteEffects } from "@/components/site-effects";

const GOOGLE_ANALYTICS_ID = "G-YD34N1NRVL";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.usehive.tech"),
  title: "HIVE | Build an MCP layer that stays in sync",
  description: "HIVE is a developer CLI for building a production-ready MCP layer and keeping it current as your product changes.",
  openGraph: {
    type: "website",
    siteName: "HIVE",
    images: [{ url: "/blue-sky.jpg", width: 1920, height: 1080, alt: "HIVE blue sky gradient" }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

// Decide whether this browser tab needs the intro before the page can paint.
// The audit page never shows it.
const introBlocker = `(function(){
  var seen=false;
  try{seen=sessionStorage.getItem('hive:intro-seen')==='true';}catch(e){}
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var path=location.pathname;
  var audit=path==='/audit'||path.indexOf('/audit/')===0;
  if(!seen&&!reduced&&!audit){
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: introCoverStyle }} />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: introBlocker }} />
      </head>
      <body className="antialiased"><div id="hive-boot-screen" aria-hidden="true"/><SiteEffects/>{children}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ANALYTICS_ID}');`}
        </Script>
      </body>
    </html>
  );
}
