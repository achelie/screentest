import type { Metadata } from "next";
import Link from "@/components/site/no-prefetch-link";
import { ArrowRight, Monitor, Timer } from "lucide-react";

import { TestIcon } from "@/components/tests/TestIcon";
import styles from "@/components/tests/ScreenTests.module.css";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { SCREEN_TESTS } from "@/lib/tests";

const canonicalUrl = absoluteUrl("/tests");

export const metadata: Metadata = {
  title: { absolute: `Free Online Screen Tests | ${SITE_NAME}` },
  description:
    "Run free browser screen tests for dead pixels, backlight bleed, grayscale uniformity, gradient banding, color, and motion.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: `Free Online Screen Tests | ${SITE_NAME}`,
    description:
      "Pick one focused screen test or run the complete guided check in about two minutes.",
    type: "website",
    url: canonicalUrl,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${canonicalUrl}#page`,
      name: "Online screen tests",
      description: metadata.description,
      url: canonicalUrl,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: absoluteUrl("/"),
      },
    },
    {
      "@type": "ItemList",
      "@id": `${canonicalUrl}#tests`,
      name: "ScreenTestHub test library",
      itemListElement: SCREEN_TESTS.map((test, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: test.name,
        url: absoluteUrl(`/tests/${test.slug}`),
      })),
    },
  ],
};

const previewColors = [
  "#f5f4ee",
  "#111412",
  "#ff0000",
  "#00a53c",
  "#0057ff",
  "#808080",
] as const;

export default function TestsPage() {
  const guidedTest = SCREEN_TESTS[0];
  const focusedTests = SCREEN_TESTS.slice(1);

  return (
    <div className={styles.page}>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />

      <header className={styles.pageHeader}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Screen tests</span>
        </nav>
        <div className={styles.metaLine}>
          <span className={styles.metaItem}>
            <Monitor aria-hidden="true" size={17} strokeWidth={1.8} />
            Seven browser tests
          </span>
          <span className={styles.metaItem}>
            <Timer aria-hidden="true" size={17} strokeWidth={1.8} />
            No download
          </span>
        </div>
        <h1 className={styles.title}>Screen tests that make defects obvious.</h1>
        <p className={styles.lead}>
          Pick the symptom you see, or run the guided check when the screen is
          simply acting suspicious.
        </p>
      </header>

      <section aria-label="Screen test library" className={styles.catalogLayout}>
        <Link className={styles.featuredTest} href={`/tests/${guidedTest.slug}`}>
          <div aria-hidden="true" className={styles.featuredVisual}>
            {previewColors.map((color) => (
              <span
                className={styles.previewPatch}
                key={color}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className={styles.featuredCopy}>
            <div className={styles.metaLine}>
              <span className={styles.metaItem}>
                <Timer aria-hidden="true" size={16} strokeWidth={1.8} />
                {guidedTest.duration}
              </span>
            </div>
            <h2>{guidedTest.name}</h2>
            <p>{guidedTest.intro}</p>
            <span className={styles.inlineLink}>
              Run all checks
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </span>
          </div>
        </Link>

        <div className={styles.testList}>
          {focusedTests.map((test) => (
            <Link
              className={styles.testListLink}
              href={`/tests/${test.slug}`}
              key={test.slug}
            >
              <span className={styles.testListIcon}>
                <TestIcon name={test.icon} />
              </span>
              <span className={styles.testListCopy}>
                <strong>{test.name}</strong>
                <span>{test.intro}</span>
              </span>
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
