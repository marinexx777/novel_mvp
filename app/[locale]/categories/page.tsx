import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoriesPage } from "@/components/pages/CategoriesPage";
import { getLocaleCopy, isLocale } from "@/lib/i18n";
import { categoriesPath } from "@/lib/routes";
import type { Locale } from "@/types/novel";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }];
}

function getMetadataCopy(locale: Locale) {
  return locale === "fr"
    ? {
        title: "Categories",
        description:
          "Parcourez tous les romans termines par categorie ou affichez toute la bibliotheque."
      }
    : {
        title: "Categories",
        description:
          "Browse all completed novels by category or view the full library."
      };
}

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  if (!isLocale(params.locale)) {
    return {};
  }

  const locale = params.locale;
  const meta = getMetadataCopy(locale);
  const copy = getLocaleCopy(locale);

  return {
    title: `${meta.title} | ${copy.brand}`,
    description: meta.description,
    alternates: {
      canonical: categoriesPath(locale),
      languages: {
        en: categoriesPath("en"),
        fr: categoriesPath("fr")
      }
    }
  };
}

export default function Page({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  return <CategoriesPage locale={params.locale} />;
}