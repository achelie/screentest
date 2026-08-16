import type { Metadata } from "next";

import { createGuideMetadata, GuidePageContent } from "@/components/pages/guide-page";
import { getGuideSlugs } from "@/lib/guides";

export const dynamic = "force-static";
export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getGuideSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return createGuideMetadata((await params).slug);
}

export default async function GuidePage({ params }: Props) {
  return <GuidePageContent slug={(await params).slug} />;
}
