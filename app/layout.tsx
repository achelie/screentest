import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteAnalytics } from "@/components/site/site-analytics";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { siteConfig } from "@/lib/site";

const siteUrl = siteConfig.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ScreenTestHub: Free Online Screen Tests",
    template: "%s | ScreenTestHub",
  },
  description:
    "Test your monitor or phone for dead pixels, backlight bleed, HDR, screen tearing, color calibration, banding, color shifts, and motion blur in your browser.",
  applicationName: "ScreenTestHub",
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "ScreenTestHub",
    title: "ScreenTestHub: Test your screen. Trust what you see.",
    description:
      "Ten focused browser tests for dead pixels, backlight bleed, HDR, screen tearing, color calibration, gradients, uniformity, and motion.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1536,
        height: 1024,
        alt: "ScreenTestHub display test pattern",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ScreenTestHub: Free Online Screen Tests",
    description: "Find common screen problems with focused browser tests.",
    images: ["/opengraph-image.png"],
  },
  robots: { index: true, follow: true },
  verification: siteConfig.analytics.googleSiteVerification
    ? { google: siteConfig.analytics.googleSiteVerification }
    : undefined,
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ece7dc" },
    { media: "(prefers-color-scheme: dark)", color: "#151816" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          data-key="BIpugYY//fqlVBKk5l1Erg"
          src="https://analytics.ahrefs.com/analytics.js"
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main className="site-main" id="main-content">
          {children}
        </main>
        <SiteFooter />
        <SiteAnalytics />
      </body>
    </html>
  );
}
