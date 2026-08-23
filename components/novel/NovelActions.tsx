"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { getLocaleCopy } from "@/lib/i18n";
import { chapterPath } from "@/lib/routes";
import {
  addLibraryEntry,
  getNovelReadingHistory,
  isInLibrary
} from "@/lib/storage";
import type { Locale } from "@/types/novel";

interface NovelActionsProps {
  locale: Locale;
  novelId: string;
  novelTitle: string;
  genre: string;
  slug: string;
}

export function NovelActions({
  locale,
  novelId,
  novelTitle,
  genre,
  slug
}: NovelActionsProps) {
  const copy = getLocaleCopy(locale);
  const [chapter, setChapter] = useState(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const history = getNovelReadingHistory(novelId);

    if (history) {
      setChapter(history.chapter);
    }

    setSaved(isInLibrary(novelId));
  }, [novelId]);

  function handleAddToLibrary() {
    addLibraryEntry(novelId);
    trackEvent("add_to_library", {
      language: locale,
      novel_id: novelId,
      novel_title: novelTitle,
      genre
    });
    setSaved(true);
  }

  function handleStartRead() {
    trackEvent("start_read", {
      language: locale,
      novel_id: novelId,
      novel_title: novelTitle,
      genre,
      chapter_number: chapter
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href={chapterPath(locale, slug, chapter)}
        onClick={handleStartRead}
        className="inline-flex justify-center rounded-md bg-ember px-5 py-3 font-bold text-white transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2"
      >
        {chapter > 1
          ? `${copy.labels.continueReading} — ${copy.labels.readChapter} ${chapter}`
          : copy.labels.startReading}
      </Link>
      <button
        type="button"
        onClick={handleAddToLibrary}
        disabled={saved}
        className="inline-flex justify-center rounded-md border border-line bg-white px-5 py-3 font-bold text-ink transition hover:border-ember hover:text-ember focus:outline-none focus:ring-2 focus:ring-ember disabled:cursor-default disabled:border-pine/30 disabled:bg-pine/10 disabled:text-pine"
      >
        {saved ? copy.labels.savedToLibrary : copy.labels.addToLibrary}
      </button>
    </div>
  );
}
