import type { TestSlug } from "@/lib/tests";

export type FullscreenTestId = TestSlug | "hdr-test";

export function testStartEventName(slug: FullscreenTestId) {
  return `screentest:${slug}:start`;
}
