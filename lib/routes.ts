import type { Locale } from "@/types/novel";

export function homePath(locale: Locale) {
  return `/${locale}/`;
}

export function categoriesPath(locale: Locale) {
  return `/${locale}/categories/`;
}

export function categoryPath(locale: Locale, slug: string) {
  return locale === "fr"
    ? `/fr/categorie/${slug}/`
    : `/en/category/${slug}/`;
}

export function searchPath(locale: Locale) {
  return locale === "fr" ? "/fr/recherche/" : "/en/search/";
}

export function libraryPath(locale: Locale) {
  return locale === "fr" ? "/fr/bibliotheque/" : "/en/library/";
}

export function privacyPath(locale: Locale) {
  return locale === "fr" ? "/fr/confidentialite/" : "/en/privacy/";
}

export function termsPath(locale: Locale) {
  return locale === "fr" ? "/fr/conditions/" : "/en/terms/";
}

export function contactPath(locale: Locale) {
  return `/${locale}/contact/`;
}

export function novelPath(locale: Locale, slug: string) {
  return locale === "fr" ? `/fr/roman/${slug}/` : `/en/novel/${slug}/`;
}

export function chapterSegment(locale: Locale, chapterNumber: number) {
  return locale === "fr"
    ? `chapitre-${chapterNumber}`
    : `chapter-${chapterNumber}`;
}

export function chapterPath(
  locale: Locale,
  slug: string,
  chapterNumber: number
) {
  return locale === "fr"
    ? `/fr/roman/${slug}/${chapterSegment(locale, chapterNumber)}/`
    : `/en/novel/${slug}/${chapterSegment(locale, chapterNumber)}/`;
}

export function parseChapterSegment(locale: Locale, segment: string) {
  const prefix = locale === "fr" ? "chapitre-" : "chapter-";

  if (!segment.startsWith(prefix)) {
    return null;
  }

  const chapter = Number(segment.slice(prefix.length));
  return Number.isInteger(chapter) && chapter > 0 ? chapter : null;
}