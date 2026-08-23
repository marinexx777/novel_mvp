import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LibraryPage } from "@/components/pages/LibraryPage";
import { getAllNovels } from "@/lib/content";
import { getLocaleCopy } from "@/lib/i18n";
import { libraryPath } from "@/lib/routes";
import type { NovelSummary } from "@/types/novel";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "fr" }];
}

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale !== "fr") {
    return {};
  }

  const copy = getLocaleCopy("fr");

  return {
    title: copy.nav.library,
    description: copy.labels.libraryEmptyBody,
    alternates: {
      canonical: libraryPath("fr"),
      languages: {
        en: libraryPath("en"),
        fr: libraryPath("fr")
      }
    }
  };
}

export default function Page({ params }: { params: { locale: string } }) {
  if (params.locale !== "fr") {
    notFound();
  }

  return <LibraryPage locale="fr" novels={getNovelSummaries("fr")} />;
}

function getNovelSummaries(locale: "fr"): NovelSummary[] {
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
