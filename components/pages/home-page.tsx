import type { Metadata } from "next";
import { ArrowRight, CircleDot, Contrast, Gauge, Grid2X2, Moon, Palette } from "lucide-react";

import { ScreenSampler } from "@/components/home/screen-sampler";
import { JsonLd } from "@/components/seo/json-ld";
import Link from "@/components/site/no-prefetch-link";
import {
  absoluteLocalizedUrl,
  getDictionary,
  localeConfig,
  localizePath,
  type Locale,
} from "@/lib/i18n";
import { pairedAlternates } from "@/lib/localized-metadata";
import { getAllBlogPosts } from "@/lib/blog";

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
      locale: localeConfig[locale].ogLocale,
      type: "website",
    },
  };
}

export async function HomePageContent({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const { home, common } = dictionary;
  const posts = await getAllBlogPosts();
  const homeUrl = absoluteLocalizedUrl(locale);
  const guidedUrl = absoluteLocalizedUrl(locale, "/tests/guided");
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ScreenTestHub",
      inLanguage: localeConfig[locale].htmlLang,
      url: homeUrl,
      description: home.websiteDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "ScreenTestHub",
      inLanguage: localeConfig[locale].htmlLang,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: dictionary.testPage.operatingSystem,
      url: guidedUrl,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: home.appDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: localeConfig[locale].htmlLang,
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

        <section aria-labelledby="blog-heading">
          <div className="editorial-heading"><h2 id="blog-heading">{home.blogTitle}</h2><p>{home.blogIntro}</p></div>
          <div className="guide-stack">
            {posts.map((post) => (
              <Link className="guide-row" href={`/blog/${post.slug}`} key={post.slug}>
                <ArrowRight aria-hidden="true" size={17} strokeWidth={1.7} />
                <h3 lang="en">{post.title}</h3>
                <span>{post.readingMinutes} {common.minutesShort}{locale !== "en" ? ` / ${common.englishContent}` : ""}</span>
              </Link>
            ))}
          </div>
          <div className="button-row">
            <Link className="button-secondary" href="/blog">
              {home.allBlog} <ArrowRight size={17} />
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
