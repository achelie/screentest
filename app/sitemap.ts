import type { MetadataRoute } from "next";

import {
  absoluteUrl,
  BLOG_ROUTES,
  SITE_LAST_MODIFIED,
  TEST_ROUTES,
  type SiteRoute,
} from "@/lib/site";
import {
  absoluteLocalizedUrl,
  localizedAlternates,
  LOCALES,
  type Locale,
} from "@/lib/i18n";

function routeLastModified(route: SiteRoute) {
  return "lastModified" in route ? route.lastModified : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pairedEntry = (
    path: string,
    locale: Locale,
    priority: number,
    changeFrequency: "weekly" | "monthly",
    modified = SITE_LAST_MODIFIED,
  ) => ({
    url: absoluteLocalizedUrl(locale, path),
    lastModified: new Date(`${modified}T00:00:00.000Z`),
    changeFrequency,
    priority,
    alternates: { languages: localizedAlternates(path) },
  });

  const englishOnlyEntry = (route: SiteRoute, priority: number) => ({
    url: absoluteUrl(route.href),
    lastModified: new Date(
      `${route.lastModified ?? SITE_LAST_MODIFIED}T00:00:00.000Z`,
    ),
    changeFrequency: "monthly" as const,
    priority,
    alternates: {
      languages: {
        "en-US": absoluteUrl(route.href),
        "x-default": absoluteUrl(route.href),
      },
    },
  });

  const localizedTests = TEST_ROUTES.flatMap((route) =>
    LOCALES.map((locale) =>
      pairedEntry(
        route.href,
        locale,
        route.href === "/tests" ? 0.9 : 0.8,
        "monthly",
        routeLastModified(route),
      ),
    ),
  );

  return [
    ...LOCALES.map((locale) => pairedEntry("/", locale, 1, "weekly")),
    ...localizedTests,
    ...BLOG_ROUTES.map((route) =>
      englishOnlyEntry(route, route.href === "/blog" ? 0.8 : 0.7),
    ),
  ];
}
