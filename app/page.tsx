import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.usehive.tech/#organization",
      name: "HIVE",
      url: "https://www.usehive.tech/",
      logo: "https://www.usehive.tech/hivelogo.svg",
      sameAs: ["https://x.com/usehiveai", "https://www.linkedin.com/company/usehive"],
    },
    {
      "@type": "SoftwareApplication",
      name: "HIVE CLI",
      description: "A developer CLI that scans a TypeScript Next.js App Router app and generates a local MCP server for approved capabilities.",
      url: "https://www.usehive.tech/docs",
      applicationCategory: "DeveloperApplication",
      softwareRequirements: "Node.js 22.12 or newer and a TypeScript Next.js App Router project",
      publisher: { "@id": "https://www.usehive.tech/#organization" },
      sameAs: "https://www.npmjs.com/package/@usehive/cli",
    },
  ],
};

export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <HomeClient />
  </>;
}
