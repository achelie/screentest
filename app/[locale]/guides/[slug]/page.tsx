import { permanentRedirect } from "next/navigation";
import { getGuideSlugs } from "@/lib/guides";
import { LOCALIZED_LOCALES } from "@/lib/i18n";
export const dynamicParams = false;
type Props = { params: Promise<{ locale: string; slug: string }> };
export async function generateStaticParams() {
  const slugs = await getGuideSlugs();
  return LOCALIZED_LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}
export default async function LocalizedGuideRedirect({ params }: Props) {
  permanentRedirect(`/guides/${(await params).slug}`);
}
