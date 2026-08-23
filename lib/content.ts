import fs from "node:fs";
import path from "node:path";

import { getCategories } from "@/lib/i18n";
import { parseMarkdown } from "@/lib/markdown";
import type { Chapter, Locale, Novel, NovelMetadata } from "@/types/novel";

const contentRoot = path.join(process.cwd(), "content");

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function localeDir(locale: Locale) {
  return path.join(contentRoot, locale);
}

export function getAllNovels(locale: Locale): Novel[] {
  const dir = localeDir(locale);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const contentDir = path.join(dir, entry.name);
      const metadata = readJsonFile<NovelMetadata>(
        path.join(contentDir, "metadata.json")
      );

      return {
        ...metadata,
        contentDir
      };
    })
    .filter((novel) => novel.language === locale)
    .sort((a, b) => b.ranking - a.ranking || a.title.localeCompare(b.title));
}

export function getNovel(locale: Locale, slug: string) {
  return getAllNovels(locale).find((novel) => novel.slug === slug) ?? null;
}

export function getFeaturedNovels(locale: Locale) {
  return getAllNovels(locale).filter((novel) => novel.featured);
}

export function getCompletedNovels(locale: Locale) {
  return getAllNovels(locale).filter((novel) => novel.status === "completed");
}

export function getNovelsByCategory(locale: Locale, categorySlug: string) {
  const category = getCategories(locale).find(
    (item) => item.slug === categorySlug
  );

  if (!category) {
    return [];
  }

  return getAllNovels(locale).filter((novel) =>
    novel.genres.some(
      (genre) => normalizeLabel(genre) === normalizeLabel(category.label)
    )
  );
}

export function getChapter(
  locale: Locale,
  slug: string,
  chapterNumber: number
): Chapter | null {
  const novel = getNovel(locale, slug);

  if (!novel || chapterNumber < 1 || chapterNumber > novel.chapterCount) {
    return null;
  }

  const filePath = path.join(
    novel.contentDir,
    `chapter-${String(chapterNumber).padStart(3, "0")}.md`
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const parsed = parseMarkdown(fs.readFileSync(filePath, "utf8"));

  return {
    novel,
    number: chapterNumber,
    title: parsed.data.title ?? `Chapter ${chapterNumber}`,
    body: parsed.body
  };
}

export function getChapterNumbers(novel: Novel) {
  return Array.from({ length: novel.chapterCount }, (_, index) => index + 1);
}

export function getTranslatedNovel(locale: Locale, novel: Novel) {
  if (locale === "en") {
    return (
      getAllNovels("fr").find(
        (candidate) => candidate.translationOf === novel.id
      ) ?? null
    );
  }

  if (!novel.translationOf) {
    return null;
  }

  return (
    getAllNovels("en").find((candidate) => candidate.id === novel.translationOf) ??
    null
  );
}

export function normalizeLabel(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
