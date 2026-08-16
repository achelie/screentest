import type { Metadata } from "next";
import Link from "@/components/site/no-prefetch-link";
import { ArrowRight, Eye, Monitor, ShieldCheck } from "lucide-react";

import { OledBurnInTest } from "@/components/tests/OledBurnInTest";
import styles from "@/components/tests/ScreenTests.module.css";
import { StartFullscreenButton } from "@/components/tests/StartFullscreenButton";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { pairedAlternates } from "@/lib/localized-metadata";

export const dynamic = "force-static";

const canonicalUrl = absoluteUrl("/oled-burn-in-test");
const title = `OLED Burn-In Test Online: Check Image Retention and Uniformity | ${SITE_NAME}`;
const description =
  "Run an OLED burn-in test online with solid colors, low gray screens, moving color bars, and gradient sweeps to check image retention and panel uniformity.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "oled burn in test",
    "oled burn in test online",
    "screen burn in test",
    "monitor burn in test",
    "image retention test",
    "oled screen test",
  ],
  alternates: pairedAlternates("en", "/oled-burn-in-test"),
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
    signal: "A toolbar, logo, HUD, or status bar stays fixed",
    meaning:
      "Compare the same location on low gray, red, green, and blue. A fixed outline that remains while the test content changes may be persistent retention or uneven pixel aging.",
  },
  {
    signal: "Bands or blotches appear only on low gray",
    meaning:
      "This looks more like near-black uniformity, vertical banding, or a dirty-screen pattern. Check it from your normal seat before treating it as a retained image.",
  },
  {
    signal: "The mark moves with the bars or gradient",
    meaning:
      "A trail that follows the moving pattern is more likely browser motion, display response, or overshoot. Compare it with the Monitor Ghosting Test instead.",
  },
  {
    signal: "One tiny point is always dark or bright",
    meaning:
      "That is a pixel-level symptom rather than a burned-in shape. Use the Dead Pixel Test to check the point against black, white, red, green, and blue.",
  },
  {
    signal: "The outline fades after ordinary moving content",
    meaning:
      "That behavior is more consistent with temporary image retention. Let the display rest and complete its normal automatic panel-care cycle before checking again.",
  },
] as const;

const faqs = [
  {
    question: "What is the difference between OLED burn-in and image retention?",
    answer:
      "Image retention is a temporary afterimage that can fade after the content changes or the display rests. Burn-in describes a persistent brightness or color difference caused by uneven pixel aging. Recheck the same location after normal content and the display's routine care cycle.",
  },
  {
    question: "How long should I run this OLED burn-in test?",
    answer:
      "Two to five minutes is enough for a careful pass through low gray, primary colors, moving bars, and gradients. This tool stops after five continuous minutes and shows black until you choose to resume.",
  },
  {
    question: "Should I set OLED brightness to 100 percent?",
    answer:
      "No. Start with the brightness and picture preset you use every day. Maximum brightness can exaggerate small differences and adds unnecessary panel stress without making the result more representative of normal use.",
  },
  {
    question: "Should I test a new OLED monitor, TV, or phone?",
    answer:
      "A short pass during the return window can document dead pixels, tint, banding, and uniformity. Use normal brightness, inspect from the usual viewing position, and confirm anything suspicious in ordinary content before deciding what to do.",
  },
  {
    question: "Can LCD screens show image retention?",
    answer:
      "Yes, some LCD panels can show temporary image persistence, although it is different from OLED pixel aging. The same solid colors and gray screens can help locate it, and the Backlight Bleed Test remains the better tool for bright LCD edges or corners.",
  },
  {
    question: "When should I run Pixel Refresh or Panel Care?",
    answer:
      "Let the display complete its normal automatic maintenance first. If a visible afterimage remains in ordinary content, follow the instructions for your exact model before starting a manual refresh.",
  },
  {
    question: "Why should I avoid repeating a manual panel refresh?",
    answer:
      "A deep manual refresh is a maintenance process, not a test pattern to run repeatedly. Some manufacturers warn that excessive manual refreshes can affect panel life. Use the automatic cycle normally and follow the model-specific support guide.",
  },
  {
    question: "Does an OLED warranty cover burn-in?",
    answer:
      "Coverage varies by brand, model, country, usage type, and warranty plan. Save photos, note when the mark appears, keep the test conditions realistic, and check the written terms or contact the manufacturer while the return or warranty window is open.",
  },
  {
    question: "What should I do if the same mark remains after testing?",
    answer:
      "Photograph it on several solid colors with locked camera exposure if possible, then recheck after normal moving content and the display's scheduled care cycle. If it remains visible during ordinary use, contact the seller or manufacturer with the model, usage history, and photos.",
  },
] as const;

const relatedTools = [
  { href: "/tests/grayscale", label: "Screen Uniformity Test" },
  { href: "/tests/dead-pixel", label: "Dead Pixel Test" },
  { href: "/hdr-test", label: "HDR Test Online" },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#application`,
      name: "ScreenTestHub OLED Burn-In Test Online",
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
        { "@type": "ListItem", position: 3, name: "OLED Burn-In Test", item: canonicalUrl },
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

export default function OledBurnInTestPage() {
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
          <span aria-current="page">OLED burn-in</span>
        </nav>
        <div className={styles.metaLine}>
          <span className={styles.metaItem}>
            <Eye aria-hidden="true" size={17} strokeWidth={1.8} />
            Four test modes
          </span>
          <span className={styles.metaItem}>
            <ShieldCheck aria-hidden="true" size={17} strokeWidth={1.8} />
            Five-minute safety stop
          </span>
          <span className={styles.metaItem}>
            <Monitor aria-hidden="true" size={17} strokeWidth={1.8} />
            OLED, AMOLED, and LCD
          </span>
        </div>
        <h1 className={`${styles.title} ${styles.testTitle}`}>
          OLED Burn-In Test Online
        </h1>
        <div className={styles.headerStartAction}>
          <StartFullscreenButton
            label="Start OLED Burn-In Test"
            slug="oled-burn-in-test"
          />
        </div>
      </header>

      <section
        aria-label="OLED Burn-In Test Online tool"
        className={`${styles.testMount} ${styles.toolTestMount}`}
        id="oled-burn-in-test-tool"
      >
        <OledBurnInTest />
      </section>

      <div className={styles.contentStack}>
        <section aria-labelledby="burn-in-how-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="burn-in-how-title">
            How to test an OLED for burn-in
          </h2>
          <ul className={styles.preparationList}>
            <li>Clean the screen, use the brightness and picture preset you normally watch, and avoid an unrealistic 100% brightness setup.</li>
            <li>If you briefly disable logo dimming, pixel shift, or another protection feature for comparison, restore it as soon as the test ends.</li>
            <li>Start on 10% gray. Check the taskbar, status bar, channel-logo, subtitle, and game-HUD positions before cycling red, green, and blue.</li>
            <li>Use Moving Color Bars and Gradient Sweep to see whether a suspicious mark stays fixed to the panel while the test content moves.</li>
            <li>Switch to ordinary moving content or let the display rest, then inspect the same location again to separate temporary retention from a persistent difference.</li>
          </ul>
        </section>

        <section aria-labelledby="burn-in-look-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="burn-in-look-title">
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
          <p>
            Allow the display to complete its normal automatic maintenance when
            it powers down. For a remaining afterimage, use the instructions for
            your exact model: Sony explains its automatic and manual
            {" "}<a href="https://www.sony.com/electronics/support/articles/00173479" rel="noreferrer" target="_blank">OLED panel care</a>,
            Samsung documents
            {" "}<a href="https://www.samsung.com/in/support/displays/panel-care-functions-on-samsung-oled-monitors/" rel="noreferrer" target="_blank">monitor Screen Optimization and Pixel Refresh</a>,
            and LG lists the
            {" "}<a href="https://www.lg.com/us/support/help-library/lg-oled-tv-run-pixel-cleaning-to-remove-screen-burn-ins-spots-lines-dots-CT10000018-20154768393287" rel="noreferrer" target="_blank">Pixel Cleaning path by webOS version</a>.
          </p>
        </section>

        <section aria-labelledby="burn-in-faq-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="burn-in-faq-title">
            OLED burn-in test FAQ
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

        <section aria-labelledby="burn-in-related-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="burn-in-related-title">
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
