import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reda Essabre — Senior Data Services Consultant",
  description:
    "Senior data services consultant designing automation, reporting, integrations, and AI-ready data systems. Paris, France · Remote-ready.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
