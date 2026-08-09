# ScreenTestHub deployment

ScreenTestHub deploys as a Next.js application on Cloudflare Workers through `@opennextjs/cloudflare`. Cloudflare Pages and Vercel are not part of this setup.

## Prerequisites

- Node.js and npm installed
- A Cloudflare account with the `screentesthub.com` zone active
- Permission to deploy Workers and manage the zone
- Wrangler authenticated with the same Cloudflare account

Install the locked dependencies, generate Cloudflare types, and check the account:

```bash
npm install
npm run cf-typegen
npx wrangler whoami
```

If Wrangler is not authenticated yet, run:

```bash
npx wrangler login
```

## Local development

Use the Next.js development server while editing:

```bash
npm run dev
```

This server runs in Node.js and favors fast refresh. It does not prove that the application works in the Cloudflare Workers runtime.

## Production build

Run the normal Next.js production build:

```bash
npm run build
```

The `prebuild` hook first converts the trusted Markdown files in `content/guides` into `lib/generated-guides.json`. The `build` script itself remains `next build`. This keeps filesystem reads in the Node.js build step and out of the Cloudflare Worker runtime.

`open-next.config.ts` uses the read-only Workers Static Assets incremental cache with cache interception. This is the OpenNext configuration intended for a static SSG site and ensures build-time routes are available in `workerd` without R2, D1, or a queue.

## Cloudflare runtime preview

Build the OpenNext output and start it in the local `workerd` runtime:

```bash
npm run preview
```

Open the local address printed by Wrangler, normally `http://localhost:8787`. Check the home page, every test, fullscreen mode, `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest`.

The preview command stays running while the local Worker is available. A successful verification means that Wrangler starts without a runtime error and the expected URLs return valid responses. Stop it with `Ctrl+C` after the checks.

OpenNext supports Windows, but its maintainers do not guarantee complete Windows tooling compatibility. If the adapter fails for a platform-specific reason, repeat the preview in WSL or a Linux CI runner before deployment.

## Deploy the Worker

Deploy the adapted build with:

```bash
npm run deploy
```

The deploy script runs both commands in order:

```bash
opennextjs-cloudflare build
opennextjs-cloudflare deploy
```

Do not replace the adapter deploy command with a Pages deploy command. OpenNext wraps Wrangler and prepares the Worker output, static assets, and local or remote cache steps it needs.

## Wrangler configuration

The committed `wrangler.jsonc` uses these production settings:

- Worker name: `screentesthub`
- Worker entrypoint: `.open-next/worker.js`
- Static assets: `.open-next/assets`, exposed through the `ASSETS` binding
- Runtime compatibility: `nodejs_compat`
- Compatibility date: `2026-08-08`, the newest date supported by the current workerd release at project verification time
- Workers Logs: enabled through `observability`
- Public `workers.dev` URL: disabled
- Custom Domain: `screentesthub.com`

When intentionally updating the compatibility date later, set it to the update date, review the intervening Cloudflare compatibility changes, run `npm run preview`, and only then deploy.

## Bind the apex Custom Domain

The Worker is the origin for the site, so it uses a Cloudflare Workers Custom Domain rather than a traditional route in front of another origin.

The committed Wrangler route is:

```jsonc
{
  "routes": [
    {
      "pattern": "screentesthub.com",
      "custom_domain": true
    }
  ]
}
```

On `npm run deploy`, Wrangler creates or updates the Custom Domain, DNS record, and certificate. The `screentesthub.com` zone must already belong to the authenticated account. Remove a conflicting CNAME before creating the Custom Domain.

If Wrangler reports `Could not find zone for screentesthub.com`, the Worker upload may still have succeeded, but the public route has not. Register the domain if needed, add it to the same Cloudflare account, wait until the zone is Active, and rerun `npm run deploy`.

The same binding can be checked or added in the dashboard:

1. Open Cloudflare Dashboard.
2. Go to Workers & Pages.
3. Select the `screentesthub` Worker.
4. Open Settings, then Domains & Routes.
5. Confirm that `screentesthub.com` appears as a Custom Domain.

Custom Domains match exact hostnames and handle every path on that hostname. Do not add `/*` to the Custom Domain pattern.

## Redirect www to the canonical apex domain

Keep `https://screentesthub.com` as the only canonical site. Handle `www` with a zone-level Single Redirect so the request does not need to execute the Next.js Worker.

First create a proxied DNS record for the source hostname:

1. Go to DNS, then Records for `screentesthub.com`.
2. Add an `A` record named `www` with IPv4 address `192.0.2.0`.
3. Turn Proxy status on so the record is orange-clouded.

`192.0.2.0` is a reserved placeholder address documented by Cloudflare for originless redirects. Proxied requests are intercepted before they could reach that address. A proxied `AAAA` record pointing to `100::` is an official alternative.

Then create the redirect:

1. Go to Rules, then Redirect Rules.
2. Create a Single Redirect named `www to apex`.
3. Choose Custom filter expression.
4. Use `http.host eq "www.screentesthub.com"` as the match expression.
5. Choose a Dynamic redirect target.
6. Use `concat("https://screentesthub.com", http.request.uri.path)` as the target expression.
7. Select status code `301`.
8. Enable Preserve query string.
9. Deploy the rule.

This rule covers both HTTP and HTTPS requests, keeps the path, keeps the query string, and sends every `www` URL to the apex HTTPS URL.

Do not bind `www.screentesthub.com` as a second Custom Domain unless the application itself must receive that hostname. The zone redirect is simpler and avoids a second public copy of the site.

## SEO and crawler checks

After deployment, run:

```bash
curl -I https://screentesthub.com/
curl -I https://screentesthub.com/robots.txt
curl -I https://screentesthub.com/sitemap.xml
curl -I "https://www.screentesthub.com/tests/dead-pixel?source=check"
```

Confirm all of the following:

- The apex pages return `200`.
- `robots.txt` and `sitemap.xml` are public and return `200`.
- The `www` request returns `301` with `Location: https://screentesthub.com/tests/dead-pixel?source=check`.
- Canonical tags, sitemap URLs, Open Graph URLs, and structured data use `https://screentesthub.com`.
- No Cloudflare Access policy protects the public site.
- No WAF or bot rule gives ordinary search engine requests a challenge on public pages, `robots.txt`, or `sitemap.xml`.
- Cache rules do not cache a `404` or `5xx` response as a successful page.

## Google Analytics 4 placeholder

Analytics is optional for the MVP. Do not invent a measurement ID. When a real GA4 property exists, set this build-time environment variable:

```dotenv
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

Leave it unset or blank until a real value is available. Any later analytics component must render nothing when the value is absent and must load analytics after the core page, so it cannot block the screen tests.

For a local build, put the real value in an uncommitted `.env.local`. For a Cloudflare remote build, configure it as a build variable in the Worker build settings. A direct local `npm run deploy` uses the environment available to the local build process.

## Google Search Console placeholder

The preferred verification method is a DNS TXT record in Cloudflare because it does not add page code. Add the exact TXT value supplied by Search Console, then submit:

```text
https://screentesthub.com/sitemap.xml
```

If HTML meta verification is needed instead, set the real token at build time:

```dotenv
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

Leave it unset or blank until Search Console provides a real token.

## Official references

- Cloudflare Next.js Workers guide: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- OpenNext Cloudflare Get Started: https://opennext.js.org/cloudflare/get-started
- OpenNext CLI behavior: https://opennext.js.org/cloudflare/cli
- Cloudflare Custom Domains: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- Cloudflare www redirect example: https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/
- Workers compatibility dates: https://developers.cloudflare.com/workers/configuration/compatibility-dates/
