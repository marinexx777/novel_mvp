import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReaderPage } from "@/components/pages/ReaderPage";
import {
  getAllNovels,
  getChapter,
  getChapterNumbers,
  getTranslatedNovel
} from "@/lib/content";
import { chapterPath, parseChapterSegment } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNovels("en").flatMap((novel) =>
    getChapterNumbers(novel).map((chapter) => ({
      locale: "en",
      slug: novel.slug,
      chapter: `chapter-${chapter}`
    }))
  );
}

export function generateMetadata({
  params
}: {
  params: { locale: string; slug: string; chapter: string };
}): Metadata {
  if (params.locale !== "en") {
    return {};
  }

  const chapterNumber = parseChapterSegment("en", params.chapter);
  const chapter = chapterNumber
    ? getChapter("en", params.slug, chapterNumber)
    : null;

  if (!chapter) {
    return {
      title: "Chapter"
    };
  }

  const translatedNovel = getTranslatedNovel("en", chapter.novel);
  const canonical = chapterPath("en", chapter.novel.slug, chapter.number);

  return {
    title: `${chapter.novel.title} Chapter ${chapter.number}: ${chapter.title}`,
    description: chapter.novel.description,
    alternates: {
      canonical,
      languages: translatedNovel
        ? {
            en: canonical,
            fr: chapterPath("fr", translatedNovel.slug, chapter.number)
          }
        : { en: canonical }
    },
    openGraph: {
      title: `${chapter.novel.title} Chapter ${chapter.number}: ${chapter.title}`,
      description: chapter.novel.description,
      url: canonical,
      images: [chapter.novel.cover]
    }
  };
}

export default function Page({
  params
}: {
  params: { locale: string; slug: string; chapter: string };
}) {
  if (params.locale !== "en") {
    notFound();
  }

  const chapterNumber = parseChapterSegment("en", params.chapter);

  if (!chapterNumber) {
    notFound();
  }

  return (
    <ReaderPage
      locale="en"
      slug={params.slug}
      chapterNumber={chapterNumber}
    />
  );
}
