import { createTestsMetadata, TestsPageContent } from "@/components/pages/tests-page";
import { isLocalizedLocale } from "@/lib/i18n";
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return isLocalizedLocale(locale) ? createTestsMetadata(locale) : {};
}
export default async function LocalizedTestsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) return null;
  return <TestsPageContent locale={locale} />;
}
