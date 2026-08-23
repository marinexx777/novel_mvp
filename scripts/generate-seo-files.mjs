import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentRoot = path.join(root, "content");
const publicRoot = path.join(root, "public");
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(
  /\/$/,
  ""
);

const enCategories = [
  "romance",
  "fantasy",
  "werewolf",
  "billionaire",
  "mafia",
  "paranormal",
  "rebirth",
  "adventure"
];
const frCategories = [
  "romance",
  "fantastique",
  "loup-garou",
  "milliardaire",
  "mafia",
  "paranormal",
  "renaissance",
  "aventure"
];

function readMetadata(locale, slug) {
  return JSON.parse(
    fs.readFileSync(path.join(contentRoot, locale, slug, "metadata.json"), "utf8")
  );
}

function listNovelSlugs(locale) {
  return fs
    .readdirSync(path.join(contentRoot, locale), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function chapterPath(locale, slug, chapter) {
  return locale === "fr"
    ? `/fr/roman/${slug}/chapitre-${chapter}/`
    : `/en/novel/${slug}/chapter-${chapter}/`;
}

const urls = [
  "/en/",
  "/fr/",
  "/en/search/",
  "/fr/recherche/",
  "/en/categories/",
  "/fr/categories/",
  "/en/library/",
  "/fr/bibliotheque/",
  "/en/privacy/",
  "/fr/confidentialite/",
  "/en/terms/",
  "/fr/conditions/",
  "/en/contact/",
  "/fr/contact/",
  ...enCategories.map((category) => `/en/category/${category}/`),
  ...frCategories.map((category) => `/fr/categorie/${category}/`)
];

for (const locale of ["en", "fr"]) {
  for (const slug of listNovelSlugs(locale)) {
    const metadata = readMetadata(locale, slug);
    urls.push(locale === "fr" ? `/fr/roman/${slug}/` : `/en/novel/${slug}/`);

    for (let chapter = 1; chapter <= metadata.chapterCount; chapter += 1) {
      urls.push(chapterPath(locale, slug, chapter));
    }
  }
}

const now = new Date().toISOString();
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${siteUrl}${url}</loc>
    <lastmod>${now}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.mkdirSync(publicRoot, { recursive: true });
fs.writeFileSync(path.join(publicRoot, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(publicRoot, "robots.txt"), robots);
