import type { Metadata } from "next";
import { ArrowRight, Monitor, Timer } from "lucide-react";

import Link from "@/components/site/no-prefetch-link";
import { TestIcon } from "@/components/tests/TestIcon";
import styles from "@/components/tests/ScreenTests.module.css";
import { absoluteLocalizedUrl, getDictionary, localeConfig, localizePath, type Locale } from "@/lib/i18n";
import { pairedAlternates } from "@/lib/localized-metadata";
import { SITE_NAME } from "@/lib/site";
import { getScreenTests } from "@/lib/tests";

const previewColors = ["#f5f4ee", "#111412", "#ff0000", "#00a53c", "#0057ff", "#808080"] as const;

export function createTestsMetadata(locale: Locale): Metadata {
  const copy = getDictionary(locale).testsIndex;
  const url = absoluteLocalizedUrl(locale, "/tests");
  return {
    title: { absolute: copy.metadataTitle },
    description: copy.metadataDescription,
    alternates: pairedAlternates(locale, "/tests"),
    openGraph: {
      title: copy.metadataTitle,
      description: copy.ogDescription,
      type: "website",
      url,
      locale: localeConfig[locale].ogLocale,
    },
  };
}

export function TestsPageContent({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const copy = dictionary.testsIndex;
  const tests = getScreenTests(locale);
  const guidedTest = tests[0];
  const focusedTests = tests.slice(1);
  const canonicalUrl = absoluteLocalizedUrl(locale, "/tests");
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonicalUrl}#page`,
        name: copy.collectionName,
        inLanguage: localeConfig[locale].htmlLang,
        description: copy.metadataDescription,
        url: canonicalUrl,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteLocalizedUrl(locale) },
      },
      {
        "@type": "ItemList",
        "@id": `${canonicalUrl}#tests`,
        name: copy.libraryName,
        itemListElement: tests.map((test, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: test.name,
          url: absoluteLocalizedUrl(locale, `/tests/${test.slug}`),
        })),
      },
    ],
  };

  return (
    <div className={styles.page}>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <header className={styles.pageHeader}>
        <nav aria-label={dictionary.common.breadcrumb} className={styles.breadcrumb}>
          <Link href={localizePath("/", locale)}>{dictionary.common.home}</Link>
          <span aria-hidden="true">/</span><span aria-current="page">{copy.breadcrumb}</span>
        </nav>
        <div className={styles.metaLine}>
          <span className={styles.metaItem}><Monitor aria-hidden="true" size={17} strokeWidth={1.8} />{copy.count}</span>
          <span className={styles.metaItem}><Timer aria-hidden="true" size={17} strokeWidth={1.8} />{dictionary.common.noDownload}</span>
        </div>
        <h1 className={styles.title}>{copy.title}</h1><p className={styles.lead}>{copy.lead}</p>
      </header>

      <section aria-label={copy.libraryLabel} className={styles.catalogLayout}>
        <Link className={styles.featuredTest} href={localizePath(`/tests/${guidedTest.slug}`, locale)}>
          <div aria-hidden="true" className={styles.featuredVisual}>
            {previewColors.map((color) => <span className={styles.previewPatch} key={color} style={{ backgroundColor: color }} />)}
          </div>
          <div className={styles.featuredCopy}>
            <div className={styles.metaLine}><span className={styles.metaItem}><Timer aria-hidden="true" size={16} strokeWidth={1.8} />{guidedTest.duration}</span></div>
            <h2>{guidedTest.name}</h2><p>{guidedTest.intro}</p>
            <span className={styles.inlineLink}>{copy.runAll}<ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} /></span>
          </div>
        </Link>
        <div className={styles.testList}>
          {focusedTests.map((test) => (
            <Link className={styles.testListLink} href={localizePath(`/tests/${test.slug}`, locale)} key={test.slug}>
              <span className={styles.testListIcon}><TestIcon name={test.icon} /></span>
              <span className={styles.testListCopy}><strong>{test.name}</strong><span>{test.intro}</span></span>
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
