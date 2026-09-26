import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { docPages, DocsPage } from "../docs-content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return docPages.filter(page => page.slug).map(page => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = docPages.find(page => page.slug === slug);
  return page ? { title: `${page.title} | HIVE CLI Docs`, description: page.description } : {};
}

export default async function DocsSectionPage({ params }: Params) {
  const { slug } = await params;
  if (slug !== "configuration" && slug !== "commands") notFound();
  return <DocsPage slug={slug} />;
}
