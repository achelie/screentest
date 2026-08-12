import type { TestSlug } from "@/lib/tests";

export function testStartEventName(slug: TestSlug) {
  return `screentest:${slug}:start`;
}
