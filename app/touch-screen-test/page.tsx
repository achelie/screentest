import type { Metadata } from "next";
import {
  ArrowRight,
  Hand,
  ScanLine,
  Smartphone,
} from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import Link from "@/components/site/no-prefetch-link";
import styles from "@/components/touch/TouchScreenTest.module.css";
import { TouchScreenTest } from "@/components/touch/TouchScreenTest";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

const canonicalUrl = absoluteUrl("/touch-screen-test");
const pageTitle = `Touch Screen Test Online - Phone Touchscreen Checker | ${SITE_NAME}`;
const openGraphTitle = "Touch Screen Test Online - Phone Touchscreen Checker";
const description =
  "Run a free touch screen test online to find dead zones, ghost touches, missed swipes, and multi-touch issues on phones, tablets, and touchscreen laptops.";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: openGraphTitle,
    description,
    type: "website",
    url: canonicalUrl,
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1536,
        height: 1024,
        alt: "ScreenTestHub display test pattern",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: openGraphTitle,
    description,
    images: ["/opengraph-image.png"],
  },
};

const FAQS = [
  {
    question: "How can I find a touchscreen dead zone?",
    answer:
      "Run the grid twice and swipe slowly through every edge and corner. A dead zone is more likely when the same connected group of cells stays blank on both passes. Restart the device and repeat the test before assuming the digitizer is faulty.",
  },
  {
    question: "Can this test confirm ghost touch?",
    answer:
      "No browser test can prove the cause. If touch points appear while the screen is clean, dry, unplugged, and untouched, repeat the test after a restart. Persistent unexpected input across apps is a reason to contact the manufacturer or a repair technician.",
  },
  {
    question: "Can a screen protector cause ghost touches?",
    answer:
      "It can. Dirt, trapped moisture, lifting edges, cracks, or a poorly fitted protector can affect capacitive input. Clean and dry the screen first. If the issue continues, test without the protector only when it can be removed safely.",
  },
  {
    question: "Why does ghost touch happen only while charging?",
    answer:
      "Community reports often link charging-only input problems to a cable, charger, port, or grounding issue. Test while unplugged, then try a trusted charger and cable. Stop using any charger that becomes unusually hot, damaged, or electrically unsafe.",
  },
  {
    question: "Can water or damp fingers affect the result?",
    answer:
      "Yes. Water droplets and damp fingers can register as extra capacitive input or make swipes inconsistent. Dry the screen and hands completely before repeating the test.",
  },
  {
    question: "What should I do if the same area keeps failing?",
    answer:
      "Restart the device, remove the case if it presses on the display, clean the screen, and repeat the test unplugged. If the same area still fails in multiple apps, save the result and contact support or a repair technician.",
  },
  {
    question: "How many simultaneous touch points does my screen support?",
    answer:
      "Place several fingers on the grid and watch Peak touches. The displayed number is what the browser and operating system report during this session, which may be lower than the digitizer's advertised hardware maximum.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#application`,
      name: "ScreenTestHub Touch Screen Test",
      description,
      url: canonicalUrl,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements:
        "A modern browser with Pointer Events. Fullscreen is optional.",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: FAQS.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      })),
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
          name: "Touch Screen Test",
          item: canonicalUrl,
        },
      ],
    },
  ],
};

const observations = [
  {
    signal: "Continuous blank area",
    meaning: "The same cluster of cells stays untouched after repeated passes.",
  },
  {
    signal: "Broken swipe path",
    meaning: "A line repeatedly stops or skips in one location.",
  },
  {
    signal: "Unexpected points",
    meaning: "The tool receives input while your hands are off the screen.",
  },
  {
    signal: "Edge or corner misses",
    meaning: "Taps near the bezel fail while the center works.",
  },
  {
    signal: "Multi-touch dropout",
    meaning:
      "Live touches falls below the number of fingers placed on the screen.",
  },
] as const;

const relatedTools = [
  {
    href: "/tests/guided",
    title: "Guided Screen Test",
    description: "Run six display checks in one pass.",
    icon: ScanLine,
  },
  {
    href: "/tests/dead-pixel",
    title: "Dead Pixel Test",
    description: "Check for pixels that stay dark or stuck.",
    icon: Hand,
  },
  {
    href: "/tests/color",
    title: "Monitor Color Test",
    description: "Inspect solid RGB and CMY fields.",
    icon: Smartphone,
  },
] as const;

export default function TouchScreenTestPage() {
  return (
    <div className={styles.page}>
      <JsonLd data={structuredData} />

      <header className={styles.pageHeader}>
        <h1>Touch Screen Test Online</h1>
        <p>
          Check every part of your phone, tablet, or touchscreen laptop for missed taps and broken touch paths.
        </p>
      </header>

      <TouchScreenTest />

      <section aria-labelledby="touch-how-title" className={styles.contentSection}>
        <h2 id="touch-how-title">How to use this touch screen test</h2>
        <p className={styles.sectionIntro}>
          This phone touch test takes one careful pass, then a second pass if anything looks suspicious.
        </p>
        <ul className={styles.instructionList}>
          <li>Open the test and enter fullscreen when available.</li>
          <li>
            Slide one finger across the entire grid, including every edge and corner.
          </li>
          <li>
            Place several fingers on the screen to check simultaneous touch reporting.
          </li>
          <li>
            Finish the test and inspect any continuous blank area or broken path.
          </li>
        </ul>
      </section>

      <section aria-labelledby="touch-signals-title" className={styles.contentSection}>
        <h2 id="touch-signals-title">What to look for</h2>
        <dl className={styles.observationList}>
          {observations.map(({ signal, meaning }) => (
            <div key={signal}>
              <dt>{signal}</dt>
              <dd>{meaning}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.limitation}>
          This touchscreen checker observes browser input. It cannot identify the failed physical component or certify hardware.
        </p>
      </section>

      <section aria-labelledby="touch-faq-title" className={styles.contentSection}>
        <h2 id="touch-faq-title">Touch screen test FAQ</h2>
        <div className={styles.faqList}>
          {FAQS.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="touch-related-title" className={styles.contentSection}>
        <h2 id="touch-related-title">Related tools</h2>
        <div className={styles.relatedList}>
          {relatedTools.map(({ href, title, description: subtitle, icon: Icon }) => (
            <Link className={styles.relatedLink} href={href} key={href}>
              <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
              <span>
                <strong>{title}</strong>
                <small>{subtitle}</small>
              </span>
              <ArrowRight aria-hidden="true" size={19} strokeWidth={1.8} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
