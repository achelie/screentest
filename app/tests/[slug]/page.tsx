import type { Metadata } from "next";
import Link from "@/components/site/no-prefetch-link";
import { notFound } from "next/navigation";
import { ArrowRight, Monitor, Timer } from "lucide-react";

import styles from "@/components/tests/ScreenTests.module.css";
import { TestExperience } from "@/components/tests/TestExperience";
import { TestIcon } from "@/components/tests/TestIcon";
import { StartFullscreenButton } from "@/components/tests/StartFullscreenButton";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import {
  getTestBySlug,
  TEST_SLUGS,
  type TestDefinition,
} from "@/lib/tests";

export const dynamicParams = false;

type TestPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return TEST_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: TestPageProps): Promise<Metadata> {
  const { slug } = await params;
  const test = getTestBySlug(slug);

  if (!test) {
    return {};
  }

  const canonicalUrl = absoluteUrl(`/tests/${test.slug}`);
  const title = `${test.seoTitle} | ${SITE_NAME}`;

  return {
    title: { absolute: title },
    description: test.description,
    keywords: [...test.keywords],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description: test.description,
      type: "website",
      url: canonicalUrl,
    },
  };
}

function createStructuredData(test: TestDefinition) {
  const canonicalUrl = absoluteUrl(`/tests/${test.slug}`);
  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#application`,
      name: test.name,
      description: test.description,
      url: canonicalUrl,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements:
        "A modern browser with JavaScript. Fullscreen support is optional.",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Screen tests",
          item: absoluteUrl("/tests"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: test.name,
          item: canonicalUrl,
        },
      ],
    },
  ];

  if (test.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: test.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export default async function TestPage({ params }: TestPageProps) {
  const { slug } = await params;
  const test = getTestBySlug(slug);

  if (!test) {
    notFound();
  }

  const relatedTests = test.relatedTests
    .map((relatedSlug) => getTestBySlug(relatedSlug))
    .filter((related): related is TestDefinition => Boolean(related));
  const structuredData = createStructuredData(test);
  const startLabel = `Start ${test.name.replace(/ Online$/, "")}`;

  return (
    <div className={styles.page}>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />

      <header className={`${styles.pageHeader} ${styles.toolPageHeader}`}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/tests">Screen tests</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{test.shortName}</span>
        </nav>

        <div className={styles.metaLine}>
          <span className={styles.metaItem}>
            <TestIcon name={test.icon} size={17} />
            Browser test
          </span>
          <span className={styles.metaItem}>
            <Timer aria-hidden="true" size={17} strokeWidth={1.8} />
            {test.duration}
          </span>
          <span className={styles.metaItem}>
            <Monitor aria-hidden="true" size={17} strokeWidth={1.8} />
            No download
          </span>
        </div>

        <h1 className={`${styles.title} ${styles.testTitle}`}>{test.name}</h1>
        <div className={styles.headerStartAction}>
          <StartFullscreenButton label={startLabel} slug={test.slug} />
        </div>
      </header>

      <section
        aria-label={`${test.name} tool`}
        className={`${styles.testMount} ${styles.toolTestMount}`}
        id={`${test.slug}-tool`}
      >
        <TestExperience test={test} />
      </section>

      <div className={styles.contentStack}>
        <section aria-labelledby="before-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="before-title">
            How to use this {test.name.toLowerCase()}
          </h2>
          <ul className={styles.preparationList}>
            {test.preparation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="look-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="look-title">
            What to look for
          </h2>
          <dl className={styles.observationList}>
            {test.observations.map((observation) => (
              <div className={styles.observationRow} key={observation.signal}>
                <dt>{observation.signal}</dt>
                <dd>{observation.meaning}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.limitation}>{test.limitation}</p>
        </section>

        {test.faq?.length ? (
          <section aria-labelledby="faq-title" className={styles.contentSection}>
            <h2 className={styles.sectionTitle} id="faq-title">
              {test.name} FAQ
            </h2>
            <div className={styles.testFaqList}>
              {test.faq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                  {item.sourceHref ? (
                    <a href={item.sourceHref} rel="noreferrer" target="_blank">
                      See the Reddit discussion that inspired this question
                    </a>
                  ) : null}
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <section aria-labelledby="related-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="related-title">
            Related tools
          </h2>
          <div className={styles.relatedList}>
            {relatedTests.map((related) => (
              <Link
                className={styles.relatedLink}
                href={`/tests/${related.slug}`}
                key={related.slug}
              >
                <span>{related.name}</span>
                <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
