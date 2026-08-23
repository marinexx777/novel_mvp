import Link from "next/link";
import { notFound } from "next/navigation";

import { DisplayAd } from "@/components/ads/DisplayAd";
import { RewardWall } from "@/components/ads/RewardWall";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ReaderSettingsControls } from "@/components/reader/ReaderSettingsControls";
import { ReaderTracker } from "@/components/reader/ReaderTracker";
import { ChapterNavLink } from "@/components/reader/ChapterNavLink";
import { StructuredData } from "@/components/seo/StructuredData";
import { getChapter } from "@/lib/content";
import { getLocaleCopy } from "@/lib/i18n";
import { markdownParagraphs } from "@/lib/markdown";
import { chapterPath, homePath, novelPath } from "@/lib/routes";
import {
  getBreadcrumbStructuredData,
  getChapterStructuredData
} from "@/lib/seo";
import type { Locale } from "@/types/novel";

interface ReaderPageProps {
  locale: Locale;
  slug: string;
  chapterNumber: number;
}

export function ReaderPage({ locale, slug, chapterNumber }: ReaderPageProps) {
  const chapter = getChapter(locale, slug, chapterNumber);

  if (!chapter) {
    notFound();
  }

  const copy = getLocaleCopy(locale);
  const paragraphs = markdownParagraphs(chapter.body);
  const previous = chapter.number > 1 ? chapter.number - 1 : null;
  const next =
    chapter.number < chapter.novel.chapterCount ? chapter.number + 1 : null;
  const currentPath = chapterPath(locale, chapter.novel.slug, chapter.number);

  return (
    <article
      data-reader-root
      data-reader-theme="sepia"
      className="reader-root mx-auto max-w-[760px] px-4 py-8 sm:px-6 sm:py-12"
    >
      <ReaderTracker
        locale={locale}
        novelId={chapter.novel.id}
        novelTitle={chapter.novel.title}
        genre={chapter.novel.genres[0]}
        chapter={chapter.number}
      />
      <StructuredData
        data={getChapterStructuredData({
          locale,
          novel: chapter.novel,
          chapterNumber: chapter.number,
          chapterTitle: chapter.title,
          url: currentPath
        })}
      />
      <StructuredData
        data={getBreadcrumbStructuredData([
          { name: copy.nav.home, href: homePath(locale) },
          { name: chapter.novel.title, href: novelPath(locale, chapter.novel.slug) },
          { name: `${copy.labels.readChapter} ${chapter.number}`, href: currentPath }
        ])}
      />
      <Breadcrumbs
        items={[
          { label: copy.nav.home, href: homePath(locale) },
          { label: chapter.novel.title, href: novelPath(locale, chapter.novel.slug) },
          { label: `${copy.labels.readChapter} ${chapter.number}` }
        ]}
      />
      <div className="flex items-start justify-between gap-4">
        <Link
          href={novelPath(locale, chapter.novel.slug)}
          className="reader-link text-sm font-bold"
        >
          {copy.labels.backToNovel}
        </Link>
        <ReaderSettingsControls locale={locale} />
      </div>

      <header className="mt-6 border-b border-line pb-6">
        <p className="reader-muted text-sm font-semibold uppercase">
          {chapter.novel.title}
        </p>
        <h1 className="reader-title mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl">
          {copy.labels.readChapter} {chapter.number}: {chapter.title}
        </h1>
      </header>

      <ChapterControls
        locale={locale}
        slug={chapter.novel.slug}
        previous={previous}
        next={next}
      />

      <RewardWall
        locale={locale}
        novelId={chapter.novel.id}
        novelTitle={chapter.novel.title}
        genre={chapter.novel.genres[0]}
        chapterNumber={chapter.number}
      >
        <div className="reader-prose mt-8 font-serif">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <DisplayAd locale={locale} placement="chapter-bottom" />
      </RewardWall>

      <ChapterControls
        locale={locale}
        slug={chapter.novel.slug}
        previous={previous}
        next={next}
      />
    </article>
  );
}

interface ChapterControlsProps {
  locale: Locale;
  slug: string;
  previous: number | null;
  next: number | null;
}

function ChapterControls({
  locale,
  slug,
  previous,
  next
}: ChapterControlsProps) {
  const copy = getLocaleCopy(locale);

  return (
    <nav
      className="mt-6 grid grid-cols-2 gap-3"
      aria-label="Chapter navigation"
    >
      {previous ? (
        <ChapterNavLink
          href={chapterPath(locale, slug, previous)}
          eventName="previous_chapter"
          locale={locale}
          chapterNumber={previous}
          className="reader-panel rounded-md border px-4 py-3 text-center text-sm font-bold transition hover:text-ember focus:outline-none focus:ring-2 focus:ring-ember"
        >
          {copy.labels.previousChapter}
        </ChapterNavLink>
      ) : (
        <span className="reader-panel reader-muted rounded-md border px-4 py-3 text-center text-sm font-bold">
          {copy.labels.noPrevious}
        </span>
      )}

      {next ? (
        <ChapterNavLink
          href={chapterPath(locale, slug, next)}
          eventName="next_chapter"
          locale={locale}
          chapterNumber={next}
          className="reader-panel rounded-md border px-4 py-3 text-center text-sm font-bold transition hover:text-ember focus:outline-none focus:ring-2 focus:ring-ember"
        >
          {copy.labels.nextChapter}
        </ChapterNavLink>
      ) : (
        <span className="reader-panel reader-muted rounded-md border px-4 py-3 text-center text-sm font-bold">
          {copy.labels.noNext}
        </span>
      )}
    </nav>
  );
}
