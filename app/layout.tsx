import type { Metadata } from "next";
import { Bebas_Neue, Exo_2, Sora, Space_Mono } from "next/font/google";

import "./globals.css";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LiveAtmosphere } from "@/components/layout/live-atmosphere";
import { getSiteSettings } from "@/lib/data/public";

const heading = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400"
});

const body = Exo_2({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"]
});

const mono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Dakait MC | Outlaw Minecraft Server",
  description:
    "Dakait MC is a cinematic outlaw-style Minecraft survival server with premium ranks, tags, and a brutal economy.",
  openGraph: {
    title: "Dakait MC",
    description:
      "Outlaw-styled Minecraft survival with ranks, tags, and high-stakes progression.",
    images: ["/opengraph-image"]
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body
        className={`${heading.variable} ${display.variable} ${body.variable} ${mono.variable} bg-coal font-body text-white antialiased`}
      >
        <div className="battlefield-surface relative min-h-screen overflow-x-clip">
          <LiveAtmosphere />
          <div className="relative z-10">
            <SiteHeader settings={settings} />
            <main>{children}</main>
            <SiteFooter settings={settings} />
          </div>
        </div>
      </body>
    </html>
  );
}
