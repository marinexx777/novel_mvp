import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const inputPath = args[0];
const lang = getFlagValue("--lang") || "en";

if (!inputPath || !["en", "fr"].includes(lang)) {
  fail("Usage: npm run import-novel -- ./imports/story.txt --lang=en");
}

const absoluteInputPath = path.resolve(inputPath);

if (!fs.existsSync(absoluteInputPath)) {
  fail(`Input file not found: ${inputPath}`);
}

const source = fs.readFileSync(absoluteInputPath, "utf8").replace(/\r\n/g, "\n");
const title = toTitleCase(
  path.basename(inputPath, path.extname(inputPath)).replace(/[-_]+/g, " ")
);
const slug = slugify(title);
const chapters = splitChapters(source, lang);

if (chapters.length < 2) {
  fail(
    "Could not confidently detect chapter headings. Please add clear Chapter 1 / Chapitre 1 headings and try again."
  );
}

const novelDir = path.join(process.cwd(), "content", lang, slug);

if (fs.existsSync(novelDir)) {
  fail(`Novel directory already exists: ${novelDir}`);
}

fs.mkdirSync(novelDir, { recursive: true });

const metadata = {
  id: slug,
  language: lang,
  title,
  slug,
  author: "Imported Author",
  description: "Short description.",
  longDescription: "Long synopsis.",
  cover: "/covers/default.svg",
  status: "completed",
  genres: [],
  tags: [],
  chapterCount: chapters.length,
  featured: false,
  ranking: 0,
  translationOf: null
};

fs.writeFileSync(
  path.join(novelDir, "metadata.json"),
  `${JSON.stringify(metadata, null, 2)}\n`
);

chapters.forEach((chapter, index) => {
  const number = index + 1;
  const fileName = `chapter-${String(number).padStart(3, "0")}.md`;
  const frontmatter = [
    "---",
    `chapter: ${number}`,
    `title: ${JSON.stringify(chapter.title)}`,
    "---",
    chapter.body.trim(),
    ""
  ].join("\n");

  fs.writeFileSync(path.join(novelDir, fileName), frontmatter);
});

console.log(`Imported ${chapters.length} chapters into ${novelDir}`);
console.log("Review metadata.json before publishing.");

function getFlagValue(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
}

function splitChapters(text, locale) {
  const headingPattern =
    locale === "fr"
      ? /^(chapitre\s+\d+[\s:.-]*(.*)|prologue|epilogue)\s*$/gim
      : /^(chapter\s+\d+[\s:.-]*(.*)|prologue|epilogue)\s*$/gim;
  const matches = [...text.matchAll(headingPattern)];

  if (matches.length < 2) {
    return [];
  }

  return matches
    .map((match, index) => {
      const start = match.index ?? 0;
      const nextStart = matches[index + 1]?.index ?? text.length;
      const heading = match[0].trim();
      const body = text.slice(start + match[0].length, nextStart).trim();
      const fallbackTitle =
        locale === "fr" ? `Chapitre ${index + 1}` : `Chapter ${index + 1}`;
      const title = match[2]?.trim() || heading || fallbackTitle;

      return { title, body };
    })
    .filter((chapter) => chapter.body.length > 0);
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toTitleCase(value) {
  return value.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
