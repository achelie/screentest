import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Monitor, Timer } from "lucide-react";

import Link from "@/components/site/no-prefetch-link";
import styles from "@/components/tests/ScreenTests.module.css";
import { TestExperience } from "@/components/tests/TestExperience";
import { TestIcon } from "@/components/tests/TestIcon";
import { absoluteLocalizedUrl, getDictionary, localeConfig, localizePath, type Locale } from "@/lib/i18n";
import { pairedAlternates } from "@/lib/localized-metadata";
import { SITE_NAME } from "@/lib/site";
import { getTestBySlug, type TestDefinition } from "@/lib/tests";

export function createTestMetadata(locale: Locale, slug: string): Metadata {
  const test = getTestBySlug(slug, locale);
  if (!test) return {};
  const canonicalUrl = absoluteLocalizedUrl(locale, `/tests/${test.slug}`);
  const title = `${test.seoTitle} | ${SITE_NAME}`;
  return {
    title: { absolute: title },
    description: test.description,
    alternates: pairedAlternates(locale, `/tests/${test.slug}`),
    openGraph: {
      title,
      description: test.description,
      type: "website",
      url: canonicalUrl,
      locale: localeConfig[locale].ogLocale,
    },
  };
}

function createStructuredData(locale: Locale, test: TestDefinition) {
  const dictionary = getDictionary(locale);
  const copy = dictionary.testPage;
  const canonicalUrl = absoluteLocalizedUrl(locale, `/tests/${test.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${canonicalUrl}#application`,
        name: test.name,
        inLanguage: localeConfig[locale].htmlLang,
        description: test.description,
        url: canonicalUrl,
        applicationCategory: copy.applicationCategory,
        operatingSystem: copy.operatingSystem,
        browserRequirements: copy.browserRequirements,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: dictionary.common.home, item: absoluteLocalizedUrl(locale) },
          { "@type": "ListItem", position: 2, name: dictionary.common.screenTests, item: absoluteLocalizedUrl(locale, "/tests") },
          { "@type": "ListItem", position: 3, name: test.name, item: canonicalUrl },
        ],
      },
    ],
  };
}

export function TestPageContent({ locale, slug }: { locale: Locale; slug: string }) {
  const dictionary = getDictionary(locale);
  const test = getTestBySlug(slug, locale);
  if (!test) notFound();
  const relatedTests = test.relatedTests
    .map((relatedSlug) => getTestBySlug(relatedSlug, locale))
    .filter((related): related is TestDefinition => Boolean(related));
  const structuredData = createStructuredData(locale, test);

  return (
    <div className={styles.page}>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <header className={styles.pageHeader}>
        <nav aria-label={dictionary.common.breadcrumb} className={styles.breadcrumb}>
          <Link href={localizePath("/", locale)}>{dictionary.common.home}</Link><span aria-hidden="true">/</span>
          <Link href={localizePath("/tests", locale)}>{dictionary.common.screenTests}</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{test.shortName}</span>
        </nav>
        <div className={styles.metaLine}>
          <span className={styles.metaItem}><TestIcon name={test.icon} size={17} />{dictionary.common.browserTest}</span>
          <span className={styles.metaItem}><Timer aria-hidden="true" size={17} strokeWidth={1.8} />{test.duration}</span>
          <span className={styles.metaItem}><Monitor aria-hidden="true" size={17} strokeWidth={1.8} />{dictionary.common.noDownload}</span>
        </div>
        <h1 className={`${styles.title} ${styles.testTitle}`}>{test.name}</h1><p className={styles.lead}>{test.intro}</p>
      </header>

      <section aria-label={`${test.name}${dictionary.testPage.toolSuffix}`} className={styles.testMount}>
        <TestExperience locale={locale} test={test} />
      </section>

      <div className={styles.contentStack}>
        <section aria-labelledby="before-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="before-title">{dictionary.testPage.before}</h2>
          <ul className={styles.preparationList}>{test.preparation.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section aria-labelledby="look-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="look-title">{dictionary.testPage.lookFor}</h2>
          <dl className={styles.observationList}>{test.observations.map((item) => <div className={styles.observationRow} key={item.signal}><dt>{item.signal}</dt><dd>{item.meaning}</dd></div>)}</dl>
          <p className={styles.limitation}>{test.limitation}</p>
          <Link className={styles.guideLink} href={test.guideHref}>
            {test.guideLabel}{locale !== "en" ? ` (${dictionary.common.englishContent})` : ""}<ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
          </Link>
        </section>
        <section aria-labelledby="related-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="related-title">{dictionary.testPage.keepChecking}</h2>
          <div className={styles.relatedList}>{relatedTests.map((related) => (
            <Link className={styles.relatedLink} href={localizePath(`/tests/${related.slug}`, locale)} key={related.slug}>
              <span>{related.name}</span><ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </Link>
          ))}</div>
        </section>
      </div>
    </div>
  );
}
