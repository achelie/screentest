import type { Locale } from "@/lib/i18n";

export const dynamic = "force-static";

const messages: Record<Locale, string> = {
  en: "ScreenTestHub Guides has been retired. Visit /blog for current articles.",
  zh: "ScreenTestHub 指南栏目已下线。请访问 /blog 阅读现有英文文章。",
  de: "Der Guides-Bereich von ScreenTestHub wurde eingestellt. Aktuelle englische Artikel finden Sie unter /blog.",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const body = messages[locale as Locale] ?? messages.en;

  return new Response(body, {
    status: 410,
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Language": locale === "zh" ? "zh-CN" : locale === "de" ? "de-DE" : "en-US",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
