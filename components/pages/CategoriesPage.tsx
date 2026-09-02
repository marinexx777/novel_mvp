import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import {
  CategoriesBrowser,
  type BrowsableNovel
} from "@/components/pages/CategoriesBrowser";
import { getAllNovels } from "@/lib/content";
import { getCategories, getLocaleCopy } from "@/lib/i18n";
import { homePath } from "@/lib/routes";
import type { Locale } from "@/types/novel";

interface CategoriesPageProps {
  locale: Locale;
}

function getPageCopy(locale: Locale) {
  return locale === "fr"
    ? {
        eyebrow: "Catalogue",
        title: "Categories"
      }
    : {
        eyebrow: "Catalog",
        title: "Categories"
      };
}

function isRealNovel(novel: { chapterCount: number }) {
  return novel.chapterCount > 20;
}

export function CategoriesPage({ locale }: CategoriesPageProps) {
  const copy = getLocaleCopy(locale);
  const pageCopy = getPageCopy(locale);
  const categories = getCategories(locale);
  const novels: BrowsableNovel[] = getAllNovels(locale)
    .map((novel) => ({
      id: novel.id,
      title: novel.title,
      slug: novel.slug,
      author: novel.author,
      description: novel.description,
      cover: novel.cover,
      genres: novel.genres,
      tags: novel.tags,
      chapterCount: novel.chapterCount
    }))
    .sort((a, b) => {
      const aReal = isRealNovel(a) ? 0 : 1;
      const bReal = isRealNovel(b) ? 0 : 1;
      return aReal - bReal || a.title.localeCompare(b.title);
    });

  return (
    <div className="bg-[#f7f5f1]">
      <PageViewTracker
        eventName="category_view"
        locale={locale}
        properties={{ genre: "all" }}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: copy.nav.home, href: homePath(locale) },
            { label: copy.nav.browse }
          ]}
        />

        <section className="relative overflow-hidden bg-[#232027] p-8 text-white shadow-cover sm:p-10">
          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffbdca]">
              {pageCopy.eyebrow}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-black leading-tight sm:text-5xl">
              {pageCopy.title}
            </h1>
          </div>
        </section>

        <CategoriesBrowser
          locale={locale}
          categories={categories}
          novels={novels}
        />
      </div>
    </div>
  );
}