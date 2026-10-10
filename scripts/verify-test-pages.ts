import assert from "node:assert/strict";

import { getDictionary, LOCALES, localizePath } from "../lib/i18n";
import { TEST_ROUTES } from "../lib/site";
import { GUIDANCE_LABELS } from "../lib/test-guidance";

const sections = [
  ["test-how", "how"],
  ["test-normal", "normal"],
  ["test-results", "results"],
  ["test-troubleshooting", "troubleshooting"],
] as const;

async function main() {
  const baseUrl = process.argv[2] ?? "http://127.0.0.1:3000";
  const routes = TEST_ROUTES.filter(({ href }) => href !== "/tests");
  let checked = 0;
  const failures: string[] = [];

  // Sequential requests also work against a development server compiling routes on demand.
  for (const locale of LOCALES) {
    for (const { href } of routes) {
      const path = localizePath(href, locale);
      try {
        const response = await fetch(new URL(path, baseUrl), { signal: AbortSignal.timeout(120_000) });
        assert.equal(response.status, 200, `HTTP ${response.status}`);
        const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
        const nav = html.match(/<nav\b[^>]*data-test-guide-nav[^>]*>([\s\S]*?)<\/nav>/)?.[1];
        assert.ok(nav, "Missing server-rendered guidance navigation");
        const toolId = href.split("/").at(-1);
        assert.ok(html.includes(`data-test-guidance="${toolId}"`), "Missing guidance for this tool");
        let previousPosition = -1;
        for (const [id, label] of sections) {
          assert.ok(nav.includes(`href="#${id}"`), `Missing anchor ${id}`);
          assert.equal([...html.matchAll(new RegExp(`id="${id}"`, "g"))].length, 1, `Duplicate or missing ${id}`);
          const section = html.match(new RegExp(`<section\\b[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/section>`))?.[1];
          assert.ok(section, `Missing section ${id}`);
          assert.ok(section.includes(GUIDANCE_LABELS[locale][label]), `Wrong language heading for ${id}`);
          assert.ok(/<(?:li|dd)\b/.test(section), `Empty guidance in ${id}`);
          const position = html.indexOf(`id="${id}"`);
          assert.ok(position > previousPosition, "Guidance sections are out of order");
          previousPosition = position;
        }
        const home = html.match(/<div\b[^>]*data-test-home[^>]*>([\s\S]*?)<\/div>/)?.[1];
        assert.ok(home?.includes(`href="${localizePath("/", locale)}"`), "Wrong or missing homepage link");
        assert.ok(home?.includes(GUIDANCE_LABELS[locale].home), "Wrong homepage link language");
        const breadcrumbNav = [...html.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/g)]
          .find((match) => match[0].includes(`aria-label="${getDictionary(locale).common.breadcrumb}"`))?.[1];
        assert.ok(breadcrumbNav?.includes(`href="${localizePath("/", locale)}"`), "Missing homepage breadcrumb");
        checked += 1;
      } catch (error) {
        failures.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  console.log(`Verified ${checked}/${routes.length * LOCALES.length} test pages: four sections, anchors, localized homepage links and breadcrumbs.`);
  for (const failure of failures) console.error(failure);
  if (failures.length) process.exitCode = 1;
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
