export const SITE_NAME = "ScreenTestHub";
export const SITE_URL = "https://www.screentesthub.com";
export const SITE_DESCRIPTION =
  "Free browser screen tests for resolution, dead pixels, OLED burn-in, backlight bleed, HDR, screen tearing, color calibration, grayscale, gradients, color, and motion.";
export const SITE_LANGUAGE = "en";
export const SITE_LOCALE = "en_US";
export const SITE_LAST_MODIFIED = "2026-08-28";

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

export const BLOG_ROUTES = [
  { href: "/blog", label: "Screen troubleshooting blog", lastModified: "2026-08-28" },
  {
    href: "/blog/what-causes-ghost-touch",
    label: "What Causes Ghost Touch",
    lastModified: "2026-08-27",
  },
  {
    href: "/blog/touch-screen-not-working",
    label: "Touch Screen Not Working",
    lastModified: "2026-08-26",
  },
  {
    href: "/blog/samsung-touch-screen-test-code",
    label: "Samsung Touch Screen Test Code",
    lastModified: "2026-08-25",
  },
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
    lastModified: "2026-08-28",
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
