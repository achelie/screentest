import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(project, "gefeisites");
const output = path.join(project, ".site-build", "assets");
const theme = path.join(source, "theme");
const read = (file) => fs.readFileSync(file, "utf8");
const json = (file) => JSON.parse(read(file));
const site = json(path.join(source, "site.json"));
const origin = "https://www." + site.domain;
const generated = new Map();

function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
    const file = path.join(directory, item.name);
    return item.isDirectory() ? files(file) : [file];
  });
}
function write(relative, bytes) {
  const target = path.resolve(output, relative);
  assert.ok(target.startsWith(output + path.sep), "Asset path escaped the output directory");
  assert.ok(!generated.has(target), "Duplicate generated asset: " + relative);
  generated.set(target, bytes);
}
function asset(name, extension, value) {
  const hash = createHash("sha256").update(value).digest("hex").slice(0, 12);
  const filename = "_s/" + name + "." + hash + "." + extension;
  write(filename, value);
  return "/" + filename;
}
function escape(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
}
function productionLinks(text) {
  // The engine uses the apex. This release remains on the existing www Worker.
  return text.replace(/https:\/\/screentesthub\.com(?=\/|["'<\s]|$)/g, origin);
}

// Render only the template operations in this site's export. An unsupported
// expression fails the build instead of silently dropping part of a page.
function render(template, values) {
  const active = [true];
  const rendered = template.replace(/\{\{\{([\s\S]*?)\}\}\}|\{\{([\s\S]*?)\}\}|[^{]+|\{(?!\{)/g,
    (token, raw, escaped) => {
      if (raw === undefined && escaped === undefined) return active.at(-1) ? token : "";
      const expression = (raw ?? escaped).trim();
      if (expression.startsWith("#if ")) {
        const match = /^#if ([\w.]+) == "([^"]*)"$/.exec(expression);
        assert.ok(match, expression);
        active.push(active.at(-1) && values[match[1]] === match[2]);
        return "";
      }
      if (expression === "else" || expression === "/if") {
        assert.ok(active.length > 1, expression);
        const previous = active.pop();
        if (expression === "else") active.push(active.at(-1) && !previous);
        return "";
      }
      if (!active.at(-1)) return "";
      if (expression.startsWith("> ")) {
        const partial = expression.slice(2);
        assert.match(partial, /^partials\/[\w-]+$/);
        return render(read(path.join(theme, partial + ".html")), values);
      }
      const match = /^([@\w.]+)(?: \| default "([^"]*)")?$/.exec(expression);
      assert.ok(match && (Object.hasOwn(values, match[1]) || match[2] !== undefined), expression);
      const value = values[match[1]] || match[2] || "";
      return raw !== undefined || expression.startsWith("@") ? value : escape(value);
    });
  assert.equal(active.length, 1, "Unclosed template condition");
  return rendered;
}

fs.mkdirSync(output, { recursive: true });
assert.equal(fs.realpathSync(output).toLowerCase(), path.resolve(output).toLowerCase());
const css = asset("site", "css", read(path.join(theme, "style.css")));
const script = asset("site", "js", read(path.join(theme, "script.js")));
for (const [folder, prefix] of [["assets", "_a"], ["data", "_d"]]) {
  const directory = path.join(source, folder);
  for (const file of files(directory)) {
    write(path.join(prefix, path.relative(directory, file)), fs.readFileSync(file));
  }
}
const tools = new Map();
for (const filename of files(path.join(source, "tools")).filter((f) => path.basename(f) === "tool.json")) {
  const tool = json(filename);
  const directory = path.dirname(filename);
  assert.match(tool.key, /^[a-z0-9-]+$/);
  assert.equal(tool.libs.length, 0, "Review the external libraries for " + tool.key);
  const selector = '[data-gf-tool="' + tool.key + '"]';
  const js = "(function(root){if(!root)return;\n" + read(path.join(directory, "tool.js")) +
    "\n})(document.querySelector(" + JSON.stringify(selector) + "));";
  const cssFile = path.join(directory, "tool.css");
  tools.set(tool.key, {
    js: asset(tool.key, "js", js),
    css: fs.existsSync(cssFile) ? asset(tool.key, "css", read(cssFile)) : null,
  });
}
function head(page, tool) {
  const { icon, share_image, pvuv_site } = site.settings;
  const canonical = origin + page.path;
  return [
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>" + escape(page.title) + "</title>",
    '<meta name="description" content="' + escape(page.description) + '">',
    page.noindex ? '<meta name="robots" content="noindex,follow">' : '<link rel="canonical" href="' + canonical + '">',
    ...Object.entries({
      "og:site_name": site.name, "og:type": page.kind === "post" ? "article" : "website",
      "og:title": page.title, "og:description": page.description, "og:url": canonical,
      "og:locale": ({zh:"zh_CN",de:"de_DE",en:"en_US"})[page.content?.code ?? "en"],
      "og:image": origin + share_image.url,
    }).map(([key,value]) => '<meta property="' + key + '" content="' + escape(value) + '">'),
    '<meta name="twitter:card" content="summary_large_image">',
    '<link rel="icon" href="' + icon.svg + '" type="image/svg+xml"><link rel="apple-touch-icon" href="' + icon.apple + '">',
    '<link rel="stylesheet" href="' + css + '">',
    tool?.css ? '<link rel="stylesheet" href="' + tool.css + '">' : "",
    '<script defer src="https://www.pvuv.ai/f.js" data-site="' + escape(pvuv_site) + '" data-api="https://in.pvuv.ai"></script>',
  ].join("\n");
}
function bodyEnd(tool) {
  return [tool?.js, script].filter(Boolean).map((src) => '<script defer src="' + src + '"></script>').join("\n");
}

const layout = read(path.join(theme, "layout.html"));
const paths = new Set();
const entries = [];
for (const file of files(path.join(source, "pages")).filter((f) => path.basename(f) === "page.json")) {
  const page = json(file);
  if (page.status !== "ready") continue;
  assert.match(page.path, /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/);
  assert.ok(!paths.has(page.path), "Duplicate page " + page.path);
  paths.add(page.path);
  const tool = tools.get(page.tool);
  if (page.kind === "tool") assert.ok(tool, "Missing tool for " + page.path);
  const content = { jsonld: "", alternates: "", ...page.content };
  for (const [key, location] of Object.entries(page.content_files)) {
    const file = path.resolve(source, location);
    assert.ok(file.startsWith(source + path.sep));
    content[key] = read(file);
  }
  const values = Object.fromEntries(Object.entries(content).map(([k,v]) => ["content." + k,v]));
  values["tool.key"] = page.tool || "";
  values["@head"] = head(page, tool);
  values["@body_end"] = bodyEnd(tool);
  values["@content"] = render(read(path.join(theme, page.template)), values);
  const html = productionLinks(render(layout, values));
  assert.ok(!html.includes("/_preview/") && !html.includes("window.GF_PREVIEW=1"), page.path);
  write((page.path.slice(1) || "index") + ".html", html);
  if (!page.noindex) {
    const alternates = productionLinks(content.alternates || "").match(/<link\b[^>]*\bhreflang=[^>]+>/g) ?? [];
    entries.push("<url><loc>" + escape(origin + page.path) + "</loc>" +
      alternates.map((link) => link.replace(/^<link\b/, "<xhtml:link").replace(/\/?>$/, "/>")).join("") + "</url>");
  }
}

const errorTemplate = read(path.join(theme, "404.html"));
const errors = {
  en: ["ERROR / 404","This pixel is outside the panel.","That page moved, disappeared, or never existed.","Open all tests","Back home"],
  zh: ["错误 / 404","这个像素跑到屏幕外面了。","页面可能搬走了、消失了，或者从来就不存在。","打开全部测试","返回首页"],
  de: ["FEHLER / 404","Dieser Pixel liegt außerhalb des Panels.","Die Seite wurde verschoben, gelöscht oder hat nie existiert.","Alle Tests öffnen","Zur Startseite"],
};
for (const [locale, messages] of Object.entries(errors)) {
  const root = locale === "en" ? "" : "/" + locale;
  let template = errorTemplate.replace('lang="en"', 'lang="' + (locale === "zh" ? "zh-CN" : locale) + '"');
  template = template.replace('href="/tests"', 'href="' + root + '/tests"').replace('href="/"', 'href="' + (root || "/") + '"');
  errors.en.forEach((old, i) => { template = template.replace(old, messages[i]); });
  const html = render(template, {
    "@head": head({title:messages[1],description:messages[2],path:root+"/404",noindex:true,content:{code:locale}}),
    "@body_end": bodyEnd(),
  });
  write("_errors/" + locale + ".html", html);
}
write("sitemap.xml",'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+entries.join("\n")+"\n</urlset>\n");
write("robots.txt","User-agent: *\nAllow: /\nSitemap: "+origin+"/sitemap.xml\n");
write("_headers","/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n/_a/*\n  Cache-Control: public,max-age=31536000,immutable\n/_s/*\n  Cache-Control: public,max-age=31536000,immutable\n");
// Keep the watched output directory in place when rebuilding on Windows.
for (const [file, contents] of generated) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}
for (const file of files(output)) {
  if (!generated.has(file)) fs.unlinkSync(file);
}
console.log("Built %d pages and %d interactive tools for %s.", paths.size, tools.size, origin);
