import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";

import { SiteRootLayout } from "@/components/site/site-root-layout";
import { isLocalizedLocale, LOCALIZED_LOCALES } from "@/lib/i18n";
import { createRootMetadata, siteViewport } from "@/lib/localized-metadata";

export const viewport = siteViewport;
export const dynamicParams = false;
type Props = Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>;

export function generateStaticParams() {
  return LOCALIZED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocalizedLocale(locale) ? createRootMetadata(locale) : {};
}

export default async function LocalizedRootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) notFound();
  return <SiteRootLayout locale={locale}>{children}</SiteRootLayout>;
}
