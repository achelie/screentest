import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const guidesDirectory = path.join(projectRoot, "content", "guides");
const outputFile = path.join(projectRoot, "lib", "generated-guides.json");
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function requireString(data, key, fileName) {
  const value = data[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Guide ${fileName} needs a non-empty ${key} field.`);
  }

  return value.trim();
}

function getReadingMinutes(markdown) {
  const words = markdown.trim().split(/\s+/u).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

async function buildGuide(fileName) {
  const slug = fileName.slice(0, -3);

  if (!validSlug.test(slug)) {
    throw new Error(`Guide filename ${fileName} is not a valid URL slug.`);
  }

  const source = await fs.readFile(path.join(guidesDirectory, fileName), "utf8");
  const parsed = matter(source);
  const order = parsed.data.order;

  if (typeof order !== "number" || !Number.isInteger(order)) {
    throw new Error(`Guide ${fileName} needs an integer order field.`);
  }

  const rendered = await remark().use(remarkHtml).process(parsed.content);

  return {
    slug,
    title: requireString(parsed.data, "title", fileName),
    description: requireString(parsed.data, "description", fileName),
    published: requireString(parsed.data, "published", fileName),
    updated: requireString(parsed.data, "updated", fileName),
    order,
    readingMinutes: getReadingMinutes(parsed.content),
    html: rendered.toString(),
  };
}

const entries = await fs.readdir(guidesDirectory, { withFileTypes: true });
const fileNames = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
  .map((entry) => entry.name)
  .sort();
const guides = await Promise.all(fileNames.map(buildGuide));

guides.sort((left, right) =>
  left.order === right.order
    ? left.title.localeCompare(right.title)
    : left.order - right.order,
);

await fs.writeFile(outputFile, `${JSON.stringify(guides, null, 2)}\n`, "utf8");
console.log(`Generated ${guides.length} guides in lib/generated-guides.json.`);
