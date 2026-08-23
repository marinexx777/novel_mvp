import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NovelDetailPage } from "@/components/pages/NovelDetailPage";
import { getAllNovels, getNovel, getTranslatedNovel } from "@/lib/content";
import { novelPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNovels("fr").map((novel) => ({
    locale: "fr",
    slug: novel.slug
  }));
}

export function generateMetadata({
  params
}: {
  params: { locale: string; slug: string };
}): Metadata {
  if (params.locale !== "fr") {
    return {};
  }

  const novel = getNovel("fr", params.slug);
  const translatedNovel = novel ? getTranslatedNovel("fr", novel) : null;
  const canonical = novel ? novelPath("fr", novel.slug) : undefined;

  return {
    title: novel ? `Lire ${novel.title} en ligne gratuitement` : "Roman",
    description: novel?.description,
    alternates: canonical
      ? {
          canonical,
          languages: translatedNovel
            ? {
                en: novelPath("en", translatedNovel.slug),
                fr: canonical
              }
            : { fr: canonical }
        }
      : undefined,
    openGraph: novel
      ? {
          title: novel.title,
          description: novel.description,
          url: canonical,
          images: [novel.cover]
        }
      : undefined
  };
}

export default function Page({
  params
}: {
  params: { locale: string; slug: string };
}) {
  if (params.locale !== "fr") {
    notFound();
  }

  return <NovelDetailPage locale="fr" slug={params.slug} />;
}
