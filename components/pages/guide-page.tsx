import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";

import Link from "@/components/site/no-prefetch-link";
import { getAllGuides, getGuide } from "@/lib/guides";

const siteUrl = "https://screentesthub.com";

export async function createGuideMetadata(slug: string): Promise<Metadata> {
  const guide = await getGuide(slug);
  if (!guide) return { title: "Guide not found", robots: { index: false, follow: false } };
  const canonicalUrl = `${siteUrl}/guides/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: canonicalUrl,
      languages: { "en-US": canonicalUrl, "x-default": canonicalUrl },
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: canonicalUrl,
      locale: "en_US",
      publishedTime: guide.published,
      modifiedTime: guide.updated,
    },
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export async function GuidePageContent({ slug }: { slug: string }) {
  const [guide, allGuides] = await Promise.all([getGuide(slug), getAllGuides()]);
  if (!guide) notFound();
  const relatedGuides = allGuides.filter((candidate) => candidate.slug !== guide.slug).slice(0, 2);
  const canonicalUrl = `${siteUrl}/guides/${guide.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    inLanguage: "en-US",
    datePublished: guide.published,
    dateModified: guide.updated,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    author: { "@type": "Organization", name: "ScreenTestHub", url: siteUrl },
    publisher: { "@type": "Organization", name: "ScreenTestHub", url: siteUrl },
  };

  return (
    <div className="relative isolate overflow-hidden px-4 pb-24 pt-8 text-[var(--ink)] sm:px-6 lg:px-8 lg:pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</gu, "\\u003c") }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem] opacity-60" style={{ backgroundImage: "radial-gradient(circle at 12% 8%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 44%)" }} />
      <div className="mx-auto max-w-6xl">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] outline-none transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-x-1 hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--paper)]">
          <ArrowLeft aria-hidden="true" size={17} strokeWidth={1.7} />All guides
        </Link>
        <article className="mt-10">
          <header className="grid gap-8 border-b border-[var(--line)] pb-10 md:grid-cols-[minmax(0,1fr)_13rem] md:items-end md:gap-16 md:pb-14">
            <div><h1 className="max-w-[18ch] text-[clamp(2.25rem,5vw,3rem)] font-semibold leading-[1.04] tracking-[-0.04em]">{guide.title}</h1><p className="mt-6 max-w-[44rem] text-lg leading-8 text-[var(--muted)]">{guide.description}</p></div>
            <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-1 md:border-l md:border-[var(--line)] md:pl-6">
              <div><dt className="text-[var(--muted)]">Updated</dt><dd className="mt-1 font-semibold">{formatDate(guide.updated)}</dd></div>
              <div><dt className="text-[var(--muted)]">Reading time</dt><dd className="mt-1 inline-flex items-center gap-2 font-semibold"><Clock3 aria-hidden="true" size={16} strokeWidth={1.7} />{guide.readingMinutes} min</dd></div>
            </dl>
          </header>
          <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,43rem)_minmax(10rem,1fr)] lg:gap-20 lg:pt-14">
            <div className="max-w-[43rem] text-[1.0625rem] leading-8 text-[var(--ink)] [&_a]:font-semibold [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:decoration-[color-mix(in_srgb,var(--accent)_35%,transparent)] [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a:hover]:decoration-[var(--accent)] [&_h2]:mb-4 [&_h2]:mt-11 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:tracking-[-0.025em] [&_li]:mt-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-5 [&_strong]:font-semibold" dangerouslySetInnerHTML={{ __html: guide.html }} />
            <aside className="h-fit border-l-2 border-[var(--accent)] pl-5 lg:sticky lg:top-28"><p className="text-sm font-semibold">Use the screen, not a screenshot.</p><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Browser tests show the real pixels on this display. Photos can add exposure, focus, and compression problems of their own.</p></aside>
          </div>
        </article>
        {relatedGuides.length > 0 ? (
          <section aria-labelledby="related-guides-heading" className="mt-20 border-t border-[var(--line)] pt-10">
            <h2 id="related-guides-heading" className="text-2xl font-semibold tracking-[-0.025em]">Keep checking</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-[1.35fr_0.65fr]">
              {relatedGuides.map((related) => (
                <Link key={related.slug} href={`/guides/${related.slug}`} className="group flex min-h-32 flex-col justify-between border border-[var(--line)] bg-[var(--paper-strong)] p-5 outline-none transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--paper)] active:translate-y-px">
                  <span className="font-semibold leading-6">{related.title}</span><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">Read guide<ArrowUpRight aria-hidden="true" className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={17} strokeWidth={1.7} /></span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
