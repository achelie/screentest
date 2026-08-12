import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDirectory = path.join(projectRoot, "content", "blog");
const outputFile = path.join(projectRoot, "lib", "generated-blog.json");
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function requireString(data, key, fileName) {
  const value = data[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Blog post ${fileName} needs a non-empty ${key} field.`);
  }

  return value.trim();
}

function getNodeText(node) {
  if (typeof node.value === "string") return node.value;
  if (!Array.isArray(node.children)) return "";
  return node.children.map(getNodeText).join("");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/gu, "")
    .trim()
    .replace(/\s+/gu, "-")
    .replace(/-+/gu, "-");
}

function collectArticleMetadata(options) {
  return (tree) => {
    const usedIds = new Map();
    let collectingFaq = false;
    let currentQuestion = null;
    let currentAnswer = [];

    const finishQuestion = () => {
      if (currentQuestion && currentAnswer.length > 0) {
        options.faq.push({
          question: currentQuestion,
          answer: currentAnswer.join(" "),
        });
      }
      currentQuestion = null;
      currentAnswer = [];
    };

    for (const node of tree.children ?? []) {
      if (node.type === "heading") {
        const text = getNodeText(node).trim();
        const baseId = slugify(text) || "section";
        const count = usedIds.get(baseId) ?? 0;
        const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
        usedIds.set(baseId, count + 1);

        node.data = {
          ...(node.data ?? {}),
          hProperties: {
            ...(node.data?.hProperties ?? {}),
            id,
          },
        };

        if (node.depth === 2) {
          finishQuestion();
          collectingFaq = text.toLowerCase() === "faq";
          options.toc.push({ id, label: text });
        } else if (collectingFaq && node.depth === 3) {
          finishQuestion();
          currentQuestion = text;
        }
      } else if (collectingFaq && currentQuestion && node.type === "paragraph") {
        const answerPart = getNodeText(node).trim();
        if (answerPart) currentAnswer.push(answerPart);
      }
    }

    finishQuestion();
  };
}

function getReadingMinutes(markdown) {
  const words = markdown.trim().split(/\s+/u).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

async function buildPost(fileName) {
  const slug = fileName.slice(0, -3);

  if (!validSlug.test(slug)) {
    throw new Error(`Blog filename ${fileName} is not a valid URL slug.`);
  }

  const source = await fs.readFile(path.join(postsDirectory, fileName), "utf8");
  const parsed = matter(source);
  const toc = [];
  const faq = [];
  const rendered = await remark()
    .use(collectArticleMetadata, { toc, faq })
    .use(remarkHtml, { sanitize: false })
    .process(parsed.content);

  return {
    slug,
    title: requireString(parsed.data, "title", fileName),
    description: requireString(parsed.data, "description", fileName),
    author: requireString(parsed.data, "author", fileName),
    category: requireString(parsed.data, "category", fileName),
    published: requireString(parsed.data, "published", fileName),
    updated: requireString(parsed.data, "updated", fileName),
    cover: requireString(parsed.data, "cover", fileName),
    coverAlt: requireString(parsed.data, "coverAlt", fileName),
    readingMinutes: getReadingMinutes(parsed.content),
    toc,
    faq,
    html: rendered.toString(),
  };
}

const entries = await fs.readdir(postsDirectory, { withFileTypes: true });
const fileNames = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
  .map((entry) => entry.name)
  .sort();
const posts = await Promise.all(fileNames.map(buildPost));

posts.sort((left, right) =>
  left.published === right.published
    ? left.title.localeCompare(right.title)
    : right.published.localeCompare(left.published),
);

await fs.writeFile(outputFile, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
console.log(`Generated ${posts.length} blog post${posts.length === 1 ? "" : "s"}.`);
