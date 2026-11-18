import type { Metadata } from "next";

import { createTestMetadata, TestPageContent, type TestPageCopy } from "@/components/pages/test-page";
import { isTestSlug, TEST_SLUGS, type TestSlug } from "@/lib/tests";

export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };

const pageCopy: Readonly<Partial<Record<TestSlug, TestPageCopy>>> = {
  "backlight-bleed": {
    seoTitle: "Bleed Screen Test for LCD Backlight Bleed",
    heading: "Bleed Screen Test for Backlight Bleed",
    intro: "Use this bleed screen test in a dark room to spot bright patches along the edges of a black screen.",
    resultNote: "‘Bleed screen’ is another name for backlight bleed. On a black screen, it looks like light leaking through near an LCD panel’s edges or corners.",
  },
  color: {
    seoTitle: "Color Test Screen with Fullscreen RGB & CMY",
    heading: "Fullscreen Color Test Screen",
    intro: "Use this color test screen to run a display color test with eight solid colors in fullscreen. The browser generates each color without image compression.",
    resultNote: "If a corner looks pink on the color test screen, note which colors bring out the tint. Repeat the display color test in your monitor’s neutral preset at the same brightness to see whether the patch changes.",
  },
  grayscale: {
    seoTitle: "Gray Screen Test for Display Uniformity",
    heading: "Gray Screen Test for Screen Uniformity",
    intro: "Run this gray screen test to check how evenly your display lights up. Move through gray levels and look for cloudy patches, tint, or dirty-screen effect.",
    resultNote: "To check for dirty screen effect during sports, watch for bands that stay put as the camera pans across the ice or field. Then use the 50% grayscale test pattern to see if those bands show up in the same spots.",
  },
};

export function generateStaticParams() {
  return TEST_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const copy = isTestSlug(slug) ? pageCopy[slug] : undefined;
  return createTestMetadata("en", slug, copy?.seoTitle);
}

export default async function TestPage({ params }: Props) {
  const { slug } = await params;
  const copy = isTestSlug(slug) ? pageCopy[slug] : undefined;
  return <TestPageContent copy={copy} locale="en" slug={slug} />;
}
