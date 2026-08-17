import type { TestSlug } from "@/lib/tests";

export type FullscreenTestId =
  | TestSlug
  | "touch-screen-test"
  | "hdr-test"
  | "screen-tearing-test"
  | "monitor-color-calibration"
  | "black-level-test"
  | "oled-burn-in-test"
  | "screen-resolution-checker";

export function testStartEventName(slug: FullscreenTestId) {
  return `screentest:${slug}:start`;
}
