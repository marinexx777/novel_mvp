import { brandName } from "@/lib/config";
import type { Locale, Novel } from "@/types/novel";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(
    /\/$/,
    ""
  );
}

export function absoluteUrl(pathname: string) {
  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;
  return `${getSiteUrl()}${normalizedPathname}`;
}

export function getHomeAlternates(locale: Locale) {
  return {
    canonical: `/${locale}/`,
    languages: {
      en: "/en/",
      fr: "/fr/"
    }
  };
}

export function getNovelStructuredData(locale: Locale, novel: Novel) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: novel.title,
    author: {
      "@type": "Person",
      name: novel.author
    },
    inLanguage: locale,
    genre: novel.genres,
    description: novel.description,
    image: absoluteUrl(novel.cover),
    url: absoluteUrl(locale === "fr" ? `/fr/roman/${novel.slug}/` : `/en/novel/${novel.slug}/`),
    isAccessibleForFree: true,
    bookFormat: "EBook",
    publisher: {
      "@type": "Organization",
      name: brandName
    }
  };
}

export function getChapterStructuredData({
  locale,
  novel,
  chapterNumber,
  chapterTitle,
  url
}: {
  locale: Locale;
  novel: Novel;
  chapterNumber: number;
  chapterTitle: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      locale === "fr"
        ? `${novel.title} Chapitre ${chapterNumber}: ${chapterTitle}`
        : `${novel.title} Chapter ${chapterNumber}: ${chapterTitle}`,
    inLanguage: locale,
    isPartOf: {
      "@type": "Book",
      name: novel.title
    },
    position: chapterNumber,
    author: {
      "@type": "Person",
      name: novel.author
    },
    description: novel.description,
    image: absoluteUrl(novel.cover),
    url: absoluteUrl(url)
  };
}

export function getBreadcrumbStructuredData(
  items: Array<{ name: string; href: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href)
    }))
  };
}
