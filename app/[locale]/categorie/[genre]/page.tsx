import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryPage } from "@/components/pages/CategoryPage";
import { getCategory, getCategories } from "@/lib/i18n";
import { categoryPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories("fr").map((category) => ({
    locale: "fr",
    genre: category.slug
  }));
}

export function generateMetadata({
  params
}: {
  params: { locale: string; genre: string };
}): Metadata {
  if (params.locale !== "fr") {
    return {};
  }

  const category = getCategory("fr", params.genre);
  const index = getCategories("fr").findIndex(
    (item) => item.slug === params.genre
  );
  const enCategory = index >= 0 ? getCategories("en")[index] : null;

  return {
    title: category?.label ?? "Catégorie",
    description: category?.description,
    alternates: {
      canonical: categoryPath("fr", params.genre),
      languages: enCategory
        ? {
            en: categoryPath("en", enCategory.slug),
            fr: categoryPath("fr", params.genre)
          }
        : undefined
    }
  };
}

export default function Page({
  params
}: {
  params: { locale: string; genre: string };
}) {
  if (params.locale !== "fr") {
    notFound();
  }

  return <CategoryPage locale="fr" categorySlug={params.genre} />;
}
