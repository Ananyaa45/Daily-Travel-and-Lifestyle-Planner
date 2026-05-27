export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Montserrat, Playfair_Display } from "next/font/google";
import { isClerkConfigured } from "@/lib/env/clerk";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saanjh — Daily Travel & Lifestyle Planner",
  description:
    "AI-powered lifestyle and collaborative planning for urban India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const body = (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="bg-surface text-on-surface">{children}</body>
    </html>
  );

  if (!isClerkConfigured()) {
    return body;
  }

  return <ClerkProvider>{body}</ClerkProvider>;
}
