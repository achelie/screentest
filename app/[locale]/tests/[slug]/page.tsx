import type { Metadata } from "next";
import { createTestMetadata, TestPageContent } from "@/components/pages/test-page";
import { isLocalizedLocale, LOCALIZED_LOCALES } from "@/lib/i18n";
import { TEST_SLUGS } from "@/lib/tests";
export const dynamicParams = false;
type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() {
  return LOCALIZED_LOCALES.flatMap((locale) => TEST_SLUGS.map((slug) => ({ locale, slug })));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return isLocalizedLocale(locale) ? createTestMetadata(locale, slug) : {};
}
export default async function LocalizedTestPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocalizedLocale(locale)) return null;
  return <TestPageContent locale={locale} slug={slug} />;
}
