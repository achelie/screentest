import { isLocalizedLocale, localeConfig } from "@/lib/i18n";

export const dynamic = "force-static";

type Context = { params: Promise<{ locale: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) {
    return new Response("Not Found", { status: 404 });
  }

  const descriptions = {
    zh: "直接在浏览器中检查坏点、漏光、灰阶、渐变、色彩和动态拖影。",
    de: "Prüfe Pixelfehler, Backlight Bleeding, Graustufen, Farbverläufe, Farben und Bewegung direkt im Browser.",
  } as const;

  return Response.json(
    {
      name: "ScreenTestHub",
      short_name: "ScreenTestHub",
      description: descriptions[locale],
      start_url: `/${locale}`,
      display: "standalone",
      background_color: "#ece7dc",
      theme_color: "#191816",
      lang: localeConfig[locale].htmlLang,
      icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
    },
    { headers: { "Content-Type": "application/manifest+json" } },
  );
}
