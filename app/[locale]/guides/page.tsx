import { createGuidesMetadata, GuidesPageContent } from "@/components/pages/guides-page";
import { isLocalizedLocale } from "@/lib/i18n";
export const dynamic = "force-static";
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return isLocalizedLocale(locale) ? createGuidesMetadata(locale) : {};
}
export default async function LocalizedGuidesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) return null;
  return <GuidesPageContent locale={locale} />;
}
