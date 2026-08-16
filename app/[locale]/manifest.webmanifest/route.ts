export const dynamic = "force-static";

type Context = { params: Promise<{ locale: string }> };

export async function GET(_request: Request, { params }: Context) {
  if ((await params).locale !== "zh") {
    return new Response("Not Found", { status: 404 });
  }

  return Response.json(
    {
      name: "ScreenTestHub",
      short_name: "ScreenTestHub",
      description: "直接在浏览器中检查坏点、漏光、灰阶、渐变、色彩和动态拖影。",
      start_url: "/zh",
      display: "standalone",
      background_color: "#ece7dc",
      theme_color: "#191816",
      lang: "zh-CN",
      icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
    },
    { headers: { "Content-Type": "application/manifest+json" } },
  );
}
