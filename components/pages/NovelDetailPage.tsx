import Link from "next/link";
import { notFound } from "next/navigation";

import { DisplayAd } from "@/components/ads/DisplayAd";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { NovelActions } from "@/components/novel/NovelActions";
import { StructuredData } from "@/components/seo/StructuredData";
import { getChapterNumbers, getNovel } from "@/lib/content";
import { getCategories, getCategory, getLocaleCopy } from "@/lib/i18n";
import { categoryPath, chapterPath, homePath } from "@/lib/routes";
import {
  getBreadcrumbStructuredData,
  getNovelStructuredData
} from "@/lib/seo";
import type { Locale } from "@/types/novel";

interface NovelDetailPageProps {
  locale: Locale;
  slug: string;
}

export function NovelDetailPage({ locale, slug }: NovelDetailPageProps) {
  const novel = getNovel(locale, slug);

  if (!novel) {
    notFound();
  }

  const copy = getLocaleCopy(locale);
  const chapters = getChapterNumbers(novel);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageViewTracker
        eventName="novel_view"
        locale={locale}
        properties={{
          novel_id: novel.id,
          novel_title: novel.title,
          genre: novel.genres[0]
        }}
      />
      <StructuredData data={getNovelStructuredData(locale, novel)} />
      <StructuredData
        data={getBreadcrumbStructuredData([
          { name: copy.nav.home, href: homePath(locale) },
          { name: novel.genres[0], href: categoryPath(locale, getCategorySlug(locale, novel.genres[0])) },
          { name: novel.title, href: locale === "fr" ? `/fr/roman/${novel.slug}/` : `/en/novel/${novel.slug}/` }
        ])}
      />
      <Breadcrumbs
        items={[
          { label: copy.nav.home, href: homePath(locale) },
          {
            label: novel.genres[0],
            href: categoryPath(locale, getCategorySlug(locale, novel.genres[0]))
          },
          { label: novel.title }
        ]}
      />
      <section className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <img
          src={novel.cover}
          alt={`${novel.title} cover`}
          width={360}
          height={480}
          className="aspect-[3/4] w-full max-w-[280px] rounded-lg object-cover shadow-cover"
        />
        <div>
          <p className="inline-flex rounded-full bg-pine/10 px-3 py-1 text-sm font-semibold text-pine">
            {copy.labels.completed}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
            {novel.title}
          </h1>
          <p className="mt-3 text-lg text-neutral-600">
            {copy.labels.by} {novel.author}
          </p>
          <p className="mt-4 text-sm font-semibold text-neutral-700">
            {novel.genres.join(" / ")} / {novel.chapterCount}{" "}
            {copy.labels.chapters}
          </p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-700">
            {novel.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {novel.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-3 py-1 text-sm text-neutral-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <NovelActions
              locale={locale}
              novelId={novel.id}
              novelTitle={novel.title}
              genre={novel.genres[0]}
              slug={novel.slug}
            />
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">
            {copy.labels.synopsis}
          </h2>
          <p className="mt-4 text-lg leading-8 text-neutral-700">
            {novel.longDescription}
          </p>
        </div>
        <aside className="rounded-lg border border-line bg-white p-5">
          <h2 className="font-serif text-xl font-bold text-ink">
            {copy.labels.genre}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {novel.genres.map((genre) => {
              const category = getCategoryByLabel(locale, genre);

              return category ? (
                <Link
                  key={genre}
                  href={categoryPath(locale, category.slug)}
                  className="rounded-full bg-brass/10 px-3 py-1 text-sm font-semibold text-neutral-700 hover:text-ember"
                >
                  {genre}
                </Link>
              ) : (
                <span
                  key={genre}
                  className="rounded-full bg-brass/10 px-3 py-1 text-sm font-semibold text-neutral-700"
                >
                  {genre}
                </span>
              );
            })}
          </div>
        </aside>
      </section>

      <DisplayAd locale={locale} placement="novel-detail" />

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-ink">
          {copy.labels.chapterList}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <Link
              key={chapter}
              href={chapterPath(locale, novel.slug, chapter)}
              className="rounded-lg border border-line bg-white p-4 font-semibold transition hover:border-ember hover:text-ember focus:outline-none focus:ring-2 focus:ring-ember"
            >
              {copy.labels.readChapter} {chapter}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function getCategoryByLabel(locale: Locale, label: string) {
  const direct = getCategory(locale, getCategorySlug(locale, label));

  if (direct) {
    return direct;
  }

  return undefined;
}

function getCategorySlug(locale: Locale, label: string) {
  const normalized = label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const category = getCategories(locale).find(
    (item) =>
      item.label
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase() === normalized
  );

  return category?.slug ?? normalized;
}
