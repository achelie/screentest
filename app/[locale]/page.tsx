import { createHomeMetadata, HomePageContent } from "@/components/pages/home-page";
import { isLocalizedLocale } from "@/lib/i18n";
export const dynamic = "force-static";
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return isLocalizedLocale(locale) ? createHomeMetadata(locale) : {};
}
export default async function LocalizedHomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) return null;
  return <HomePageContent locale={locale} />;
}
