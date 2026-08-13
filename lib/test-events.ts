import type { TestSlug } from "@/lib/tests";

export type FullscreenTestId =
  | TestSlug
  | "hdr-test"
  | "screen-tearing-test"
  | "monitor-color-calibration";

export function testStartEventName(slug: FullscreenTestId) {
  return `screentest:${slug}:start`;
}
