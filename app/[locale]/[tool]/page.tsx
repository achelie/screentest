import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  createStandaloneToolMetadata,
  StandaloneToolPageContent,
} from "@/components/pages/standalone-tool-page";
import { isLocalizedLocale } from "@/lib/i18n";
import {
  STANDALONE_TOOL_SLUGS,
  type StandaloneToolSlug,
} from "@/lib/standalone-tools";

export const dynamic = "force-static";

export function generateStaticParams() {
  return STANDALONE_TOOL_SLUGS.map((tool) => ({ tool }));
}

function isStandaloneTool(value: string): value is StandaloneToolSlug {
  return STANDALONE_TOOL_SLUGS.includes(value as StandaloneToolSlug);
}

type PageProps = { params: Promise<{ locale: string; tool: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, tool } = await params;
  if (!isLocalizedLocale(locale) || !isStandaloneTool(tool)) return {};
  return createStandaloneToolMetadata(locale, tool);
}

export default async function LocalizedStandaloneToolPage({ params }: PageProps) {
  const { locale, tool } = await params;
  if (!isLocalizedLocale(locale) || !isStandaloneTool(tool)) notFound();
  return <StandaloneToolPageContent locale={locale} slug={tool} />;
}
