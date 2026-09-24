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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><SiteEffects/>{children}</body>
    </html>
  );
}
