"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";
import type { Locale } from "@/types/novel";

interface ChapterNavLinkProps {
  href: string;
  eventName: Extract<AnalyticsEventName, "next_chapter" | "previous_chapter">;
  locale: Locale;
  chapterNumber: number;
  className: string;
  children: ReactNode;
}

export function ChapterNavLink({
  href,
  eventName,
  locale,
  chapterNumber,
  className,
  children
}: ChapterNavLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackEvent(eventName, {
          language: locale,
          chapter_number: chapterNumber
        })
      }
    >
      {children}
    </Link>
  );
}
