import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Condensed, IBM_Plex_Mono } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const display = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const site = "https://rabiussani.me";
const description =
  "Md. Rabius Sani — AI and software engineer building agentic systems, orchestrated data pipelines, and the microservices underneath them.";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description,
  keywords: [
    "AI engineer",
    "machine learning",
    "n8n",
    "agentic AI",
    "LangGraph",
    "FastAPI",
    "microservices",
    "NLP",
    "Bangladesh",
  ],
  authors: [{ name: profile.name, url: site }],
  manifest: "/manifest.json",
  alternates: { canonical: site },
  openGraph: {
    type: "profile",
    url: site,
    title: `${profile.name} — ${profile.role}`,
    description,
    siteName: profile.name,
    images: [{ url: "/images/dp.jpg", width: 800, height: 800, alt: profile.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description,
    images: ["/images/dp.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a1e33",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  url: site,
  address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
  sameAs: [profile.social.github, profile.social.linkedin],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
