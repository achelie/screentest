import type { MetadataRoute } from "next";
import type { SiteRoute } from "@/lib/site";

import {
  absoluteUrl,
  GUIDE_ROUTES,
  SITE_LAST_MODIFIED,
  TEST_ROUTES,
} from "@/lib/site";

const lastModified = new Date(`${SITE_LAST_MODIFIED}T00:00:00.000Z`);

function toSitemapEntry(
  route: SiteRoute,
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(route.href),
    lastModified: new Date(
      `${route.lastModified ?? SITE_LAST_MODIFIED}T00:00:00.000Z`,
    ),
    changeFrequency: "monthly",
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl(),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...TEST_ROUTES.map((route) =>
      toSitemapEntry(route, route.href === "/tests" ? 0.9 : 0.8),
    ),
    ...GUIDE_ROUTES.map((route) =>
      toSitemapEntry(route, route.href === "/guides" ? 0.8 : 0.7),
    ),
  ];
}
