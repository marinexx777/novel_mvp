import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NovelDetailPage } from "@/components/pages/NovelDetailPage";
import { getAllNovels, getNovel, getTranslatedNovel } from "@/lib/content";
import { novelPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNovels("en").map((novel) => ({
    locale: "en",
    slug: novel.slug
  }));
}

export function generateMetadata({
  params
}: {
  params: { locale: string; slug: string };
}): Metadata {
  if (params.locale !== "en") {
    return {};
  }

  const novel = getNovel("en", params.slug);
  const translatedNovel = novel ? getTranslatedNovel("en", novel) : null;
  const canonical = novel ? novelPath("en", novel.slug) : undefined;

  return {
    title: novel ? `Read ${novel.title} Online Free` : "Novel",
    description: novel?.description,
    alternates: canonical
      ? {
          canonical,
          languages: translatedNovel
            ? {
                en: canonical,
                fr: novelPath("fr", translatedNovel.slug)
              }
            : { en: canonical }
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
  if (params.locale !== "en") {
    notFound();
  }

  return <NovelDetailPage locale="en" slug={params.slug} />;
}
