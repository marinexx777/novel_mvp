import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryPage } from "@/components/pages/CategoryPage";
import { getCategory, getCategories } from "@/lib/i18n";
import { categoryPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories("en").map((category) => ({
    locale: "en",
    genre: category.slug
  }));
}

export function generateMetadata({
  params
}: {
  params: { locale: string; genre: string };
}): Metadata {
  if (params.locale !== "en") {
    return {};
  }

  const category = getCategory("en", params.genre);
  const index = getCategories("en").findIndex(
    (item) => item.slug === params.genre
  );
  const frCategory = index >= 0 ? getCategories("fr")[index] : null;

  return {
    title: category?.label ?? "Category",
    description: category?.description,
    alternates: {
      canonical: categoryPath("en", params.genre),
      languages: frCategory
        ? {
            en: categoryPath("en", params.genre),
            fr: categoryPath("fr", frCategory.slug)
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
  if (params.locale !== "en") {
    notFound();
  }

  return <CategoryPage locale="en" categorySlug={params.genre} />;
}
