import type { Metadata } from "next";
import Link from "@/components/site/no-prefetch-link";
import { ArrowRight, Monitor, Timer, Zap } from "lucide-react";

import { HdrTest } from "@/components/tests/HdrTest";
import styles from "@/components/tests/ScreenTests.module.css";
import { StartFullscreenButton } from "@/components/tests/StartFullscreenButton";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { pairedAlternates } from "@/lib/localized-metadata";

export const dynamic = "force-static";

const canonicalUrl = absoluteUrl("/hdr-test");
const title = `HDR Test Online: Check Monitor HDR and Wide Color Gamut | ${SITE_NAME}`;
const description =
  "Run an HDR test online to check the browser's reported dynamic range, inspect shadow and highlight detail, and compare sRGB with wide-gamut colors.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "hdr test",
    "hdr test online",
    "monitor hdr test",
    "oled hdr test",
    "hdr screen test",
  ],
  alternates: pairedAlternates("en", "/hdr-test"),
  openGraph: {
    title,
    description,
    type: "website",
    url: canonicalUrl,
    siteName: SITE_NAME,
  },
};

const faqs = [
  {
    question: "Why does the test report SDR when my monitor supports HDR?",
    answer:
      "The browser sees the complete output path, not the monitor label alone. Enable HDR in the operating system, move the browser window to the HDR display, check the cable and GPU output, then reload. A capable display can still be reported as SDR when HDR is disabled or the browser cannot expose the signal.",
  },
  {
    question: "Why does the Windows desktop look gray after HDR is enabled?",
    answer:
      "Most desktop pages are SDR and Windows must tone-map them inside an HDR output. That conversion can make SDR white, contrast, or color look different. Adjust the Windows SDR content brightness control and compare with HDR video or a game before judging the display.",
  },
  {
    question: "Can a website measure my monitor's peak brightness in nits?",
    answer:
      "No. A webpage cannot turn what your eyes see into an accurate luminance measurement. Peak brightness, black level, contrast, and VESA DisplayHDR performance require a meter and controlled patterns. This tool only reports browser capability signals and shows visual checks.",
  },
  {
    question: "Can this HDR test identify HDR10, HDR10+, or Dolby Vision?",
    answer:
      "No. The browser media query reports a high dynamic range environment, not the negotiated video format or display certification. HDR10, HDR10+, Dolby Vision, and HLG depend on the media, application, operating system, connection, and hardware chain.",
  },
  {
    question: "Does a 24-bit browser color buffer mean my panel is not 10-bit?",
    answer:
      "No. The browser value commonly describes its RGB color buffer as 8 bits per channel, or 24 bits total. It does not reveal whether the physical panel is native 10-bit, 8-bit plus FRC, or how the GPU sends the final signal.",
  },
  {
    question: "What should I look for on OLED and Mini LED displays?",
    answer:
      "On OLED, compare near-black separation and watch whether a large white area dims because of automatic brightness limiting. On Mini LED, inspect the small bright window for halos and check whether shadow detail changes when local dimming settings change.",
  },
  {
    question: "Why do the sRGB and Display P3 color blocks look the same?",
    answer:
      "The display may be limited to sRGB, wide color may be disabled, or the browser and color profile may map both samples into a similar visible result. A visible difference is useful evidence, but no difference is not proof of a narrow-gamut panel.",
  },
] as const;

const observations = [
  {
    signal: "High dynamic range reported",
    meaning:
      "The browser and current output device advertise an HDR-capable environment. This is not a brightness or certification measurement.",
  },
  {
    signal: "The first dark steps merge into black",
    meaning:
      "Shadow detail may be crushed by black-level, gamma, limited-range, or local-dimming settings.",
  },
  {
    signal: "The brightest steps look identical",
    meaning:
      "Highlight detail may be clipped or compressed by tone mapping and contrast controls.",
  },
  {
    signal: "A glow surrounds the small white window",
    meaning:
      "That can reveal local-dimming bloom on LCD and Mini LED panels. The amount changes with zone count and settings.",
  },
  {
    signal: "Wide-gamut colors look more saturated",
    meaning:
      "The browser, operating system, profile, and display are preserving at least some color outside the chosen sRGB sample.",
  },
] as const;

const relatedTools = [
  { href: "/tests/color", label: "Monitor Color Test" },
  { href: "/tests/gradient", label: "Gradient Banding Test" },
  { href: "/tests/backlight-bleed", label: "Backlight Bleed Test" },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#application`,
      name: "ScreenTestHub HDR Test Online",
      description,
      url: canonicalUrl,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "A modern browser with JavaScript. Fullscreen is optional.",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "HDR Test Online", item: canonicalUrl },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export default function HdrTestPage() {
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
          <span aria-current="page">HDR</span>
        </nav>
        <div className={styles.metaLine}>
          <span className={styles.metaItem}>
            <Zap aria-hidden="true" size={17} strokeWidth={1.8} />
            Three test modes
          </span>
          <span className={styles.metaItem}>
            <Timer aria-hidden="true" size={17} strokeWidth={1.8} />
            About 2 minutes
          </span>
          <span className={styles.metaItem}>
            <Monitor aria-hidden="true" size={17} strokeWidth={1.8} />
            No download
          </span>
        </div>
        <h1 className={`${styles.title} ${styles.testTitle}`}>HDR Test Online</h1>
        <div className={styles.headerStartAction}>
          <StartFullscreenButton label="Start HDR Test" slug="hdr-test" />
        </div>
      </header>

      <section
        aria-label="HDR Test Online tool"
        className={`${styles.testMount} ${styles.toolTestMount}`}
        id="hdr-test-tool"
      >
        <HdrTest />
      </section>

      <div className={styles.contentStack}>
        <section aria-labelledby="hdr-how-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="hdr-how-title">How to use this HDR test</h2>
          <ul className={styles.preparationList}>
            <li>Enable HDR in the operating system and move this window onto the display you want to check.</li>
            <li>Enter fullscreen, then use the buttons, arrow keys, or the test surface to switch modes.</li>
            <li>Run Dynamic range in a dim room at the HDR brightness setting you normally use.</li>
            <li>Compare the paired gamut colors without changing profiles or display presets during the test.</li>
          </ul>
        </section>

        <section aria-labelledby="hdr-look-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="hdr-look-title">What to look for</h2>
          <dl className={styles.observationList}>
            {observations.map((item) => (
              <div className={styles.observationRow} key={item.signal}>
                <dt>{item.signal}</dt>
                <dd>{item.meaning}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.limitation}>
            This HDR screen test cannot measure nits, black level, color accuracy,
            native panel bit depth, HDR format, or DisplayHDR certification. The
            dynamic-range and color-gamut signals describe what the browser and
            current output environment report.
          </p>
          <a
            className={styles.referenceLink}
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/dynamic-range"
            rel="noreferrer"
            target="_blank"
          >
            Read how browsers report dynamic range
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
          </a>
        </section>

        <section aria-labelledby="hdr-faq-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="hdr-faq-title">HDR test FAQ</h2>
          <div className={styles.testFaqList}>
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="hdr-related-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="hdr-related-title">Related tools</h2>
          <div className={styles.relatedList}>
            {relatedTools.map((tool) => (
              <Link className={styles.relatedLink} href={tool.href} key={tool.href}>
                <span>{tool.label}</span>
                <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
