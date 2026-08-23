import fs from "node:fs";
import path from "node:path";

const contentRoot = path.join(process.cwd(), "content");
const publicRoot = path.join(process.cwd(), "public");
const locales = ["en", "fr"];

for (const locale of locales) {
  const localeDir = path.join(contentRoot, locale);
  const items = fs
    .readdirSync(localeDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const metadataPath = path.join(localeDir, entry.name, "metadata.json");
      const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

      return {
        id: metadata.id,
        title: metadata.title,
        author: metadata.author,
        genres: metadata.genres,
        tags: metadata.tags,
        description: metadata.description,
        slug: metadata.slug
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  fs.mkdirSync(publicRoot, { recursive: true });
  fs.writeFileSync(
    path.join(publicRoot, `search-index-${locale}.json`),
    `${JSON.stringify(items, null, 2)}\n`
  );
}
