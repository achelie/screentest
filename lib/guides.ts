import "server-only";

import generatedGuides from "./generated-guides.json";

export type GuideFrontmatter = {
  title: string;
  description: string;
  published: string;
  updated: string;
  order: number;
};

export type GuideSummary = GuideFrontmatter & {
  slug: string;
  readingMinutes: number;
};

export type Guide = GuideSummary & {
  html: string;
};

const guides = generatedGuides as Guide[];

export async function getGuideSlugs() {
  return guides.map((guide) => guide.slug);
}

export async function getGuideSummary(
  slug: string,
): Promise<GuideSummary | null> {
  const guide = guides.find((candidate) => candidate.slug === slug);

  if (!guide) {
    return null;
  }

  return {
    slug: guide.slug,
    title: guide.title,
    description: guide.description,
    published: guide.published,
    updated: guide.updated,
    order: guide.order,
    readingMinutes: guide.readingMinutes,
  };
}

export async function getAllGuides(): Promise<GuideSummary[]> {
  return guides
    .map(({ html: _html, ...guide }) => guide)
    .sort((left, right) => left.order - right.order);
}

export async function getGuide(slug: string): Promise<Guide | null> {
  return guides.find((guide) => guide.slug === slug) ?? null;
}
