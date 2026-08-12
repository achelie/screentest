import "server-only";

import generatedBlog from "./generated-blog.json";

export type BlogTocItem = {
  readonly id: string;
  readonly label: string;
};

export type BlogFaq = {
  readonly question: string;
  readonly answer: string;
};

export type BlogFrontmatter = {
  readonly title: string;
  readonly description: string;
  readonly author: string;
  readonly category: string;
  readonly published: string;
  readonly updated: string;
  readonly cover: string;
  readonly coverAlt: string;
};

export type BlogSummary = BlogFrontmatter & {
  readonly slug: string;
  readonly readingMinutes: number;
};

export type BlogPost = BlogSummary & {
  readonly toc: readonly BlogTocItem[];
  readonly faq: readonly BlogFaq[];
  readonly html: string;
};

const posts = generatedBlog as BlogPost[];

export async function getBlogSlugs() {
  return posts.map((post) => post.slug);
}

export async function getAllBlogPosts(): Promise<BlogSummary[]> {
  return posts.map(({ html: _html, toc: _toc, faq: _faq, ...post }) => post);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return posts.find((post) => post.slug === slug) ?? null;
}
