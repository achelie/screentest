import type { Metadata } from "next";
import { createTestMetadata, TestPageContent } from "@/components/pages/test-page";
import { TEST_SLUGS } from "@/lib/tests";
export const dynamicParams = false;
type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return TEST_SLUGS.map((slug) => ({ locale: "zh", slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { return createTestMetadata("zh", (await params).slug); }
export default async function ChineseTestPage({ params }: Props) { return <TestPageContent locale="zh" slug={(await params).slug} />; }
