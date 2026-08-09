import type { Metadata } from "next";
import Link from "@/components/site/no-prefetch-link";
import {
  ArrowRight,
  CircleDot,
  Contrast,
  Gauge,
  Grid2X2,
  Moon,
  Palette,
} from "lucide-react";
import { ScreenSampler } from "@/components/home/screen-sampler";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllGuides } from "@/lib/guides";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Free Online Screen Tests for Monitors and Phones",
  description:
    "Run seven focused screen tests for dead pixels, backlight bleed, uniformity, gradients, color, and motion. Free, private, and browser based.",
  alternates: { canonical: "https://screentesthub.com" },
};

const symptoms = [
  {
    title: "One bright dot will not leave",
    detail: "Check black, white, red, green, and blue.",
    href: "/tests/dead-pixel",
    icon: CircleDot,
  },
  {
    title: "Black corners glow in a dark room",
    detail: "Separate edge bleed from normal viewing angle glow.",
    href: "/tests/backlight-bleed",
    icon: Moon,
  },
  {
    title: "Gray looks cloudy or patchy",
    detail: "Scan six brightness levels for uneven areas.",
    href: "/tests/grayscale",
    icon: Grid2X2,
  },
  {
    title: "Smooth shades turn into stripes",
    detail: "Look for steps in neutral and color gradients.",
    href: "/tests/gradient",
    icon: Contrast,
  },
  {
    title: "Moving text leaves a trail",
    detail: "Adjust speed and compare ghosting by eye.",
    href: "/tests/motion",
    icon: Gauge,
  },
  {
    title: "Colors look wrong beside another display",
    detail: "Cycle primary colors without loading an image.",
    href: "/tests/color",
    icon: Palette,
  },
] as const;

const faqs = [
  {
    question: "Can a website really find a dead pixel?",
    answer:
      "It can make a bad pixel easier to see by filling the panel with clean colors. You still make the diagnosis. Dust, a scratch, and a stuck pixel can look alike, so clean the screen before you start.",
  },
  {
    question: "Will these tests fix my screen?",
    answer:
      "No. They help you spot and document a problem. Avoid pressing or rubbing the panel. If the display is new, check the return window before trying any risky repair advice.",
  },
  {
    question: "Do you upload screenshots or test results?",
    answer:
      "No. The test patterns are drawn in your browser and guided answers stay in the current page. There is no account, database, or upload step.",
  },
  {
    question: "Should brightness be set to 100 percent?",
    answer:
      "Usually not. Start with the brightness you use every day. For backlight bleed, test again in a dark room at a moderate setting so an unrealistic maximum does not exaggerate the result.",
  },
] as const;

export default async function HomePage() {
  const guides = await getAllGuides();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ScreenTestHub",
      url: "https://screentesthub.com",
      description:
        "Free browser screen tests for monitors, laptops, tablets, and phones.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "ScreenTestHub",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any device with a modern browser",
      url: "https://screentesthub.com/tests/guided",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "A guided visual screen check for common pixel, lighting, color, gradient, and motion problems.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
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
            <p className="eyebrow">Browser screen test bench</p>
            <h1 id="home-heading">Test your screen. Spot problems fast.</h1>
            <p className="hero-lede">
              Check dead pixels, backlight bleed, banding, color shifts, and
              motion blur in about two minutes. No download. No account. No
              mystery score.
            </p>
            <div className="button-row">
              <Link className="button-primary" href="/tests/guided">
                Start screen check <ArrowRight size={17} />
              </Link>
              <Link className="button-secondary" href="#choose-test">
                Choose one test
              </Link>
            </div>
          </div>
          <ScreenSampler />
        </section>

        <hr className="section-rule" />

        <section id="choose-test" aria-labelledby="symptom-heading">
          <div className="section-heading section-heading-stacked">
            <div>
              <h2 id="symptom-heading">What looks wrong?</h2>
            </div>
            <p>
              Pick the closest symptom. Each test isolates one thing, so you
              spend less time staring at a random rainbow video.
            </p>
          </div>
          <div className="symptom-grid">
            {symptoms.map((item) => {
              const Icon = item.icon;
              return (
                <Link className="symptom-link" href={item.href} key={item.href}>
                  <Icon aria-hidden="true" size={20} strokeWidth={1.7} />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.detail}</small>
                  </span>
                  <ArrowRight aria-hidden="true" size={18} strokeWidth={1.7} />
                </Link>
              );
            })}
          </div>
        </section>

        <hr className="section-rule" />

        <section className="cta-strip" aria-labelledby="guided-heading">
          <div>
            <h2 id="guided-heading">Run the full check in one calm pass.</h2>
            <p>
              Six scenes, simple keyboard controls, and a short result at the
              end. Your answers stay in this tab.
            </p>
          </div>
          <Link className="button-primary" href="/tests/guided">
            Begin guided test <ArrowRight size={17} />
          </Link>
        </section>

        <hr className="section-rule" />

        <section aria-labelledby="method-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A useful result, not a diagnosis</p>
              <h2 id="method-heading">Three checks before you panic.</h2>
            </div>
            <p>
              A browser test is good evidence, but it cannot see your panel.
              Use these steps to rule out the easy mistakes first.
            </p>
          </div>
          <ol className="step-list">
            <li>
              <span className="step-index">CLEAN FIRST</span>
              <h3>Wipe the screen</h3>
              <p>Dust and tiny smears love pretending to be failed pixels.</p>
            </li>
            <li>
              <span className="step-index">ISOLATE THE PATTERN</span>
              <h3>Use one pattern</h3>
              <p>Fullscreen removes tabs, wallpaper, and other visual noise.</p>
            </li>
            <li>
              <span className="step-index">CONFIRM THE MARK</span>
              <h3>Change input or angle</h3>
              <p>If the mark stays put, document it before the return window closes.</p>
            </li>
          </ol>
        </section>

        <hr className="section-rule" />

        <section aria-labelledby="guides-heading">
          <div className="editorial-heading">
            <h2 id="guides-heading">Know what the pattern means.</h2>
            <p>
              Short guides for the awkward part: deciding whether you found a
              real fault or a normal display quirk.
            </p>
          </div>
          <div className="guide-stack">
            {guides.map((guide) => (
              <Link
                className="guide-row"
                href={`/guides/${guide.slug}`}
                key={guide.slug}
              >
                <ArrowRight aria-hidden="true" size={17} strokeWidth={1.7} />
                <h3>{guide.title}</h3>
                <span>{guide.readingMinutes} min</span>
              </Link>
            ))}
          </div>
          <div className="button-row">
            <Link className="button-secondary" href="/guides">
              Read all guides <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <hr className="section-rule" />

        <section aria-labelledby="faq-heading">
          <div className="faq-heading">
            <h2 id="faq-heading">Straight answers.</h2>
            <p>
              The tool is simple on purpose. Here is what it can and cannot do.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
