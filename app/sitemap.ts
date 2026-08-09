import type { MetadataRoute } from "next";

import {
  absoluteUrl,
  GUIDE_ROUTES,
  SITE_LAST_MODIFIED,
  TEST_ROUTES,
} from "@/lib/site";

const lastModified = new Date(`${SITE_LAST_MODIFIED}T00:00:00.000Z`);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl(),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...TEST_ROUTES.map((route) => ({
      url: absoluteUrl(route.href),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route.href === "/tests" ? 0.9 : 0.8,
    })),
    ...GUIDE_ROUTES.map((route) => ({
      url: absoluteUrl(route.href),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route.href === "/guides" ? 0.8 : 0.7,
    })),
  ];
}
