"use client";

import { useEffect } from "react";

import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";
import {
  getNovelReadingHistory,
  getOrCreateAnonymousId,
  saveReadingHistory
} from "@/lib/storage";

interface ReaderTrackerProps {
  locale: "en" | "fr";
  novelId: string;
  novelTitle: string;
  genre: string;
  chapter: number;
}

export function ReaderTracker({
  locale,
  novelId,
  novelTitle,
  genre,
  chapter
}: ReaderTrackerProps) {
  useEffect(() => {
    getOrCreateAnonymousId();
    const eventProperties = {
      language: locale,
      novel_id: novelId,
      novel_title: novelTitle,
      genre,
      chapter_number: chapter
    };

    trackEvent("chapter_view", eventProperties);

    const milestoneEvent = getMilestoneEvent(chapter);

    if (milestoneEvent) {
      trackEvent(milestoneEvent, eventProperties);
    }

    const savedHistory = getNovelReadingHistory(novelId);
    let frame = 0;
    let lastSavedAt = 0;

    if (
      savedHistory?.chapter === chapter &&
      savedHistory.scrollPosition > 0.02
    ) {
      window.requestAnimationFrame(() => {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, Math.max(0, maxScroll * savedHistory.scrollPosition));
      });
    }

    const save = () => {
      saveReadingHistory(novelId, chapter, getScrollPosition());
    };

    const onScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        const now = Date.now();

        if (now - lastSavedAt > 500) {
          save();
          lastSavedAt = now;
        }

        frame = 0;
      });
    };

    save();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("beforeunload", save);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      save();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeunload", save);
    };
  }, [locale, novelId, novelTitle, genre, chapter]);

  return null;
}

function getMilestoneEvent(chapter: number): AnalyticsEventName | null {
  const events: Record<number, AnalyticsEventName> = {
    3: "chapter_3",
    5: "chapter_5",
    10: "chapter_10",
    20: "chapter_20",
    50: "chapter_50"
  };

  return events[chapter] ?? null;
}

function getScrollPosition() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (maxScroll <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, window.scrollY / maxScroll));
}
