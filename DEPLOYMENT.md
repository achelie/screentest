# ScreenTestHub production deployment

The production host is `https://www.screentesthub.com`. The Cloudflare Worker is `screentesthub`. Its existing custom-domain binding and the apex redirect are managed in Cloudflare. A release updates the Worker and its static assets. It does not require DNS, nameserver or mail changes.

## Build and preview

Use the locked Node dependencies and the checked-in GeFeiSites export.

```sh
npm ci
npm run build
npm run preview
```

The build writes to `.site-build/assets`. Wrangler serves the same static files and fallback routes during preview and in production. Open the local address Wrangler prints to verify the site.

The editable engine snapshot lives in `gefeisites/`. Each `pages/**/page.json` contains the page metadata. Its `content_files` map points to the exact HTML fragments used by the page. The snapshot also includes the theme, browser tools, public assets, web app manifests and redirects. Site configuration contains public settings only. The Next.js source for the original tools and pages remains available through `npm run dev:next` and `npm run build:next`.

## Release

1. When the engine draft changes, sync its public page, theme, tool and asset records to this repository. Do not commit management tokens, ingestion tokens, preview URLs or account settings. Publishing in the engine and deploying this Worker are separate operations.
2. Verify `npm test`, `npm run build` and the local Worker preview. Commit the reviewed source changes to the release branch and verify the GitHub commit.
3. From the release commit, run `npm run deploy` with Wrangler authenticated to the account that owns `screentesthub`. Record the Worker version printed by Wrangler and check the production deployment and traffic allocation.
4. Check the home page, touch and dead-pixel tools, language switch, article images and 404 responses on the **www** hostname. Confirm the sitemap and canonical URLs use this hostname. PVUV should load once with the public site ID from `gefeisites/site.json`. Confirm browser requests reach the ingestion service.

The Worker uses Cloudflare Static Assets for published HTML and content-hashed scripts, styles, fonts and images. Its fallback handler serves engine redirects, JSON web app manifests, retired guide URLs and localized 404 pages. The published site runs independently of signed engine previews.
