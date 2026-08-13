import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import Link from "@/components/site/no-prefetch-link";
import { getAllBlogPosts, getBlogPost, getBlogSlugs } from "@/lib/blog";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import styles from "../Blog.module.css";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getBlogSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Article not found", robots: { index: false, follow: false } };
  }

  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const imageUrl = absoluteUrl(post.cover);

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: canonicalUrl },
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      publishedTime: post.published,
      modifiedTime: post.updated,
      authors: [post.author],
      images: [{ url: imageUrl, width: 1600, height: 900, alt: post.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getBlogPost(slug), getAllBlogPosts()]);

  if (!post) notFound();

  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const relatedPosts = allPosts
    .filter(
      (candidate) =>
        candidate.slug !== post.slug && candidate.category === post.category,
    )
    .slice(0, 3);
  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "Article",
      "@id": `${canonicalUrl}#article`,
      headline: post.title,
      description: post.description,
      image: [absoluteUrl(post.cover)],
      datePublished: post.published,
      dateModified: post.updated,
      mainEntityOfPage: canonicalUrl,
      author: { "@type": "Organization", name: post.author, url: absoluteUrl("/") },
      publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
        { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
      ],
    },
  ];

  if (post.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: post.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return (
    <div className={styles.blogPage}>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />

      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <Link href="/blog">
          <ArrowLeft aria-hidden="true" size={17} strokeWidth={1.9} />
          Back to blog
        </Link>
      </nav>

      <article>
        <header className={styles.articleHeader}>
          <div>
            <p className={styles.postCategory}>{post.category}</p>
            <h1>{post.title}</h1>
          </div>
          <dl className={styles.byline}>
            <div><dt>Written by</dt><dd>{post.author}</dd></div>
            <div><dt>Updated</dt><dd><time dateTime={post.updated}>{formatDate(post.updated)}</time></dd></div>
            <div><dt>Reading time</dt><dd>{post.readingMinutes} min</dd></div>
          </dl>
        </header>

        <figure className={`${styles.coverFrame} ${styles.heroCover}`}>
          <Image
            alt={post.coverAlt}
            height={900}
            priority
            sizes="(max-width: 1180px) calc(100vw - 2rem), 1180px"
            src={post.cover}
            width={1600}
          />
        </figure>

        <details className={styles.mobileToc}>
          <summary>Table of contents</summary>
          <ol>
            {post.toc.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}
          </ol>
        </details>

        <div className={styles.articleGrid}>
          <div>
            <aside className={styles.toolCta}>
              <strong>{post.ctaTitle}</strong>
              <p>{post.ctaDescription}</p>
              <Link href={post.ctaHref}>
                {post.ctaLabel} <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
              </Link>
            </aside>
            <div className={styles.articleBody} dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>

          <aside aria-label="Table of contents" className={styles.desktopToc}>
            <p>Table of contents</p>
            <ol>
              {post.toc.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}
            </ol>
          </aside>
        </div>
      </article>

      {relatedPosts.length > 0 ? (
        <section aria-labelledby="related-posts-title" className={styles.relatedPosts}>
          <h2 id="related-posts-title">Read related articles</h2>
          <div className={styles.postGrid}>
            {relatedPosts.map((related) => (
              <Link className={styles.postCard} href={`/blog/${related.slug}`} key={related.slug}>
                <span className={styles.postCategory}>{related.category}</span>
                <h2>{related.title}</h2>
                <p>{related.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
