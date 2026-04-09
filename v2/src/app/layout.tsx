import type { Metadata } from "next";
import {
  Barlow,
  Barlow_Semi_Condensed,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowSemiCondensed = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-barlow-sc",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reda Essabre — Data Engineer & Automation Expert",
  description:
    "I design automation, reporting, and data systems that remove friction — so operations run reliably at scale. Paris, France · Remote-ready.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${barlow.variable} ${barlowSemiCondensed.variable} ${ibmPlexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
