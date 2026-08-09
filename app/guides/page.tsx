import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { getAllGuides } from "@/lib/guides";

const canonicalUrl = "https://screentesthub.com/guides";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Screen Test Guides",
  description:
    "Practical guides for checking dead pixels, backlight bleed, screen uniformity, and motion blur at home.",
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "Screen Test Guides",
    description:
      "Practical checks for common screen problems, with clear steps and no lab coat required.",
    type: "website",
    url: canonicalUrl,
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default async function GuidesPage() {
  const guides = await getAllGuides();
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Screen Test Guides",
    description:
      "Practical guides for checking common screen and monitor problems at home.",
    url: canonicalUrl,
    hasPart: guides.map((guide) => ({
      "@type": "Article",
      headline: guide.title,
      url: `${canonicalUrl}/${guide.slug}`,
    })),
  };

  return (
    <div className="relative isolate overflow-hidden px-4 pb-24 pt-10 text-[var(--ink)] sm:px-6 lg:px-8 lg:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd).replace(/</gu, "\\u003c"),
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 82% 12%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 42%)",
        }}
      />

      <div className="mx-auto max-w-6xl">
        <header className="max-w-4xl border-b border-[var(--line)] pb-12 pt-8 md:pb-16">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Screen test guides
            </p>
            <h1 className="max-w-[15ch] text-[clamp(2.25rem,5vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
              Check the panel. Keep your sanity.
            </h1>
          </div>

          <div className="mt-7 max-w-[38rem]">
            <p className="text-lg leading-8 text-[var(--muted)]">
              Four short field guides for the marks, glows, bands, and trails
              that make a new screen feel suspicious.
            </p>
            <p className="mt-5 text-sm font-medium text-[var(--ink)]">
              About 10 minutes to read the lot.
            </p>
          </div>
        </header>

        <section aria-labelledby="guide-list-heading" className="pt-12 md:pt-16">
          <h2 id="guide-list-heading" className="sr-only">
            All screen test guides
          </h2>

          <ol className="max-w-5xl">
            {guides.map((guide, index) => (
              <li
                key={guide.slug}
                className={`border-b border-[var(--line)] ${
                  index % 2 === 1 ? "md:ml-[7%]" : ""
                }`}
              >
                <Link
                  href={`/guides/${guide.slug}`}
                  className="group grid gap-4 py-8 outline-none transition-[transform,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-1 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--paper)] active:translate-y-px sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-8"
                >
                  <span>
                    <span className="block text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                      {guide.title}
                    </span>
                    <span className="mt-3 block max-w-[46rem] leading-7 text-[var(--muted)]">
                      {guide.description}
                    </span>
                  </span>

                  <span className="flex items-center gap-5 text-sm text-[var(--muted)] sm:justify-end">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      <Clock3 aria-hidden="true" size={16} strokeWidth={1.7} />
                      {guide.readingMinutes} min
                    </span>
                    <span className="sr-only">
                      Updated {formatDate(guide.updated)}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="text-[var(--accent)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1"
                      size={22}
                      strokeWidth={1.7}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
