import type { Metadata } from "next";
import {
  ArrowRight,
  CircleDot,
  Palette,
  ScanSearch,
} from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import Link from "@/components/site/no-prefetch-link";
import styles from "@/components/touch/TouchScreenTest.module.css";
import { TouchScreenTest } from "@/components/touch/TouchScreenTest";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

const canonicalUrl = absoluteUrl("/touch-screen-test/");
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
  },
};

const FAQS = [
  {
    question: "How can I find a touchscreen dead zone?",
    answer:
      "Run the grid twice and swipe slowly through every edge and corner. A dead zone is more likely when the same connected group of cells stays blank on both passes. Restart the device and repeat the test before assuming the touch hardware is faulty.",
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
      "Place several fingers on the grid and watch Peak touches. The displayed number is what the browser and operating system report during this session, which may be lower than the screen's advertised hardware maximum.",
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
        "A modern browser with Pointer Events. Fullscreen support is optional.",
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
    meaning:
      "A connected patch that stays empty on repeated passes is more suspicious than one isolated missed cell.",
  },
  {
    signal: "Broken swipe path",
    meaning:
      "A clean swipe should leave a continuous trail. Repeated gaps in the same place can point to missed input.",
  },
  {
    signal: "Unexpected points",
    meaning:
      "Marks that appear without a finger on the screen may be ghost input. Clean, dry, unplug, and test again.",
  },
  {
    signal: "Edge or corner misses",
    meaning:
      "Slow down at the bezel. A case, protector, or grip can make the outermost cells harder to reach.",
  },
  {
    signal: "Multi-touch dropout",
    meaning:
      "Keep several fingers down and move them. A falling live count can reveal a touch that stopped reporting.",
  },
] as const;

const relatedTools = [
  {
    href: "/tests/guided",
    title: "Guided Screen Test",
    description: "Run the full display check in one short sequence.",
    icon: ScanSearch,
  },
  {
    href: "/tests/dead-pixel",
    title: "Dead Pixel Test",
    description: "Use solid colors to spot pixels that stay stuck or dark.",
    icon: CircleDot,
  },
  {
    href: "/tests/color",
    title: "Monitor Color Test",
    description: "Check color channels, white, and black across the panel.",
    icon: Palette,
  },
] as const;

export default function TouchScreenTestPage() {
  return (
    <div className={styles.page}>
      <JsonLd data={structuredData} />

      <header className={styles.pageHeader}>
        <h1>Touch Screen Test Online</h1>
        <p className={styles.lead}>
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
          <li>
            <strong>Open the test</strong>
            <span>Press Start Touch Test, then enter fullscreen if you want more room.</span>
          </li>
          <li>
            <strong>Cover the whole grid</strong>
            <span>Slide one finger through every grid cell, including all edges and corners.</span>
          </li>
          <li>
            <strong>Check simultaneous touches</strong>
            <span>Place several fingers on the grid and move them while watching the live and peak counts.</span>
          </li>
          <li>
            <strong>Read the result</strong>
            <span>Press Finish and inspect continuous blank areas or a broken touch path.</span>
          </li>
        </ul>
      </section>

      <section aria-labelledby="touch-signals-title" className={styles.contentSection}>
        <h2 id="touch-signals-title">What to look for</h2>
        <dl className={styles.observationList}>
          {observations.map(({ signal, meaning }) => (
            <div className={styles.observationRow} key={signal}>
              <dt>{signal}</dt>
              <dd>{meaning}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.limitation}>
          This touchscreen checker observes input reported to the browser. It cannot identify which physical component failed or certify that the hardware is fault-free.
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
