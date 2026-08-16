import type { Metadata } from "next";
import { ArrowRight, Monitor, Timer, Zap } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import Link from "@/components/site/no-prefetch-link";
import { HdrTest } from "@/components/tests/HdrTest";
import { MonitorColorCalibration } from "@/components/tests/MonitorColorCalibration";
import { OledBurnInTest } from "@/components/tests/OledBurnInTest";
import { ScreenResolutionChecker } from "@/components/tests/ScreenResolutionChecker";
import { ScreenTearingTest } from "@/components/tests/ScreenTearingTest";
import { StartFullscreenButton } from "@/components/tests/StartFullscreenButton";
import styles from "@/components/tests/ScreenTests.module.css";
import { TouchScreenTest } from "@/components/touch/TouchScreenTest";
import {
  absoluteLocalizedUrl,
  getDictionary,
  localeConfig,
  localizePath,
  type Locale,
} from "@/lib/i18n";
import { pairedAlternates } from "@/lib/localized-metadata";
import { SITE_NAME } from "@/lib/site";
import {
  getStandaloneToolCopy,
  type StandaloneToolSlug,
} from "@/lib/standalone-tools";

export function createStandaloneToolMetadata(
  locale: Locale,
  slug: StandaloneToolSlug,
): Metadata {
  const copy = getStandaloneToolCopy(locale, slug);
  const canonicalUrl = absoluteLocalizedUrl(locale, `/${slug}`);
  return {
    title: { absolute: `${copy.seoTitle} | ${SITE_NAME}` },
    description: copy.description,
    keywords: [...copy.keywords],
    alternates: pairedAlternates(locale, `/${slug}`),
    openGraph: {
      title: `${copy.seoTitle} | ${SITE_NAME}`,
      description: copy.description,
      type: "website",
      url: canonicalUrl,
      locale: localeConfig[locale].ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${copy.seoTitle} | ${SITE_NAME}`,
      description: copy.description,
    },
  };
}

function ToolExperience({ locale, slug }: { locale: Locale; slug: StandaloneToolSlug }) {
  switch (slug) {
    case "touch-screen-test":
      return <TouchScreenTest locale={locale} />;
    case "hdr-test":
      return <HdrTest locale={locale} />;
    case "screen-tearing-test":
      return <ScreenTearingTest locale={locale} />;
    case "monitor-color-calibration":
      return <MonitorColorCalibration locale={locale} />;
    case "oled-burn-in-test":
      return <OledBurnInTest locale={locale} />;
    case "screen-resolution-checker":
      return <ScreenResolutionChecker locale={locale} />;
  }
}

export function StandaloneToolPageContent({
  locale,
  slug,
}: {
  locale: Locale;
  slug: StandaloneToolSlug;
}) {
  const dictionary = getDictionary(locale);
  const copy = getStandaloneToolCopy(locale, slug);
  const canonicalUrl = absoluteLocalizedUrl(locale, `/${slug}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${canonicalUrl}#application`,
        name: copy.title,
        inLanguage: localeConfig[locale].htmlLang,
        description: copy.description,
        url: canonicalUrl,
        applicationCategory: dictionary.testPage.applicationCategory,
        operatingSystem: dictionary.testPage.operatingSystem,
        browserRequirements: dictionary.testPage.browserRequirements,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: dictionary.common.home, item: absoluteLocalizedUrl(locale) },
          { "@type": "ListItem", position: 2, name: dictionary.common.screenTests, item: absoluteLocalizedUrl(locale, "/tests") },
          { "@type": "ListItem", position: 3, name: copy.title, item: canonicalUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        inLanguage: localeConfig[locale].htmlLang,
        mainEntity: copy.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <div className={styles.page}>
      <JsonLd data={structuredData} />
      <header className={`${styles.pageHeader} ${styles.toolPageHeader}`}>
        <nav aria-label={dictionary.common.breadcrumb} className={styles.breadcrumb}>
          <Link href={localizePath("/", locale)}>{dictionary.common.home}</Link>
          <span aria-hidden="true">/</span>
          <Link href={localizePath("/tests", locale)}>{dictionary.common.screenTests}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{copy.shortName}</span>
        </nav>
        <div className={styles.metaLine}>
          <span className={styles.metaItem}><Zap aria-hidden="true" size={17} strokeWidth={1.8} />{copy.modeSummary}</span>
          <span className={styles.metaItem}><Timer aria-hidden="true" size={17} strokeWidth={1.8} />{copy.duration}</span>
          <span className={styles.metaItem}><Monitor aria-hidden="true" size={17} strokeWidth={1.8} />{dictionary.common.noDownload}</span>
        </div>
        <h1 className={`${styles.title} ${styles.testTitle}`}>{copy.title}</h1>
        <p className={styles.lead}>{copy.description}</p>
        <div className={styles.headerStartAction}>
          <StartFullscreenButton label={copy.startLabel} slug={slug} />
        </div>
      </header>

      <section aria-label={copy.toolLabel} className={`${styles.testMount} ${styles.toolTestMount}`} id={`${slug}-tool`}>
        <ToolExperience locale={locale} slug={slug} />
      </section>

      <div className={styles.contentStack}>
        <section aria-labelledby="standalone-how-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="standalone-how-title">{copy.howTitle}</h2>
          <ul className={styles.preparationList}>{copy.preparation.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section aria-labelledby="standalone-look-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="standalone-look-title">{copy.lookTitle}</h2>
          <dl className={styles.observationList}>{copy.observations.map((item) => (
            <div className={styles.observationRow} key={item.signal}><dt>{item.signal}</dt><dd>{item.meaning}</dd></div>
          ))}</dl>
          <p className={styles.limitation}>{copy.limitation}</p>
        </section>
        <section aria-labelledby="standalone-faq-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="standalone-faq-title">{copy.faqTitle}</h2>
          <div className={styles.testFaqList}>{copy.faqs.map((item) => (
            <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>
          ))}</div>
        </section>
        <section aria-labelledby="standalone-related-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="standalone-related-title">{copy.relatedTitle}</h2>
          <div className={styles.relatedList}>{copy.related.map((tool) => (
            <Link className={styles.relatedLink} href={localizePath(tool.href, locale)} key={tool.href}>
              <span>{tool.label}</span><ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </Link>
          ))}</div>
        </section>
      </div>
    </div>
  );
}
