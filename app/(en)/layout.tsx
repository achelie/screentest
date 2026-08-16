import type { Metadata } from "next";
import "../globals.css";

import { SiteRootLayout } from "@/components/site/site-root-layout";
import { createRootMetadata, siteViewport } from "@/lib/localized-metadata";

export const metadata: Metadata = createRootMetadata("en");
export const viewport = siteViewport;

export default function EnglishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteRootLayout locale="en">{children}</SiteRootLayout>;
}
