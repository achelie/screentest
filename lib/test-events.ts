import type { TestSlug } from "@/lib/tests";

export type FullscreenTestId =
  | TestSlug
  | "hdr-test"
  | "screen-tearing-test"
  | "monitor-color-calibration"
  | "oled-burn-in-test";

export function testStartEventName(slug: FullscreenTestId) {
  return `screentest:${slug}:start`;
}
