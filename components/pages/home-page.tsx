import type { Metadata } from "next";
import { ArrowRight, CircleDot, Contrast, Gauge, Grid2X2, Moon, Palette } from "lucide-react";

import { ScreenSampler } from "@/components/home/screen-sampler";
import { JsonLd } from "@/components/seo/json-ld";
import Link from "@/components/site/no-prefetch-link";
import {
  absoluteLocalizedUrl,
  getDictionary,
  localizePath,
  type Locale,
} from "@/lib/i18n";
import { pairedAlternates } from "@/lib/localized-metadata";
import { getAllGuides } from "@/lib/guides";

const symptomIcons = [CircleDot, Moon, Grid2X2, Contrast, Gauge, Palette] as const;

export function createHomeMetadata(locale: Locale): Metadata {
  const copy = getDictionary(locale).home;
  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    alternates: pairedAlternates(locale, "/"),
    openGraph: {
      title: copy.metadataTitle,
      description: copy.metadataDescription,
      url: absoluteLocalizedUrl(locale),
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
    },
  };
}

export async function HomePageContent({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const { home, common } = dictionary;
  const guides = await getAllGuides();
  const homeUrl = absoluteLocalizedUrl(locale);
  const guidedUrl = absoluteLocalizedUrl(locale, "/tests/guided");
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ScreenTestHub",
      inLanguage: locale === "zh" ? "zh-CN" : "en-US",
      url: homeUrl,
      description: home.websiteDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "ScreenTestHub",
      inLanguage: locale === "zh" ? "zh-CN" : "en-US",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: locale === "zh" ? "支持现代浏览器的设备" : "Any device with a modern browser",
      url: guidedUrl,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: home.appDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale === "zh" ? "zh-CN" : "en-US",
      mainEntity: home.faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="page-shell">
        <section className="hero-grid" aria-labelledby="home-heading">
          <div className="hero-copy">
            <p className="eyebrow">{home.eyebrow}</p>
            <h1 id="home-heading">{home.title}</h1>
            <p className="hero-lede">{home.lede}</p>
            <div className="button-row">
              <Link className="button-primary" href={localizePath("/tests/guided", locale)}>
                {home.start} <ArrowRight size={17} />
              </Link>
              <Link className="button-secondary" href="#choose-test">{home.choose}</Link>
            </div>
          </div>
          <ScreenSampler messages={dictionary.sampler} />
        </section>

        <hr className="section-rule" />

        <section id="choose-test" aria-labelledby="symptom-heading">
          <div className="section-heading section-heading-stacked">
            <div><h2 id="symptom-heading">{home.symptomTitle}</h2></div>
            <p>{home.symptomIntro}</p>
          </div>
          <div className="symptom-grid">
            {home.symptoms.map((item, index) => {
              const Icon = symptomIcons[index];
              return (
                <Link className="symptom-link" href={localizePath(item.href, locale)} key={item.href}>
                  <Icon aria-hidden="true" size={20} strokeWidth={1.7} />
                  <span><strong>{item.title}</strong><small>{item.detail}</small></span>
                  <ArrowRight aria-hidden="true" size={18} strokeWidth={1.7} />
                </Link>
              );
            })}
          </div>
        </section>

        <hr className="section-rule" />

        <section className="cta-strip" aria-labelledby="guided-heading">
          <div><h2 id="guided-heading">{home.guidedTitle}</h2><p>{home.guidedIntro}</p></div>
          <Link className="button-primary" href={localizePath("/tests/guided", locale)}>
            {home.guidedCta} <ArrowRight size={17} />
          </Link>
        </section>

        <hr className="section-rule" />

        <section aria-labelledby="method-heading">
          <div className="section-heading">
            <div><p className="eyebrow">{home.methodEyebrow}</p><h2 id="method-heading">{home.methodTitle}</h2></div>
            <p>{home.methodIntro}</p>
          </div>
          <ol className="step-list">
            {home.steps.map((step) => (
              <li key={step.title}>
                <span className="step-index">{step.label}</span>
                <h3>{step.title}</h3><p>{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <hr className="section-rule" />

        <section aria-labelledby="guides-heading">
          <div className="editorial-heading"><h2 id="guides-heading">{home.guidesTitle}</h2><p>{home.guidesIntro}</p></div>
          <div className="guide-stack">
            {guides.map((guide) => (
              <Link className="guide-row" href={`/guides/${guide.slug}`} key={guide.slug}>
                <ArrowRight aria-hidden="true" size={17} strokeWidth={1.7} />
                <h3 lang="en">{guide.title}</h3>
                <span>{guide.readingMinutes} {common.minutesShort}{locale === "zh" ? ` / ${common.englishContent}` : ""}</span>
              </Link>
            ))}
          </div>
          <div className="button-row">
            <Link className="button-secondary" href={localizePath("/guides", locale)}>
              {home.allGuides} <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <hr className="section-rule" />

        <section aria-labelledby="faq-heading">
          <div className="faq-heading"><h2 id="faq-heading">{home.faqTitle}</h2><p>{home.faqIntro}</p></div>
          <div className="faq-list">
            {home.faqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
          </div>
        </section>
      </div>
    </>
  );
}
