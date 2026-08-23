import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SearchPage } from "@/components/pages/SearchPage";
import { getLocaleCopy } from "@/lib/i18n";
import { searchPath } from "@/lib/routes";

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
    title: copy.labels.searchTitle,
    description: copy.labels.searchIntro,
    alternates: {
      canonical: searchPath("en"),
      languages: {
        en: searchPath("en"),
        fr: searchPath("fr")
      }
    }
  };
}

export default function Page({ params }: { params: { locale: string } }) {
  if (params.locale !== "en") {
    notFound();
  }

  return <SearchPage locale="en" />;
}
