export interface InvestorProfile {
  slug: string;
  name: string;
  salutation: string;
  formalTitle: string;
  firm: string;
  location?: string;
  avatarUrl?: string;
  confidentialCode: string;
  badge: string;
  headline: string;
  subheadline: string;
  personalNote: {
    greeting: string;
    paragraphs: string[];
    founderName: string;
    founderRole: string;
  };
  deck: {
    title: string;
    description: string;
    canvaUrl: string;
    canvaEmbedUrl?: string;
    slideHighlights: {
      number: string;
      title: string;
      summary: string;
    }[];
  };
  thesisAlignment: {
    number: string;
    title: string;
    description: string;
    synergyNote: string;
  }[];
  roundDetails: {
    stage: string;
    instrument: string;
    allocationReserved: string;
    useOfFunds: string;
    status: string;
  };
  metrics: {
    label: string;
    value: string;
    change?: string;
  }[];
  resources: {
    title: string;
    description: string;
    href: string;
    tag: string;
    isExternal?: boolean;
  }[];
  contact: {
    calendlyUrl: string;
    founderEmail: string;
    whatsappNumber?: string;
    calendlyTopic: string;
  };
}

export const KNOWN_INVESTORS: Record<string, InvestorProfile> = {
  sanjaym: {
    slug: "sanjaym",
    name: "Sanjay M.",
    salutation: "Hi Sanjay Sir,",
    formalTitle: "Angel Investor",
    firm: "Angel Investor",
    location: "Mumbai, India",
    confidentialCode: "HIVE-INV-SM01",
    badge: "Priority Seed Allocation",
    headline: "The web was built for humans. Hive makes it machine-executable for AI agents.",
    subheadline: "A private investment memo & pitch presentation prepared exclusively for Sanjay M.",
    personalNote: {
      greeting: "Hi Sanjay Sir,",
      paragraphs: [
        "Subject wasn't written to grab attention, but to ensure you didn't miss this opportunity. I am sending this only to our highest-conviction investors.",
        "Instead of pitching you in a generic email or pitch deck link, I wanted to personally build this dedicated surface for you. Hive isn't another AI copilot or destination app — we are building the foundational infrastructure layer that gives the existing web a synchronized, machine-facing interface.",
        "Knowing your deep thesis on disruptive tech moats, protocol transitions, and non-linear scale, Hive solves the biggest bottleneck in agentic AI: agents have no structured way to discover, understand, and safely operate the installed software of the world without breaking.",
        "Take a look at our Canva pitch deck and live product architecture below. I would love 15 minutes of your time to walk through the thesis.",
      ],
      founderName: "Pavan",
      founderRole: "Founder & CEO, Hive",
    },
    deck: {
      title: "Hive — Infrastructure for the Agentic Web (Pitch Deck)",
      description: "Comprehensive 12-slide walkthrough detailing our protocol layer, market wedge, defensibility, and early traction.",
      canvaUrl: process.env.NEXT_PUBLIC_CANVA_DECK_URL || "https://canva.link/5azjfpphmez0ki8",
      canvaEmbedUrl: "https://www.canva.com/design/DAHSvVPxTsY/7EfRLsi0x5FiwhBtM5oGtA/view?embed",
      slideHighlights: [
        {
          number: "01",
          title: "The Core Problem",
          summary: "Autonomous AI agents can't reliably operate websites designed for human eyeballs and clicks.",
        },
        {
          number: "02",
          title: "The Hive Solution",
          summary: "A headless machine interface dynamically synchronized with existing website code & APIs.",
        },
        {
          number: "03",
          title: "The Protocol Wedge",
          summary: "Compatible with WebMCP, Model Context Protocol, and agent runtimes with zero code rewrites.",
        },
        {
          number: "04",
          title: "Business Model & TAM",
          summary: "Usage-based runtime pricing + verified agent enterprise transactions across $30T+ web assets.",
        },
      ],
    },
    thesisAlignment: [
      {
        number: "01",
        title: "The Installed Web Remains",
        description: "Companies have spent 25 years and trillions building web apps. They will not throw them away or rebuild custom APIs for every emerging AI model.",
        synergyNote: "Hive bridges the gap by meeting businesses where they already are.",
      },
      {
        number: "02",
        title: "Protocol-Level Defensibility",
        description: "Instead of being a vulnerable wrapper, Hive operates as the bi-directional state synchronization engine between LLM agents and enterprise web endpoints.",
        synergyNote: "High switching costs once integrated as the company's agent gateway.",
      },
      {
        number: "03",
        title: "Exponential Market Timing",
        description: "With browser agents (OpenAI Operator, Claude Computer Use, DeepSeek) going mainstream in 2026, web readiness is transitioning from 'nice-to-have' to critical infrastructure.",
        synergyNote: "Perfect timing for early-stage capital velocity.",
      },
    ],
    roundDetails: {
      stage: "Seed Round",
      instrument: "Standard Post-Money SAFE / Convertible Note",
      allocationReserved: "$50,000 – $150,000",
      useOfFunds: "Core protocol runtime engineering, distributed crawler synchronization, and developer SDK adoption.",
      status: "Actively engaging high-conviction seed investors",
    },
    metrics: [
      { label: "Round Stage", value: "Seed Round", change: "Private Allocation" },
      { label: "Developer Waitlist", value: "120+", change: "Organic Inbound" },
      { label: "Protocol Latency", value: "<18ms", change: "Edge Architecture" },
      { label: "Integration Time", value: "1 Line", change: "Drop-in Script" },
    ],
    resources: [
      {
        title: "The Hive Thesis",
        description: "Our macro perspective on why the web's next user is an AI agent, and why infrastructure wins.",
        href: "/investors",
        tag: "Macro Thesis",
      },
      {
        title: "Live Protocol Runtime & Demo",
        description: "See how Hive scans, maps, and exposes machine-executable capabilities live on our homepage.",
        href: "/#how-it-works",
        tag: "Interactive Demo",
      },
      {
        title: "Technical Architecture & Docs",
        description: "Deep dive into schema definitions, Agent Actions, Agent Content, and WebMCP compatibility.",
        href: "/docs",
        tag: "Documentation",
      },
      {
        title: "Developer Portal & Sandbox",
        description: "Developer onboarding flow, integration examples, and SDK specifications.",
        href: "/developers",
        tag: "Developers",
      },
    ],
    contact: {
      calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/use-hive/15-min",
      founderEmail: process.env.NEXT_PUBLIC_FOUNDER_EMAIL || "pavan@usehive.tech",
      whatsappNumber: "+919000000000",
      calendlyTopic: "Investing in Hive (Angel Tranche - Sanjay M.)",
    },
  },
};

// Aliases
KNOWN_INVESTORS["sanjay-m"] = KNOWN_INVESTORS.sanjaym;
KNOWN_INVESTORS["sanhaym"] = KNOWN_INVESTORS.sanjaym;
KNOWN_INVESTORS["sanhay-m"] = KNOWN_INVESTORS.sanjaym;

/**
 * Generate a personalized profile dynamically if not in the hardcoded list.
 * Allows Pavan to send links like `/inv/naval`, `/inv/kunal`, `/investor/anupam` anytime!
 */
export function getInvestorProfile(slug: string): InvestorProfile {
  const normalized = slug.trim().toLowerCase();
  if (KNOWN_INVESTORS[normalized]) {
    return KNOWN_INVESTORS[normalized];
  }

  // Format slug into clean capitalized name (e.g. "sanjay-mehta" -> "Sanjay Mehta", "sanjaym" -> "Sanjay M.")
  let formatted = slug.trim().replace(/[-_]/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
  
  // If single word like "sanjaym" or "alexk" (length > 3 and ends with single letter initial)
  if (!formatted.includes(" ") && formatted.length > 3) {
    const base = formatted.slice(0, -1);
    const initial = formatted.slice(-1).toUpperCase();
    formatted = `${base.charAt(0).toUpperCase() + base.slice(1).toLowerCase()} ${initial}.`;
  } else {
    formatted = formatted
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const cleanName = formatted;

  return {
    slug: normalized,
    name: cleanName,
    salutation: `Hi ${cleanName},`,
    formalTitle: "Angel Investor / Tech Partner",
    firm: "Strategic Investor",
    confidentialCode: `HIVE-INV-${normalized.toUpperCase().slice(0, 4)}`,
    badge: "Confidential Angel Access",
    headline: "The web was built for humans. Hive makes it machine-executable for AI agents.",
    subheadline: `A private investment memo & pitch presentation prepared exclusively for ${cleanName}.`,
    personalNote: {
      greeting: `Hi ${cleanName},`,
      paragraphs: [
        `I prepared this dedicated page specifically for you. Rather than sending a cold deck in an inbox, we wanted to give you direct access to what we are building at Hive.`,
        `Hive provides the critical infrastructure layer that equips existing websites and web apps with a synchronized machine interface for autonomous AI agents.`,
        `We are reserving a select allocation for angel partners who understand the macro shift to the Agentic Web. Please review our Canva pitch deck and resources below.`,
      ],
      founderName: "Pavan",
      founderRole: "Founder & CEO, Hive",
    },
    deck: {
      title: "Hive — Infrastructure for the Agentic Web (Pitch Deck)",
      description: "Comprehensive walkthrough detailing our protocol layer, market wedge, defensibility, and early traction.",
      canvaUrl: process.env.NEXT_PUBLIC_CANVA_DECK_URL || "https://canva.link/5azjfpphmez0ki8",
      canvaEmbedUrl: "https://www.canva.com/design/DAHSvVPxTsY/7EfRLsi0x5FiwhBtM5oGtA/view?embed",
      slideHighlights: [
        {
          number: "01",
          title: "The Core Problem",
          summary: "Autonomous AI agents can't reliably operate websites designed for human eyeballs and clicks.",
        },
        {
          number: "02",
          title: "The Hive Solution",
          summary: "A headless machine interface dynamically synchronized with existing website code & APIs.",
        },
        {
          number: "03",
          title: "The Protocol Wedge",
          summary: "Compatible with WebMCP, Model Context Protocol, and agent runtimes with zero code rewrites.",
        },
        {
          number: "04",
          title: "Business Model & TAM",
          summary: "Usage-based runtime pricing + verified agent enterprise transactions across $30T+ web assets.",
        },
      ],
    },
    thesisAlignment: [
      {
        number: "01",
        title: "The Installed Web Remains",
        description: "Companies will not throw away their existing applications or rebuild custom APIs for every AI model. Hive meets them where they already are.",
        synergyNote: "Zero friction adoption with instant agent-readiness.",
      },
      {
        number: "02",
        title: "Protocol-Level Defensibility",
        description: "Operating at the synchronization boundary between agent protocols and web backends creates high moats and enterprise stickiness.",
        synergyNote: "Critical infrastructure, not an application wrapper.",
      },
      {
        number: "03",
        title: "2026 Agent Inflection Point",
        description: "With autonomous web agents actively making purchases and executing workflows, the machine interface is becoming mandatory.",
        synergyNote: "Exponential early mover advantage.",
      },
    ],
    roundDetails: {
      stage: "Seed Round",
      instrument: "Standard Post-Money SAFE / Convertible Note",
      allocationReserved: "Selective Allocation",
      useOfFunds: "Core protocol runtime engineering, distributed crawler synchronization, and developer SDK adoption.",
      status: "Seed round actively open",
    },
    metrics: [
      { label: "Round Stage", value: "Seed Round", change: "Private Allocation" },
      { label: "Developer Waitlist", value: "120+", change: "Organic Inbound" },
      { label: "Protocol Latency", value: "<18ms", change: "Edge Architecture" },
      { label: "Integration Time", value: "1 Line", change: "Drop-in Script" },
    ],
    resources: [
      {
        title: "The Hive Thesis",
        description: "Our macro perspective on why the web's next user is an AI agent, and why infrastructure wins.",
        href: "/investors",
        tag: "Macro Thesis",
      },
      {
        title: "Live Protocol Runtime & Demo",
        description: "See how Hive scans, maps, and exposes machine-executable capabilities live on our homepage.",
        href: "/#how-it-works",
        tag: "Interactive Demo",
      },
      {
        title: "Technical Architecture & Docs",
        description: "Deep dive into schema definitions, Agent Actions, Agent Content, and WebMCP compatibility.",
        href: "/docs",
        tag: "Documentation",
      },
      {
        title: "Developer Portal & Sandbox",
        description: "Developer onboarding flow, integration examples, and SDK specifications.",
        href: "/developers",
        tag: "Developers",
      },
    ],
    contact: {
      calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/use-hive/15-min",
      founderEmail: process.env.NEXT_PUBLIC_FOUNDER_EMAIL || "pavan@usehive.tech",
      calendlyTopic: `Investing in Hive (Angel Tranche - ${cleanName})`,
    },
  };
}
