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
  return getAllNovels("fr").flatMap((novel) =>
    getChapterNumbers(novel).map((chapter) => ({
      locale: "fr",
      slug: novel.slug,
      chapter: `chapitre-${chapter}`
    }))
  );
}

export function generateMetadata({
  params
}: {
  params: { locale: string; slug: string; chapter: string };
}): Metadata {
  if (params.locale !== "fr") {
    return {};
  }

  const chapterNumber = parseChapterSegment("fr", params.chapter);
  const chapter = chapterNumber
    ? getChapter("fr", params.slug, chapterNumber)
    : null;

  if (!chapter) {
    return {
      title: "Chapitre"
    };
  }

  const translatedNovel = getTranslatedNovel("fr", chapter.novel);
  const canonical = chapterPath("fr", chapter.novel.slug, chapter.number);

  return {
    title: `${chapter.novel.title} Chapitre ${chapter.number}: ${chapter.title}`,
    description: chapter.novel.description,
    alternates: {
      canonical,
      languages: translatedNovel
        ? {
            en: chapterPath("en", translatedNovel.slug, chapter.number),
            fr: canonical
          }
        : { fr: canonical }
    },
    openGraph: {
      title: `${chapter.novel.title} Chapitre ${chapter.number}: ${chapter.title}`,
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
  if (params.locale !== "fr") {
    notFound();
  }

  const chapterNumber = parseChapterSegment("fr", params.chapter);

  if (!chapterNumber) {
    notFound();
  }

  return (
    <ReaderPage
      locale="fr"
      slug={params.slug}
      chapterNumber={chapterNumber}
    />
  );
}
