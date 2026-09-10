import type { Metadata } from "next";
import "@fontsource/chakra-petch/latin-500.css";
import "./globals.css";

const GOOGLE_ANALYTICS_ID = "G-YD34N1NRVL";

export const metadata: Metadata = {
  metadataBase: new URL("https://brief-website.pavanom.chatgpt.site"),
  title: "Hive — Infrastructure for the Agentic Web",
  description:
    "Hive adds a structured layer of agent content and actions to existing websites—without rebuilding the human experience.",
  openGraph: {
    title: "Hive — Make the Web Work for Agents",
    description:
      "Turn an existing website into an interface AI agents can understand and operate.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1672,
        height: 941,
        alt: "Hive transforms the human web into structured interfaces for AI agents.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hive — Make the Web Work for Agents",
    description:
      "Turn an existing website into an interface AI agents can understand and operate.",
    images: ["/og.png"],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: [{ url: "/hive-logo.png", type: "image/png" }],
    shortcut: "/hive-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALYTICS_ID}');
            `,
          }}
        />
      </body>
    </html>
  );
}
