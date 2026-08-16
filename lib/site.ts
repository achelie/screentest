export const SITE_NAME = "ScreenTestHub";
export const SITE_URL = "https://screentesthub.com";
export const SITE_DESCRIPTION =
  "Free browser screen tests for dead pixels, backlight bleed, grayscale, gradients, color, and motion.";
export const SITE_LANGUAGE = "en";
export const SITE_LOCALE = "en_US";
export const SITE_LAST_MODIFIED = "2026-08-09";

import type { Locale } from "@/lib/i18n";
import { getScreenTests } from "@/lib/tests";

export type SiteRoute = {
  readonly href: `/${string}`;
  readonly label: string;
  readonly lastModified?: string;
};

export const TEST_ROUTES = [
  { href: "/tests", label: "All screen tests" },
  {
    href: "/touch-screen-test",
    label: "Touch Screen Test",
    lastModified: "2026-08-12",
  },
  { href: "/tests/guided", label: "Guided Screen Test" },
  { href: "/tests/dead-pixel", label: "Dead Pixel Test" },
  { href: "/tests/backlight-bleed", label: "Backlight Bleed Test" },
  { href: "/tests/grayscale", label: "Grayscale and Uniformity Test" },
  { href: "/tests/gradient", label: "Gradient Banding Test" },
  { href: "/tests/motion", label: "Motion and Ghosting Test" },
  { href: "/tests/color", label: "Monitor Color Test" },
] as const satisfies readonly SiteRoute[];

export function getTestRoutes(locale: Locale): readonly SiteRoute[] {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const allTestsLabel = {
    en: "All screen tests",
    zh: "全部屏幕测试",
    de: "Alle Bildschirmtests",
  }[locale];
  const englishOnlyRoutes =
    locale === "en"
      ? [{ href: "/touch-screen-test" as const, label: "Touch Screen Test" }]
      : [];

  return [
    { href: `${prefix}/tests` as `/${string}`, label: allTestsLabel },
    ...englishOnlyRoutes,
    ...getScreenTests(locale).map((test) => ({
      href: `${prefix}/tests/${test.slug}` as `/${string}`,
      label: test.name,
    })),
  ];
}

export const GUIDE_ROUTES = [
  { href: "/guides", label: "Screen testing guides" },
  {
    href: "/guides/check-dead-pixels",
    label: "How to Check for Dead Pixels",
  },
  {
    href: "/guides/check-backlight-bleed",
    label: "How to Check for Backlight Bleed",
  },
  {
    href: "/guides/test-screen-uniformity",
    label: "How to Test Screen Uniformity",
  },
  {
    href: "/guides/test-motion-blur",
    label: "How to Test Motion Blur",
  },
] as const satisfies readonly SiteRoute[];

export const SITE_ROUTES = [
  { href: "/", label: "Home" },
  ...TEST_ROUTES,
  ...GUIDE_ROUTES,
] as const satisfies readonly SiteRoute[];

export const siteConfig = {
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  language: SITE_LANGUAGE,
  locale: SITE_LOCALE,
  analytics: {
    googleAnalyticsMeasurementId:
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || undefined,
    googleSiteVerification:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || undefined,
  },
} as const;

export function absoluteUrl(path: string = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}
