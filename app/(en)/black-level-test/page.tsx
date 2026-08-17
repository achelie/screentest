import type { Metadata } from "next";
import { ArrowRight, Eye, Monitor, SlidersHorizontal } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import Link from "@/components/site/no-prefetch-link";
import { BlackLevelTest } from "@/components/tests/BlackLevelTest";
import styles from "@/components/tests/ScreenTests.module.css";
import { StartFullscreenButton } from "@/components/tests/StartFullscreenButton";
import { pairedAlternates } from "@/lib/localized-metadata";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

const canonicalUrl = absoluteUrl("/black-level-test");
const title = `Black Level Test Online: Check Shadow Detail | ${SITE_NAME}`;
const description =
  "Run a fullscreen black level test with pure black, RGB 1-10 near-black steps, a dark ramp, and embedded shadow patterns to check black crush and shadow detail.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "black level test",
    "near black test",
    "black crush test",
    "shadow detail test",
    "PLUGE test online",
  ],
  alternates: pairedAlternates("en", "/black-level-test"),
  openGraph: {
    title,
    description,
    type: "website",
    url: canonicalUrl,
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const observations = [
  {
    signal: "RGB 1 through 10 all disappear into black",
    meaning:
      "Shadow detail may be crushed by the black-level setting, gamma, image processing, or a Full versus Limited output-range mismatch. The panel may also have weak near-black separation.",
  },
  {
    signal: "Every step is easy to see and black looks gray",
    meaning:
      "The black floor may be raised. Check room reflections, the monitor black-level control, and whether one device expects Limited range while another sends Full range.",
  },
  {
    signal: "The four embedded patches appear but the fine stripes vanish",
    meaning:
      "The display can separate larger dark areas but may smooth or clip very fine low-level detail through processing, dimming, or limited precision.",
  },
  {
    signal: "Corners glow only when your head moves",
    meaning:
      "That behavior is closer to viewing-angle glow than a global black-level setting. Use the Backlight Bleed Test to inspect the position and movement of the glow.",
  },
  {
    signal: "The result changes when local dimming is enabled",
    meaning:
      "Local dimming can deepen large black areas while changing tiny near-black patches. Record both passes instead of treating either one as a measured panel score.",
  },
] as const;

const faqs = [
  {
    question: "How many near-black blocks should I be able to see?",
    answer:
      "There is no universal pass number for every monitor, room, and viewing mode. Count the blocks you can see consistently, change one setting, and compare again. The pattern is useful for relative adjustment, not a panel grade.",
  },
  {
    question: "What is black crush?",
    answer:
      "Black crush happens when different dark input values are rendered as the same black output. Hair, fabric, game shadows, and dark movie scenes then lose detail even though the source still contains it.",
  },
  {
    question: "Should HDR be off for this test?",
    answer:
      "Yes for a controlled SDR pass. HDR tone mapping can redistribute near-black values and make results vary by operating system, browser, and display mode. Test HDR separately with HDR content and the HDR tool.",
  },
  {
    question: "Can RGB Full and Limited change the result?",
    answer:
      "Yes. A mismatch between 0-255 Full range and 16-235 Limited range can lift black or clip shadows. Check that the graphics output, monitor, television, receiver, and console use compatible range settings.",
  },
  {
    question: "Should I change brightness or contrast first?",
    answer:
      "Start from the display preset and black-level or brightness guidance for your model. On many desktop monitors, the brightness control mainly changes backlight output rather than the digital black point. Change one control at a time and keep notes.",
  },
  {
    question: "Is this the same as a backlight bleed test?",
    answer:
      "No. Both use black, but the Backlight Bleed Test focuses on fixed bright edges, cloudy corners, and IPS glow. This tool adds precise near-black steps and embedded shadow patterns to check tonal separation.",
  },
  {
    question: "Can this page measure my monitor's black luminance or contrast ratio?",
    answer:
      "No. A browser can send RGB values, but it cannot measure the light leaving the panel. Black luminance, native contrast, and calibration accuracy require a meter and controlled conditions.",
  },
] as const;

const relatedTools = [
  { href: "/monitor-color-calibration", label: "Monitor Color Calibration" },
  { href: "/tests/backlight-bleed", label: "Backlight Bleed Test" },
  { href: "/tests/grayscale", label: "Screen Uniformity Test" },
  { href: "/hdr-test", label: "HDR Test Online" },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#application`,
      name: "ScreenTestHub Black Level Test Online",
      description,
      url: canonicalUrl,
      inLanguage: "en",
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
        { "@type": "ListItem", position: 3, name: "Black Level Test", item: canonicalUrl },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      inLanguage: "en",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export default function BlackLevelTestPage() {
  return (
    <div className={styles.page}>
      <JsonLd data={structuredData} />

      <header className={`${styles.pageHeader} ${styles.toolPageHeader}`}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/tests">Screen tests</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Black level</span>
        </nav>
        <div className={styles.metaLine}>
          <span className={styles.metaItem}>
            <Eye aria-hidden="true" size={17} strokeWidth={1.8} />
            Three exact RGB patterns
          </span>
          <span className={styles.metaItem}>
            <SlidersHorizontal aria-hidden="true" size={17} strokeWidth={1.8} />
            SDR visual check
          </span>
          <span className={styles.metaItem}>
            <Monitor aria-hidden="true" size={17} strokeWidth={1.8} />
            No download
          </span>
        </div>
        <h1 className={`${styles.title} ${styles.testTitle}`}>
          Black Level Test Online
        </h1>
        <p className={styles.lead}>
          Check pure black, near-black separation, and shadow detail without a video or image download.
        </p>
        <div className={styles.headerStartAction}>
          <StartFullscreenButton
            label="Start Black Level Test"
            slug="black-level-test"
          />
        </div>
      </header>

      <section
        aria-label="Black Level Test Online tool"
        className={`${styles.testMount} ${styles.toolTestMount}`}
        id="black-level-test-tool"
      >
        <BlackLevelTest />
      </section>

      <div className={styles.contentStack}>
        <section aria-labelledby="black-level-how-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="black-level-how-title">
            How to run the black level test
          </h2>
          <ul className={styles.preparationList}>
            <li>Use an SDR picture mode, set browser zoom to 100%, and move the window to the display you want to test.</li>
            <li>Keep the brightness you normally use. Turn off Night Light, automatic color temperature, and dynamic contrast for the first pass.</li>
            <li>Dim the room, enter fullscreen, hide the controls, and let your eyes adapt to the pure-black screen for about 30 seconds.</li>
            <li>Switch to Near-black 1-10 and count only the patches you can separate consistently. Then inspect the 0-20 ramp for a smooth start out of black.</li>
            <li>Finish with Black depth. Look for four center patches, the fine horizontal stripe field, and both comparison squares. If the display has local dimming, repeat once with it enabled.</li>
          </ul>
        </section>

        <section aria-labelledby="black-level-look-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="black-level-look-title">
            What the patterns can tell you
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
            This page outputs fixed SDR RGB values. It cannot measure black luminance, contrast ratio, panel technology, gamma accuracy, or the light that reaches your eyes. Use the result to compare reversible settings, not to assign a score or make a warranty decision.
          </p>
        </section>

        <section aria-labelledby="black-level-faq-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="black-level-faq-title">
            Black level test FAQ
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

        <section aria-labelledby="black-level-related-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="black-level-related-title">
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
