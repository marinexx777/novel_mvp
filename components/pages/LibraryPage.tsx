"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { getLocaleCopy } from "@/lib/i18n";
import { chapterPath, homePath } from "@/lib/routes";
import {
  getLibraryEntries,
  getNovelReadingHistory,
  removeLibraryEntry,
  type LibraryEntry
} from "@/lib/storage";
import type { Locale, NovelSummary } from "@/types/novel";

interface LibraryPageProps {
  locale: Locale;
  novels: NovelSummary[];
}

export function LibraryPage({ locale, novels }: LibraryPageProps) {
  const copy = getLocaleCopy(locale);
  const [entries, setEntries] = useState<LibraryEntry[]>([]);

  useEffect(() => {
    setEntries(getLibraryEntries());
  }, []);

  const savedNovels = useMemo(() => {
    return entries
      .map((entry) => {
        const novel = novels.find((item) => item.id === entry.novelId);
        const history = getNovelReadingHistory(entry.novelId);

        return novel
          ? {
              entry,
              novel,
              chapter: history?.chapter ?? 1,
              lastReadAt: history?.lastReadAt ?? entry.addedAt
            }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) =>
        b!.lastReadAt.localeCompare(a!.lastReadAt)
      ) as Array<{
      entry: LibraryEntry;
      novel: NovelSummary;
      chapter: number;
      lastReadAt: string;
    }>;
  }, [entries, novels]);

  function handleRemove(novelId: string) {
    const novel = novels.find((item) => item.id === novelId);
    trackEvent("remove_from_library", {
      language: locale,
      novel_id: novelId,
      novel_title: novel?.title,
      genre: novel?.genres[0]
    });
    setEntries(removeLibraryEntry(novelId));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase text-ember">
          {copy.nav.library}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-ink">
          {copy.nav.library}
        </h1>
      </div>

      {savedNovels.length === 0 ? (
        <section className="mt-8 rounded-lg border border-line bg-white p-6">
          <h2 className="font-serif text-2xl font-bold text-ink">
            {copy.labels.libraryEmptyTitle}
          </h2>
          <p className="mt-2 leading-7 text-neutral-600">
            {copy.labels.libraryEmptyBody}
          </p>
          <Link
            href={homePath(locale)}
            className="mt-5 inline-flex rounded-md bg-ember px-5 py-3 font-bold text-white transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2"
          >
            {copy.labels.exploreNovels}
          </Link>
        </section>
      ) : (
        <div className="mt-8 grid gap-4">
          {savedNovels.map(({ novel, chapter, lastReadAt }) => (
            <article
              key={novel.id}
              className="grid gap-4 rounded-lg border border-line bg-white p-4 sm:grid-cols-[96px_1fr] sm:items-center"
            >
              <img
                src={novel.cover}
                alt={`${novel.title} cover`}
                width={120}
                height={160}
                className="aspect-[3/4] w-24 rounded-md object-cover shadow-cover"
              />
              <div className="min-w-0">
                <h2 className="font-serif text-2xl font-bold text-ink">
                  {novel.title}
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  {copy.labels.currentChapter}: {chapter}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {copy.labels.recentReadingTime}:{" "}
                  {new Date(lastReadAt).toLocaleString(locale)}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={chapterPath(locale, novel.slug, chapter)}
                    className="inline-flex justify-center rounded-md bg-ember px-4 py-2 text-sm font-bold text-white transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2"
                  >
                    {copy.labels.continueReading}
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(novel.id)}
                    className="inline-flex justify-center rounded-md border border-line bg-white px-4 py-2 text-sm font-bold text-ink transition hover:border-ember hover:text-ember focus:outline-none focus:ring-2 focus:ring-ember"
                  >
                    {copy.labels.removeFromLibrary}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
