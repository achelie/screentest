import type { Metadata, Viewport } from "next";

import {
  absoluteLocalizedUrl,
  getDictionary,
  localeConfig,
  localizedAlternates,
  LOCALES,
  type Locale,
} from "@/lib/i18n";
import { siteConfig, SITE_URL } from "@/lib/site";

export function createRootMetadata(locale: Locale): Metadata {
  const copy = getDictionary(locale).rootMetadata;
  const homeUrl = absoluteLocalizedUrl(locale);
  const alternateLocales = LOCALES.filter((candidate) => candidate !== locale).map(
    (candidate) => localeConfig[candidate].ogLocale,
  );

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
    manifest:
      locale === "en"
        ? "/manifest.webmanifest"
        : `${localeConfig[locale].pathPrefix}/manifest.webmanifest`,
    openGraph: {
      type: "website",
      url: homeUrl,
      siteName: "ScreenTestHub",
      title: copy.ogTitle,
      description: copy.ogDescription,
      locale: localeConfig[locale].ogLocale,
      alternateLocale: alternateLocales,
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

export function englishOnlyAlternates(path: string) {
  const url = absoluteLocalizedUrl("en", path);
  return {
    canonical: url,
    languages: { "en-US": url, "x-default": url },
  };
}
