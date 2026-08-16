import type { Metadata } from "next";
import "../globals.css";

import { SiteRootLayout } from "@/components/site/site-root-layout";
import { createRootMetadata, siteViewport } from "@/lib/localized-metadata";

export const metadata: Metadata = createRootMetadata("zh");
export const viewport = siteViewport;
export const dynamicParams = false;

export function generateStaticParams() { return [{ locale: "zh" }]; }

export default function ChineseRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteRootLayout locale="zh">{children}</SiteRootLayout>;
}
