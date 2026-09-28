import type { Metadata } from "next";
import { DocsPage } from "./docs-content";

export const metadata: Metadata = {
  title: "Get started | HIVE CLI Docs",
  description: "Scan a Next.js app and generate a local MCP server with the HIVE CLI.",
  alternates: { canonical: "/docs" },
};

export default function GetStartedPage() {
  return <DocsPage slug="" />;
}
