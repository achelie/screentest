export const dynamic = "force-static";

export function GET() {
  return new Response("ScreenTestHub Guides has been retired. Visit /blog for current articles.", {
    status: 410,
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
