import redirects from "./redirects.json";
import site from "./site.json";

const targets = new Map(redirects.map(({ from, to }) => [from, to]));
const guideMessages = {
  en: "ScreenTestHub Guides has been retired. Visit /blog for current articles.",
  zh: "ScreenTestHub 指南栏目已下线。请访问 /blog 阅读现有英文文章。",
  de: "Der Guides-Bereich von ScreenTestHub wurde eingestellt. Aktuelle englische Artikel finden Sie unter /blog.",
};

export default {
  async fetch(request, env) {
    // Static Assets serves all published pages and fingerprinted resources first.
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response(null, { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    const target = targets.get(url.pathname + url.search) ?? targets.get(url.pathname);
    if (target) {
      let destination = new URL(target, url.origin);
      if (destination.hostname === site.domain) {
        destination = new URL(destination.pathname + destination.search + destination.hash, url.origin);
      }
      if (!destination.search) destination.search = url.search;
      return Response.redirect(destination.href, 301);
    }
    const locale = /^\/(zh|de)(?:\/|$)/.exec(url.pathname)?.[1] ?? "en";
    if (/^\/(?:(?:zh|de)\/)?guides(?:\/|$)/.test(url.pathname)) {
      return new Response(request.method === "HEAD" ? null : guideMessages[locale], {
        status: 410,
        headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex, nofollow" },
      });
    }
    const manifest = /^\/_d\/manifests\/(en|zh|de)$/.exec(url.pathname);
    const assetPath = manifest ? url.pathname + ".json" : "/_errors/" + locale;
    const response = await env.ASSETS.fetch(new Request(new URL(assetPath, url.origin), { method: request.method }));
    const headers = new Headers(response.headers);
    if (manifest) {
      headers.set("Content-Type", "application/manifest+json; charset=utf-8");
      return new Response(response.body, { status: response.status, headers });
    }
    headers.set("Cache-Control", "no-cache");
    headers.set("X-Robots-Tag", "noindex");
    return new Response(response.body, { status: 404, headers });
  },
};
