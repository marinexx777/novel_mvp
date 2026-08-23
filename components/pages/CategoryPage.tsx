import { notFound } from "next/navigation";

import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { NovelCard } from "@/components/novel/NovelCard";
import { getNovelsByCategory } from "@/lib/content";
import { getCategory, getLocaleCopy } from "@/lib/i18n";
import { homePath } from "@/lib/routes";
import type { Locale } from "@/types/novel";

interface CategoryPageProps {
  locale: Locale;
  categorySlug: string;
}

export function CategoryPage({ locale, categorySlug }: CategoryPageProps) {
  const category = getCategory(locale, categorySlug);

  if (!category) {
    notFound();
  }

  const novels = getNovelsByCategory(locale, categorySlug);
  const copy = getLocaleCopy(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageViewTracker
        eventName="category_view"
        locale={locale}
        properties={{ genre: category.label }}
      />
      <Breadcrumbs
        items={[
          { label: copy.nav.home, href: homePath(locale) },
          { label: category.label }
        ]}
      />
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase text-ember">
          {copy.nav.browse}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-ink">
          {category.label}
        </h1>
        <p className="mt-4 text-lg leading-8 text-neutral-700">
          {category.description}
        </p>
      </div>

      <p className="mt-8 text-sm font-semibold text-neutral-600">
        {novels.length} {copy.labels.novels}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {novels.map((novel) => (
          <NovelCard key={novel.id} locale={locale} novel={novel} />
        ))}
      </div>
    </div>
  );
}
