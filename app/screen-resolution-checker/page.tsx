import type { Metadata } from "next";
import Link from "@/components/site/no-prefetch-link";
import { ArrowRight, Maximize2, Monitor, Ruler } from "lucide-react";

import { ScreenResolutionChecker } from "@/components/tests/ScreenResolutionChecker";
import styles from "@/components/tests/ScreenTests.module.css";
import { StartFullscreenButton } from "@/components/tests/StartFullscreenButton";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

const canonicalUrl = absoluteUrl("/screen-resolution-checker");
const title = `Screen Resolution Checker: What Is My Screen Resolution? | ${SITE_NAME}`;
const description =
  "Check your estimated screen output, browser-reported CSS size, viewport, device pixel ratio, aspect ratio, color depth, and browser frame cadence.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "screen resolution checker",
    "what is my screen resolution",
    "check screen resolution",
    "monitor resolution test",
    "browser viewport size",
    "device pixel ratio",
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title,
    description,
    type: "website",
    url: canonicalUrl,
    siteName: SITE_NAME,
  },
};

const resultDefinitions = [
  {
    signal: "Estimated output pixels",
    meaning:
      "The browser-reported screen size multiplied by DPR. This is the most useful quick estimate when display scaling makes a 4K output appear as 1536 × 864 CSS pixels.",
  },
  {
    signal: "Reported screen",
    meaning:
      "The full screen dimensions exposed to the browser in CSS pixels. Interface scaling can make this number smaller than the current output resolution.",
  },
  {
    signal: "Layout and visible viewport",
    meaning:
      "The layout viewport is the page's working area. The visible viewport can shrink during pinch zoom or when a mobile keyboard occupies part of the screen.",
  },
  {
    signal: "Device Pixel Ratio",
    meaning:
      "The number of device pixels used for one CSS pixel. Values such as 1.25, 1.5, 2, and 3 are normal on scaled desktop and high-density mobile displays.",
  },
  {
    signal: "Browser frame cadence",
    meaning:
      "An estimate based on animation callback timing in this tab. Use it to spot a browser stuck near 60 fps, then confirm the actual refresh setting in the operating system or monitor menu.",
  },
] as const;

const checks = [
  {
    signal: "The estimate matches the resolution selected in system settings",
    meaning:
      "That is a useful consistency check. For a 3840 × 2160 output, the page may still report a smaller CSS screen when scaling is enabled.",
  },
  {
    signal: "Moving the window to another monitor changes DPR or dimensions",
    meaning:
      "That is expected when the displays use different scaling or resolutions. Keep the checker on the monitor you are investigating.",
  },
  {
    signal: "Fullscreen viewport is smaller than the reported screen",
    meaning:
      "Browser UI, mobile safe areas, zoom, or operating-system reservations may still affect the usable page area. Compare the available-area and viewport rows.",
  },
  {
    signal: "A high-refresh display shows about 60 browser fps",
    meaning:
      "Check the selected display refresh rate, power saving, browser load, and which monitor owns the window. Then use the Screen Tearing Test for a moving comparison.",
  },
] as const;

const faqs = [
  {
    question: "What is my screen resolution?",
    answer:
      "Read the Estimated output pixels result first, then compare it with the resolution selected in your operating system. The Reported screen row shows the browser's CSS-pixel view of the same display.",
  },
  {
    question: "Why does my 4K display show 1536 × 864?",
    answer:
      "That usually means interface scaling is active. At a DPR of 2.5, 1536 × 864 CSS pixels map to an estimated 3840 × 2160 device-pixel output, so text stays readable while the display keeps its dense pixel grid.",
  },
  {
    question: "What is the difference between CSS pixels and estimated output pixels?",
    answer:
      "CSS pixels size browser interfaces and web layouts. Estimated output pixels multiply that reported size by DPR to approximate the device-pixel output currently used for the page.",
  },
  {
    question: "Why is my device pixel ratio 1.25 or 1.5?",
    answer:
      "Fractional values are common when desktop scaling is set to 125% or 150%. Browser zoom can also affect DPR, so use 100% page zoom when you want the cleanest comparison.",
  },
  {
    question: "Why does the result change when I move the window?",
    answer:
      "Each monitor can use a different resolution and scaling value. The checker updates after the browser moves to a display with a different screen size or DPR.",
  },
  {
    question: "Why is the browser viewport smaller than the screen?",
    answer:
      "Tabs, the address bar, window borders, taskbars, mobile browser controls, and on-screen keyboards can all reduce the page area. Fullscreen removes most browser chrome so you can compare again.",
  },
  {
    question: "Why does browser frame cadence differ from my monitor's refresh rate?",
    answer:
      "The estimate measures animation callbacks delivered to this page. Browser workload, background throttling, power saving, compositing, and frame pacing can make it differ from the refresh rate selected for the monitor.",
  },
  {
    question: "Can I check an external monitor with this page?",
    answer:
      "Yes. Move the entire browser window onto that monitor, wait for the values to update, and enter fullscreen there. This page checks the display holding the window and does not request access to every connected screen.",
  },
] as const;

const relatedTools = [
  { href: "/monitor-color-calibration", label: "Monitor Color Calibration" },
  { href: "/screen-tearing-test", label: "Screen Tearing Test" },
  { href: "/tests/guided", label: "Guided Monitor Test" },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#application`,
      name: "ScreenTestHub Screen Resolution Checker",
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
        { "@type": "ListItem", position: 3, name: "Screen Resolution Checker", item: canonicalUrl },
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

export default function ScreenResolutionCheckerPage() {
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
          <span aria-current="page">Resolution checker</span>
        </nav>
        <div className={styles.metaLine}>
          <span className={styles.metaItem}>
            <Ruler aria-hidden="true" size={17} strokeWidth={1.8} />
            Live measurements
          </span>
          <span className={styles.metaItem}>
            <Maximize2 aria-hidden="true" size={17} strokeWidth={1.8} />
            Window and fullscreen
          </span>
          <span className={styles.metaItem}>
            <Monitor aria-hidden="true" size={17} strokeWidth={1.8} />
            No permission prompt
          </span>
        </div>
        <h1 className={`${styles.title} ${styles.testTitle}`}>
          Screen Resolution Checker
        </h1>
        <div className={styles.headerStartAction}>
          <StartFullscreenButton
            label="Open Fullscreen Check"
            slug="screen-resolution-checker"
          />
        </div>
      </header>

      <section
        aria-label="Screen Resolution Checker tool"
        className={`${styles.testMount} ${styles.toolTestMount}`}
        id="screen-resolution-checker-tool"
      >
        <ScreenResolutionChecker />
      </section>

      <div className={styles.contentStack}>
        <section aria-labelledby="resolution-how-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="resolution-how-title">
            How to check your screen resolution
          </h2>
          <ul className={styles.preparationList}>
            <li>Move this browser window completely onto the monitor you want to check.</li>
            <li>Set browser zoom to 100%, then compare Estimated output pixels with the resolution selected in system display settings.</li>
            <li>Open the fullscreen check to remove tabs and most browser chrome, then compare the viewport numbers again.</li>
            <li>If you use two monitors, repeat the check on each one. Their resolution and DPR can be different.</li>
            <li>Let the frame estimate settle for a second with this tab visible and no heavy work running in another tab.</li>
          </ul>
        </section>

        <section aria-labelledby="resolution-numbers-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="resolution-numbers-title">
            What the numbers mean
          </h2>
          <dl className={styles.observationList}>
            {resultDefinitions.map((item) => (
              <div className={styles.observationRow} key={item.signal}>
                <dt>{item.signal}</dt>
                <dd>{item.meaning}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.limitation}>
            The browser reports screen dimensions in CSS pixels. DPR describes
            how those CSS pixels map to device pixels, and browser zoom can
            change that ratio. Use the estimate as a settings check, then compare
            it with the resolution shown by your operating system or monitor.
          </p>
          <div className={styles.referenceLinks}>
            <a className={styles.referenceLink} href="https://developer.mozilla.org/en-US/docs/Web/API/Screen/width" rel="noreferrer" target="_blank">
              Read how browsers report screen width
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </a>
            <a className={styles.referenceLink} href="https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio" rel="noreferrer" target="_blank">
              Read how device pixel ratio works
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
            </a>
          </div>
        </section>

        <section aria-labelledby="resolution-check-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="resolution-check-title">
            What to check
          </h2>
          <dl className={styles.observationList}>
            {checks.map((item) => (
              <div className={styles.observationRow} key={item.signal}>
                <dt>{item.signal}</dt>
                <dd>{item.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="resolution-faq-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="resolution-faq-title">
            Screen resolution checker FAQ
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

        <section aria-labelledby="resolution-related-title" className={styles.contentSection}>
          <h2 className={styles.sectionTitle} id="resolution-related-title">
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
