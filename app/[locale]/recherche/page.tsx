import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SearchPage } from "@/components/pages/SearchPage";
import { getLocaleCopy } from "@/lib/i18n";
import { searchPath } from "@/lib/routes";

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
    title: copy.labels.searchTitle,
    description: copy.labels.searchIntro,
    alternates: {
      canonical: searchPath("fr"),
      languages: {
        en: searchPath("en"),
        fr: searchPath("fr")
      }
    }
  };
}

export default function Page({ params }: { params: { locale: string } }) {
  if (params.locale !== "fr") {
    notFound();
  }

  return <SearchPage locale="fr" />;
}
