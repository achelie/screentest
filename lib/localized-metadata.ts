import type { Metadata, Viewport } from "next";

import {
  absoluteLocalizedUrl,
  getDictionary,
  localeConfig,
  localizedAlternates,
  type Locale,
} from "@/lib/i18n";
import { siteConfig, SITE_URL } from "@/lib/site";

export function createRootMetadata(locale: Locale): Metadata {
  const copy = getDictionary(locale).rootMetadata;
  const homeUrl = absoluteLocalizedUrl(locale);
  const otherLocale = locale === "en" ? "zh_CN" : "en_US";

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: copy.title, template: copy.titleTemplate },
    description: copy.description,
    applicationName: "ScreenTestHub",
    alternates: {
      canonical: homeUrl,
      languages: localizedAlternates("/"),
    },
    icons: { icon: "/icon.svg" },
    manifest: locale === "zh" ? "/zh/manifest.webmanifest" : "/manifest.webmanifest",
    openGraph: {
      type: "website",
      url: homeUrl,
      siteName: "ScreenTestHub",
      title: copy.ogTitle,
      description: copy.ogDescription,
      locale: localeConfig[locale].ogLocale,
      alternateLocale: [otherLocale],
      images: [{ url: "/opengraph-image.png", width: 1536, height: 1024, alt: copy.ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.twitterTitle,
      description: copy.twitterDescription,
      images: ["/opengraph-image.png"],
    },
    robots: { index: true, follow: true },
    verification: siteConfig.analytics.googleSiteVerification
      ? { google: siteConfig.analytics.googleSiteVerification }
      : undefined,
    category: "technology",
  };
}

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ece7dc" },
    { media: "(prefers-color-scheme: dark)", color: "#151816" },
  ],
};

export function pairedAlternates(locale: Locale, path: string) {
  return {
    canonical: absoluteLocalizedUrl(locale, path),
    languages: localizedAlternates(path),
  };
}
