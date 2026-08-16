import { permanentRedirect } from "next/navigation";
import { getGuideSlugs } from "@/lib/guides";
export const dynamicParams = false;
type Props = { params: Promise<{ locale: string; slug: string }> };
export async function generateStaticParams() { return (await getGuideSlugs()).map((slug) => ({ locale: "zh", slug })); }
export default async function ChineseGuideRedirect({ params }: Props) { permanentRedirect(`/guides/${(await params).slug}`); }
