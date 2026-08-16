export const SITE_NAME = "ScreenTestHub";
export const SITE_URL = "https://www.screentesthub.com";
export const SITE_DESCRIPTION =
  "Free browser screen tests for resolution, dead pixels, OLED burn-in, backlight bleed, HDR, screen tearing, color calibration, grayscale, gradients, color, and motion.";
export const SITE_LANGUAGE = "en";
export const SITE_LOCALE = "en_US";
export const SITE_LAST_MODIFIED = "2026-08-15";

import { localizePath, type Locale } from "@/lib/i18n";
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
  {
    href: "/hdr-test",
    label: "HDR Test Online",
    lastModified: "2026-08-12",
  },
  {
    href: "/screen-tearing-test",
    label: "Screen Tearing Test",
    lastModified: "2026-08-13",
  },
  {
    href: "/monitor-color-calibration",
    label: "Monitor Color Calibration",
    lastModified: "2026-08-13",
  },
  {
    href: "/oled-burn-in-test",
    label: "OLED Burn-In Test",
    lastModified: "2026-08-14",
  },
  {
    href: "/screen-resolution-checker",
    label: "Screen Resolution Checker",
    lastModified: "2026-08-15",
  },
  {
    href: "/tests/guided",
    label: "Monitor Test Online",
    lastModified: "2026-08-12",
  },
  {
    href: "/tests/dead-pixel",
    label: "Dead Pixel Test",
    lastModified: "2026-08-12",
  },
  {
    href: "/tests/backlight-bleed",
    label: "Backlight Bleed Test",
    lastModified: "2026-08-12",
  },
  {
    href: "/tests/grayscale",
    label: "Screen Uniformity Test",
    lastModified: "2026-08-12",
  },
  {
    href: "/tests/gradient",
    label: "Gradient Banding Test",
    lastModified: "2026-08-12",
  },
  {
    href: "/tests/motion",
    label: "Monitor Ghosting Test",
    lastModified: "2026-08-12",
  },
  {
    href: "/tests/color",
    label: "Monitor Color Test",
    lastModified: "2026-08-12",
  },
] as const satisfies readonly SiteRoute[];

const STANDALONE_TOOL_ROUTES = TEST_ROUTES.slice(1, 7);

const STANDALONE_TOOL_LABELS: Record<Locale, Record<string, string>> = {
  en: Object.fromEntries(
    STANDALONE_TOOL_ROUTES.map((route) => [route.href, route.label]),
  ),
  zh: {
    "/touch-screen-test": "触摸屏测试",
    "/hdr-test": "HDR 在线测试",
    "/screen-tearing-test": "屏幕撕裂测试",
    "/monitor-color-calibration": "显示器色彩校准",
    "/oled-burn-in-test": "OLED 烧屏测试",
    "/screen-resolution-checker": "屏幕分辨率检测",
  },
  de: {
    "/touch-screen-test": "Touchscreen-Test",
    "/hdr-test": "HDR-Test online",
    "/screen-tearing-test": "Screen-Tearing-Test",
    "/monitor-color-calibration": "Monitorkalibrierung",
    "/oled-burn-in-test": "OLED-Einbrenntest",
    "/screen-resolution-checker": "Bildschirmauflösung prüfen",
  },
};

export function getTestRoutes(locale: Locale): readonly SiteRoute[] {
  const allTestsLabel = {
    en: "All screen tests",
    zh: "全部屏幕测试",
    de: "Alle Bildschirmtests",
  }[locale];

  return [
    { href: localizePath("/tests", locale) as `/${string}`, label: allTestsLabel },
    ...STANDALONE_TOOL_ROUTES.map((route) => ({
      href: localizePath(route.href, locale) as `/${string}`,
      label: STANDALONE_TOOL_LABELS[locale][route.href] ?? route.label,
    })),
    ...getScreenTests(locale).map((test) => ({
      href: localizePath(`/tests/${test.slug}`, locale) as `/${string}`,
      label: test.name,
    })),
  ];
}

export const BLOG_ROUTES = [
  { href: "/blog", label: "Screen troubleshooting blog", lastModified: "2026-08-15" },
  {
    href: "/blog/1080p-vs-1440p-vs-4k",
    label: "1080p vs 1440p vs 4K",
    lastModified: "2026-08-15",
  },
  {
    href: "/blog/oled-monitor-burn-in",
    label: "OLED Monitor Burn-In",
    lastModified: "2026-08-14",
  },
  {
    href: "/blog/touch-screen-not-working-after-screen-replacement",
    label: "Touch Screen Not Working After Screen Replacement",
    lastModified: "2026-08-12",
  },
  {
    href: "/blog/screen-tearing-with-vsync-on",
    label: "Screen Tearing With VSync On",
    lastModified: "2026-08-13",
  },
  {
    href: "/blog/monitor-calibration-without-colorimeter",
    label: "Monitor Calibration Without a Colorimeter",
    lastModified: "2026-08-13",
  },
] as const satisfies readonly SiteRoute[];

export const SITE_ROUTES = [
  { href: "/", label: "Home" },
  ...TEST_ROUTES,
  ...BLOG_ROUTES,
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
