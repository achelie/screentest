import type { Locale } from "@/lib/i18n";
import { TEST_COPY } from "@/lib/tests-copy";

export const TEST_SLUGS = [
  "guided",
  "dead-pixel",
  "backlight-bleed",
  "grayscale",
  "gradient",
  "motion",
  "color",
] as const;

export type TestSlug = (typeof TEST_SLUGS)[number];
export type TestTool = TestSlug;

export type TestIconName =
  | "scan"
  | "pixel"
  | "dark"
  | "grayscale"
  | "gradient"
  | "motion"
  | "color";

export type TestObservation = {
  readonly signal: string;
  readonly meaning: string;
};

export type TestCopy = {
  readonly name: string;
  readonly shortName: string;
  readonly seoTitle: string;
  readonly description: string;
  readonly intro: string;
  readonly duration: string;
  readonly preparation: readonly string[];
  readonly observations: readonly TestObservation[];
  readonly limitation: string;
  readonly guideLabel: string;
};

export type TestDefinition = TestCopy & {
  readonly slug: TestSlug;
  readonly icon: TestIconName;
  readonly tool: TestTool;
  readonly guideHref: `/guides${string}`;
  readonly relatedTests: readonly TestSlug[];
};

type TestSpec = Pick<
  TestDefinition,
  "slug" | "icon" | "tool" | "guideHref" | "relatedTests"
>;

const TEST_SPECS = [
  { slug: "guided", icon: "scan", tool: "guided", guideHref: "/guides", relatedTests: ["dead-pixel", "backlight-bleed", "motion"] },
  { slug: "dead-pixel", icon: "pixel", tool: "dead-pixel", guideHref: "/guides/check-dead-pixels", relatedTests: ["color", "grayscale", "guided"] },
  { slug: "backlight-bleed", icon: "dark", tool: "backlight-bleed", guideHref: "/guides/check-backlight-bleed", relatedTests: ["grayscale", "dead-pixel", "guided"] },
  { slug: "grayscale", icon: "grayscale", tool: "grayscale", guideHref: "/guides/test-screen-uniformity", relatedTests: ["backlight-bleed", "gradient", "color"] },
  { slug: "gradient", icon: "gradient", tool: "gradient", guideHref: "/guides", relatedTests: ["grayscale", "color", "motion"] },
  { slug: "motion", icon: "motion", tool: "motion", guideHref: "/guides/test-motion-blur", relatedTests: ["gradient", "grayscale", "guided"] },
  { slug: "color", icon: "color", tool: "color", guideHref: "/guides", relatedTests: ["dead-pixel", "grayscale", "gradient"] },
] as const satisfies readonly TestSpec[];

export function isTestSlug(value: string): value is TestSlug {
  return TEST_SLUGS.includes(value as TestSlug);
}

export function getScreenTests(locale: Locale = "en"): readonly TestDefinition[] {
  return TEST_SPECS.map((spec) => ({ ...spec, ...TEST_COPY[locale][spec.slug] }));
}

export function getTestBySlug(slug: string, locale: Locale = "en"): TestDefinition | undefined {
  if (!isTestSlug(slug)) return undefined;
  const spec = TEST_SPECS.find((candidate) => candidate.slug === slug);
  return spec ? { ...spec, ...TEST_COPY[locale][slug] } : undefined;
}

export const SCREEN_TESTS = getScreenTests("en");
