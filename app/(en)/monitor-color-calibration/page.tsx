import type { Metadata } from "next";
import Link from "@/components/site/no-prefetch-link";
import { ArrowRight, Monitor, Palette, SlidersHorizontal } from "lucide-react";

import { MonitorColorCalibration } from "@/components/tests/MonitorColorCalibration";
import styles from "@/components/tests/ScreenTests.module.css";
import { StartFullscreenButton } from "@/components/tests/StartFullscreenButton";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { pairedAlternates } from "@/lib/localized-metadata";

export const dynamic = "force-static";

const canonicalUrl = absoluteUrl("/monitor-color-calibration");
const title = `Monitor Color Calibration Online: Adjust Gamma and White Balance | ${SITE_NAME}`;
const description =
  "Use four SDR monitor color calibration patterns to adjust black and white levels, neutral grayscale, gamma 2.2, and color separation without installing software.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "monitor color calibration",
    "monitor color calibration online",
    "calibrate monitor colors",
    "screen color calibration",
    "monitor calibration test",
  ],
  alternates: pairedAlternates("en", "/monitor-color-calibration"),
  openGraph: {
    title,
    description,
    type: "website",
    url: canonicalUrl,
    siteName: SITE_NAME,
  },
};

const observations = [
  {
    signal: "The 1% patch disappears with 0%",
    meaning:
      "Shadow detail is being crushed. Raise the monitor black level or choose a less aggressive contrast preset until 1% is only just visible.",
  },
  {
    signal: "The 99% patch merges into 100%",
    meaning:
      "Highlights are clipping. Reduce contrast until the last bright steps separate without making ordinary white look dull.",
  },
  {
    signal: "Every gray patch carries the same color tint",
    meaning:
      "The preset or RGB gains may be off. Start from sRGB, Standard, or 6500K, then make small RGB gain changes if the monitor provides them.",
  },
  {
    signal: "Only one part of a gray patch changes color",
    meaning:
      "That is more likely panel uniformity than a global white-balance setting. RGB gain cannot repair a local patch without affecting the rest of the screen.",
  },
  {
    signal: "Color steps merge near full saturation",
    meaning:
      "A vivid or enhancement mode may be clipping channels. Compare a neutral preset before reducing color globally.",
  },
] as const;

const faqs = [
  {
    question: "Can a website really calibrate my monitor?",
    answer:
      "It can provide repeatable patterns while you adjust the monitor, but it cannot measure the light leaving the panel. Treat this as guided visual adjustment. Verified calibration requires a colorimeter or spectrophotometer and profiling software.",
  },
  {
    question: "Which preset, white point, and gamma should I use for SDR?",
    answer:
      "Start with the monitor's sRGB or Standard preset, a 6500K or D65 option, and gamma 2.2 for general web and desktop work. Those labels are starting points, not proof that the display reaches the target accurately.",
  },
  {
    question: "Why do two monitors still show different white after calibration?",
    answer:
      "Their backlights, panel types, age, brightness, profiles, viewing angles, and ambient light can differ. Match brightness before judging color. Exact agreement normally requires measuring and profiling each display separately.",
  },
  {
    question: "Should I turn off HDR, Night Light, and automatic brightness?",
    answer:
      "Yes for this SDR pass. Turn off HDR, Night Light, blue-light filters, automatic color temperature, adaptive brightness, and dynamic contrast. They change the image while you are trying to establish a stable baseline.",
  },
  {
    question: "Can this monitor calibration test create an ICC profile?",
    answer:
      "No. An ICC profile describes measured device behavior. A browser pattern cannot collect those measurements or install a system profile. Use Windows display calibration, the macOS Display Calibrator Assistant, or the software supplied with a measurement device.",
  },
  {
    question: "When do I need a colorimeter?",
    answer:
      "Use one when color decisions affect printing, client delivery, product photography, grading, or matching several displays. It is also the practical way to verify white point, tone response, luminance, gamut, and color error instead of estimating them by eye.",
  },
  {
    question: "Is calibrating an OLED different from calibrating an LCD?",
    answer:
      "The SDR targets can be the same, but OLED brightness can change with window size and protection features, while LCD results vary with backlight, panel type, and viewing angle. Warm the display, use the normal viewing position, and avoid judging OLED brightness from one tiny white patch alone.",
  },
  {
    question: "Why can RGB gain not fix a colored area on one side?",
    answer:
      "RGB gain changes the entire screen. A tint that appears only in one corner or band is usually a uniformity issue, viewing-angle effect, or local panel variation. Use the Screen Uniformity Test to map it before changing global color controls.",
  },
] as const;

const relatedTools = [
  { href: "/tests/color", label: "Monitor Color Test" },
  { href: "/tests/grayscale", label: "Screen Uniformity Test" },
  { href: "/tests/gradient", label: "Gradient Banding Test" },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#application`,
      name: "ScreenTestHub Monitor Color Calibration Online",
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
        { "@type": "ListItem", position: 2, name: "Screen tests", item: absoluteUrl("/tests") },
        { "@type": "ListItem", position: 3, name: "Monitor Color Calibration", item: canonicalUrl },
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

export default function MonitorColorCalibrationPage() {
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
          <span aria-current="page">Color calibration</span>
        </nav>
        <div className={styles.metaLine}>
          <span className={styles.metaItem}>
            <Palette aria-hidden="true" size={17} strokeWidth={1.8} />
            Four SDR patterns
          </span>
          <span className={styles.metaItem}>
            <SlidersHorizontal aria-hidden="true" size={17} strokeWidth={1.8} />
            OSD guided
          </span>
          <span className={styles.metaItem}>
            <Monitor aria-hidden="true" size={17} strokeWidth={1.8} />
            No download
          </span>
        </div>
        <h1 className={`${styles.title} ${styles.testTitle}`}>
          Monitor Color Calibration Online
        </h1>
        <div className={styles.headerStartAction}>
          <StartFullscreenButton
            label="Start Monitor Color Calibration"
            slug="monitor-color-calibration"
          />
        </div>
      </header>

      <section
        aria-label="Monitor Color Calibration Online tool"
        className={`${styles.testMount} ${styles.toolTestMount}`}
        id="monitor-color-calibration-tool"
      >
        <MonitorColorCalibration />
      </section>

      <div className={styles.contentStack}>
        <section aria-labelledby="calibration-how-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="calibration-how-title">
            How to calibrate your monitor by eye
          </h2>
          <ul className={styles.preparationList}>
            <li>Let the display warm up for 20 to 30 minutes and use the room lighting you normally work in.</li>
            <li>Choose the native resolution, set browser zoom to 100%, and keep the page on the monitor you are adjusting.</li>
            <li>Turn off HDR, Night Light, automatic color temperature, adaptive brightness, and dynamic contrast for this SDR pass.</li>
            <li>Start with sRGB, Standard, or a 6500K preset, then adjust black and white levels before touching RGB gain.</li>
            <li>Check grayscale, gamma, and color separation in that order. Change one monitor setting at a time.</li>
            <li>Save the result as a separate OSD preset so your HDR or gaming setup is easy to restore.</li>
          </ul>
        </section>

        <section aria-labelledby="calibration-look-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="calibration-look-title">
            What to look for
          </h2>
          <dl className={styles.observationList}>
            {observations.map((item) => (
              <div className={styles.observationRow} key={item.signal}>
                <dt>{item.signal}</dt>
                <dd>{item.meaning}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.limitation}>
            This page sends fixed SDR values to the browser. It cannot measure the white point, luminance, gamut, tone response, native panel bit depth, or color error that reaches your eyes. D65 and gamma 2.2 are setup targets here, not measured results. Professional calibration needs a meter and profiling software.
          </p>
          <div className={styles.referenceLinks}>
            <a className={styles.referenceLink} href="https://www.w3.org/TR/css-color-4/" rel="noreferrer" target="_blank">
              Read the W3C sRGB and D65 definitions
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </a>
            <a className={styles.referenceLink} href="https://support.microsoft.com/en-US/Windows/Hardware/Display-Graphics/change-display-brightness-and-color-in-windows" rel="noreferrer" target="_blank">
              Open Microsoft display color guidance
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </a>
            <a className={styles.referenceLink} href="https://support.apple.com/guide/mac-help/calibrate-your-display-mchlp1109/mac" rel="noreferrer" target="_blank">
              Open Apple Display Calibrator guidance
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </a>
            <Link className={styles.referenceLink} href="/hdr-test">
              Calibrate HDR separately
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </Link>
          </div>
        </section>

        <section aria-labelledby="calibration-faq-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="calibration-faq-title">
            Monitor color calibration FAQ
          </h2>
          <div className={styles.testFaqList}>
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="calibration-related-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="calibration-related-title">
            Related tools
          </h2>
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
