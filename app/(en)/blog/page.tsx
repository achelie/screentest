import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import Link from "@/components/site/no-prefetch-link";
import { getAllBlogPosts } from "@/lib/blog";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { englishOnlyAlternates } from "@/lib/localized-metadata";
import styles from "./Blog.module.css";

export const dynamic = "force-static";

const canonicalUrl = absoluteUrl("/blog");
const description =
  "Practical screen troubleshooting for dead pixels, touch failures, display replacements, monitor problems, and the tests that help you document them.";

export const metadata: Metadata = {
  title: "Screen Troubleshooting Blog",
  description,
  alternates: englishOnlyAlternates("/blog"),
  openGraph: {
    type: "website",
    title: `Screen Troubleshooting Blog | ${SITE_NAME}`,
    description,
    url: canonicalUrl,
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  const [featured, ...remainingPosts] = posts;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "ScreenTestHub Blog",
      description,
      url: canonicalUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blog/${post.slug}`),
        name: post.title,
      })),
    },
  ];

  return (
    <div className={styles.blogPage}>
      <JsonLd data={structuredData} />
      <h1 className={styles.visuallyHidden}>ScreenTestHub Blog</h1>

      {featured ? (
        <article>
          <Link className={styles.featuredPost} href={`/blog/${featured.slug}`}>
            <span className={styles.coverFrame}>
              <Image
                alt={featured.coverAlt}
                height={900}
                priority
                sizes="(max-width: 840px) calc(100vw - 2rem), 62vw"
                src={featured.cover}
                width={1600}
              />
            </span>
            <div className={styles.featuredCopy}>
              <span className={styles.postCategory}>{featured.category}</span>
              <h2>{featured.title}</h2>
              <p>{featured.description}</p>
              <span className={styles.postMeta}>
                <time dateTime={featured.published}>{formatDate(featured.published)}</time>
                <span>{featured.readingMinutes} min read</span>
              </span>
              <span className={styles.readLink}>
                Read article <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
              </span>
            </div>
          </Link>
        </article>
      ) : null}

      {remainingPosts.length > 0 ? (
        <section aria-label="More articles" className={styles.postGrid}>
          {remainingPosts.map((post) => (
            <Link className={styles.postCard} href={`/blog/${post.slug}`} key={post.slug}>
              <span className={styles.postCategory}>{post.category}</span>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <span className={styles.postMeta}>
                <time dateTime={post.published}>{formatDate(post.published)}</time>
                <span>{post.readingMinutes} min read</span>
              </span>
            </Link>
          ))}
        </section>
      ) : null}
    </div>
  );
}
