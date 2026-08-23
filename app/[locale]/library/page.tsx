import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LibraryPage } from "@/components/pages/LibraryPage";
import { getAllNovels } from "@/lib/content";
import { getLocaleCopy } from "@/lib/i18n";
import { libraryPath } from "@/lib/routes";
import type { NovelSummary } from "@/types/novel";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale !== "en") {
    return {};
  }

  const copy = getLocaleCopy("en");

  return {
    title: copy.nav.library,
    description: copy.labels.libraryEmptyBody,
    alternates: {
      canonical: libraryPath("en"),
      languages: {
        en: libraryPath("en"),
        fr: libraryPath("fr")
      }
    }
  };
}

export default function Page({ params }: { params: { locale: string } }) {
  if (params.locale !== "en") {
    notFound();
  }

  return <LibraryPage locale="en" novels={getNovelSummaries("en")} />;
}

function getNovelSummaries(locale: "en"): NovelSummary[] {
  return getAllNovels(locale).map(
    ({
      id,
      title,
      slug,
      author,
      cover,
      genres,
      tags,
      description,
      chapterCount
    }) => ({
      id,
      title,
      slug,
      author,
      cover,
      genres,
      tags,
      description,
      chapterCount
    })
  );
}
