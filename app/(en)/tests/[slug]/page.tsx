import type { Metadata } from "next";

import { createTestMetadata, TestPageContent } from "@/components/pages/test-page";
import { TEST_SLUGS } from "@/lib/tests";

export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TEST_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return createTestMetadata("en", (await params).slug);
}

export default async function TestPage({ params }: Props) {
  return <TestPageContent locale="en" slug={(await params).slug} />;
}
