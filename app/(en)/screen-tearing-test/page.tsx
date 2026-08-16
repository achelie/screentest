import type { Metadata } from "next";
import Link from "@/components/site/no-prefetch-link";
import { Activity, ArrowRight, Gauge, Monitor } from "lucide-react";

import { ScreenTearingTest } from "@/components/tests/ScreenTearingTest";
import styles from "@/components/tests/ScreenTests.module.css";
import { StartFullscreenButton } from "@/components/tests/StartFullscreenButton";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { pairedAlternates } from "@/lib/localized-metadata";

export const dynamic = "force-static";

const canonicalUrl = absoluteUrl("/screen-tearing-test");
const title = `Screen Tearing Test Online for VSync, FreeSync and G-Sync | ${SITE_NAME}`;
const description =
  "Run a screen tearing test online with moving stripes, layered blocks, and a scrolling checkerboard. Compare VSync, FreeSync, G-Sync, and frame-limit settings.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "screen tearing test",
    "screen tearing test online",
    "monitor tearing test",
    "vsync test",
    "freesync test",
    "g sync test",
  ],
  alternates: pairedAlternates("en", "/screen-tearing-test"),
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
    question: "What does screen tearing look like?",
    answer:
      "A horizontal seam cuts through a moving image, with the content above and below the seam shifted sideways. The seam may stay near one area or jump between frames. It is easiest to spot on sharp vertical edges moving quickly across the screen.",
  },
  {
    question: "Why does my game tear when this browser test looks smooth?",
    answer:
      "Browsers normally send animation through a compositor that synchronizes drawing with the display. A game can use a different fullscreen mode, frame rate, graphics API, and sync path. A clean browser result therefore does not prove the game is tear-free; repeat the comparison inside the game.",
  },
  {
    question: "Why can tearing remain after I enable FreeSync or G-Sync?",
    answer:
      "The game frame rate may be outside the monitor's variable refresh range, a frame limiter may be missing, the game may be on the wrong display, or the driver and monitor settings may not match. Check the complete setup and keep the frame rate inside the display's VRR range.",
  },
  {
    question: "Does a high refresh rate completely remove screen tearing?",
    answer:
      "No. A higher refresh rate makes each torn frame visible for less time, so tearing can be harder to notice, but unsynchronized frame delivery can still produce a seam. VSync or working VRR addresses timing; refresh rate alone does not guarantee synchronization.",
  },
  {
    question: "What is the difference between VSync, VRR, and a frame-rate limit?",
    answer:
      "VSync schedules frame presentation around fixed display refreshes. VRR lets a compatible display vary its refresh timing within a supported range. A frame-rate limit caps how quickly frames are produced. They solve related timing problems but are not interchangeable, and many setups use a combination.",
  },
  {
    question: "How can I tell tearing, stutter, and ghosting apart?",
    answer:
      "Tearing is a sideways break across part of one frame. Stutter makes the whole moving pattern pause or jump. Ghosting leaves a trail, dark smear, or bright halo behind moving edges. Use the Motion Test when the edge itself looks smeared rather than split.",
  },
  {
    question: "Can a webpage verify VRR or turn VSync off?",
    answer:
      "No. A webpage cannot reliably disable browser compositor synchronization or certify that FreeSync or G-Sync is active. This tool provides repeatable motion for visual comparison, while the final check should use the game, driver overlay, and monitor indicators you actually rely on.",
  },
] as const;

const observations = [
  {
    signal: "One horizontal section shifts sideways",
    meaning:
      "That is the closest visual match to tearing: different parts of the screen appear to show different moments of the movement.",
  },
  {
    signal: "The entire pattern pauses or jumps",
    meaning:
      "That points more toward frame drops or stutter than tearing. Watch whether every edge stops at the same time.",
  },
  {
    signal: "Moving edges leave a trail or bright halo",
    meaning:
      "That is ghosting or overshoot, not a synchronization seam. Open the Motion Test to inspect pixel response more clearly.",
  },
  {
    signal: "The browser test stays perfectly smooth",
    meaning:
      "The browser compositor may be hiding the problem. This result cannot prove that a game, capture device, or other application will be tear-free.",
  },
] as const;

const relatedTools = [
  { href: "/tests/motion", label: "Monitor Ghosting Test" },
  { href: "/tests/guided", label: "Guided Monitor Test" },
  { href: "/hdr-test", label: "HDR Test Online" },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#application`,
      name: "ScreenTestHub Screen Tearing Test Online",
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
        { "@type": "ListItem", position: 2, name: "Screen Tearing Test Online", item: canonicalUrl },
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

export default function ScreenTearingTestPage() {
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
          <span aria-current="page">Screen tearing</span>
        </nav>
        <div className={styles.metaLine}>
          <span className={styles.metaItem}>
            <Activity aria-hidden="true" size={17} strokeWidth={1.8} />
            Three motion patterns
          </span>
          <span className={styles.metaItem}>
            <Gauge aria-hidden="true" size={17} strokeWidth={1.8} />
            240–960 px/s
          </span>
          <span className={styles.metaItem}>
            <Monitor aria-hidden="true" size={17} strokeWidth={1.8} />
            No download
          </span>
        </div>
        <h1 className={`${styles.title} ${styles.testTitle}`}>
          Screen Tearing Test Online
        </h1>
        <div className={styles.headerStartAction}>
          <StartFullscreenButton
            label="Start Screen Tearing Test"
            slug="screen-tearing-test"
          />
        </div>
      </header>

      <section
        aria-label="Screen Tearing Test Online tool"
        className={`${styles.testMount} ${styles.toolTestMount}`}
        id="screen-tearing-test-tool"
      >
        <ScreenTearingTest />
      </section>

      <div className={styles.contentStack}>
        <section aria-labelledby="tearing-how-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="tearing-how-title">
            How to use this screen tearing test
          </h2>
          <ul className={styles.preparationList}>
            <li>Enter fullscreen, choose Stripe Tracking, and switch to Fast so sharp vertical edges cross the whole panel.</li>
            <li>Watch for a horizontal break, then repeat with Block Layers and Checker Scroll to see whether it returns.</li>
            <li>Test once with your current sync settings and again after changing VSync, FreeSync, G-Sync, or the game frame limit.</li>
            <li>Keep browser zoom, display refresh rate, and the monitor holding this window unchanged between comparisons.</li>
          </ul>
        </section>

        <section aria-labelledby="tearing-look-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="tearing-look-title">
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
            The frame estimate reports how often this page receives animation callbacks. It is not a monitor refresh-rate measurement and cannot prove that VRR is active. Browsers usually synchronize page composition, so they cannot force VSync off for a certified tearing test. Always recheck the same setting in the game or application where the problem appears.
          </p>
          <div className={styles.referenceLinks}>
            <a
              className={styles.referenceLink}
              href="https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame"
              rel="noreferrer"
              target="_blank"
            >
              How browser animation timing works
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </a>
            <a
              className={styles.referenceLink}
              href="https://screentester.io/screen-tearing-test/"
              rel="noreferrer"
              target="_blank"
            >
              Review the reference test concept
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </a>
          </div>
        </section>

        <section aria-labelledby="tearing-faq-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="tearing-faq-title">
            Screen tearing test FAQ
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

        <section aria-labelledby="tearing-related-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="tearing-related-title">
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
