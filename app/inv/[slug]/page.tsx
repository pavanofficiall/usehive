import type { Metadata } from "next";
import { getInvestorProfile } from "@/lib/investor-data";
import PersonalizedPitchView from "@/components/investor/PersonalizedPitchView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const investor = getInvestorProfile(slug);

  return {
    title: `Private Pitch for ${investor.name} — Hive`,
    description: investor.subheadline,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `Hive Pitch — Prepared for ${investor.name}`,
      description: investor.headline,
      url: `/inv/${slug}`,
    },
  };
}

export default async function InvestorPitchPage({ params }: PageProps) {
  const { slug } = await params;
  const investor = getInvestorProfile(slug);

  return <PersonalizedPitchView investor={investor} />;
}
