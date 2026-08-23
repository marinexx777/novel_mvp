"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { novelPath } from "@/lib/routes";
import type { CategoryDefinition, Locale } from "@/types/novel";

export interface BrowsableNovel {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  cover: string;
  genres: string[];
  tags: string[];
  chapterCount: number;
}

interface CategoriesBrowserProps {
  locale: Locale;
  categories: CategoryDefinition[];
  novels: BrowsableNovel[];
}

const pageSize = 12;

const cardAccents = [
  "from-[#4a2c66] to-[#a84b89]",
  "from-[#105766] to-[#3bbfc4]",
  "from-[#bd5628] to-[#f1a84c]",
  "from-[#6c1023] to-[#ed3455]",
  "from-[#b5446b] to-[#ff97b2]",
  "from-[#133d75] to-[#457dc4]",
  "from-[#1b544a] to-[#57a67d]",
  "from-[#17171b] to-[#585364]"
];

function getBrowserCopy(locale: Locale) {
  return locale === "fr"
    ? {
        all: "Tout",
        filterLabel: "Filtrer par categorie",
        loadMore: "Charger plus",
        complete: "Tous les romans de cette selection sont affiches.",
        noBooks: "Aucun roman dans cette categorie pour le moment.",
        chapters: "chapitres"
      }
    : {
        all: "All",
        filterLabel: "Filter by category",
        loadMore: "Load more",
        complete: "All books in this selection are displayed.",
        noBooks: "No books in this category yet.",
        chapters: "chapters"
      };
}

export function CategoriesBrowser({
  locale,
  categories,
  novels
}: CategoriesBrowserProps) {
  const copy = getBrowserCopy(locale);
  const [selectedSlug, setSelectedSlug] = useState("all");
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const selectedCategory = categories.find(
    (category) => category.slug === selectedSlug
  );

  const filteredNovels = useMemo(() => {
    if (!selectedCategory) {
      return novels;
    }

    const categoryLabel = normalizeLabel(selectedCategory.label);
    return novels.filter((novel) =>
      novel.genres.some((genre) => normalizeLabel(genre) === categoryLabel)
    );
  }, [novels, selectedCategory]);

  const visibleNovels = filteredNovels.slice(0, visibleCount);
  const hasMore = visibleCount < filteredNovels.length;

  function selectCategory(slug: string) {
    setSelectedSlug(slug);
    setVisibleCount(pageSize);
  }

  return (
    <section className="mt-8">
      <div
        className="flex flex-wrap items-center gap-2 border-b border-line bg-white p-4"
        aria-label={copy.filterLabel}
      >
        <button
          type="button"
          aria-pressed={selectedSlug === "all"}
          onClick={() => selectCategory("all")}
          className={filterButtonClass(selectedSlug === "all")}
        >
          {copy.all}
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            aria-pressed={selectedSlug === category.slug}
            onClick={() => selectCategory(category.slug)}
            className={filterButtonClass(selectedSlug === category.slug)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="mt-6 border-b-2 border-ink pb-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-ember">
          {copy.filterLabel}
        </p>
        <h2 className="mt-1 font-serif text-3xl font-black text-ink">
          {selectedCategory ? selectedCategory.label : copy.all}
        </h2>
      </div>

      {visibleNovels.length === 0 ? (
        <p className="mt-8 border border-line bg-white p-6 text-neutral-600">
          {copy.noBooks}
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleNovels.map((novel, index) => (
            <CategoryNovelCard
              key={novel.id}
              locale={locale}
              novel={novel}
              index={index}
              chaptersLabel={copy.chapters}
            />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        {hasMore ? (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + pageSize)}
            className="border border-ember bg-ember px-6 py-3 text-sm font-black text-white transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2"
          >
            {copy.loadMore}
          </button>
        ) : filteredNovels.length > 0 ? (
          <p className="text-sm font-semibold text-neutral-500">
            {copy.complete}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function CategoryNovelCard({
  locale,
  novel,
  index,
  chaptersLabel
}: {
  locale: Locale;
  novel: BrowsableNovel;
  index: number;
  chaptersLabel: string;
}) {
  return (
    <Link
      href={novelPath(locale, novel.slug)}
      className="group grid grid-cols-[112px_minmax(0,1fr)] gap-4 border border-line bg-white p-3 transition hover:border-ember focus:outline-none focus:ring-2 focus:ring-ember"
    >
      <div
        className={`relative h-[158px] overflow-hidden bg-gradient-to-br p-3 shadow-[6px_6px_0_#e6e1da] ${
          cardAccents[index % cardAccents.length]
        }`}
      >
        <img
          src={novel.cover}
          alt={`${novel.title} cover`}
          width={240}
          height={320}
          loading={index < 6 ? "eager" : "lazy"}
          className="absolute bottom-0 right-0 h-[138px] w-[100px] object-cover shadow-cover transition group-hover:scale-105"
        />
        <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.16em] text-white/75">
          Complete
        </span>
      </div>
      <div className="min-w-0 pt-1">
        <h3 className="text-lg font-black leading-snug text-ink group-hover:text-ember">
          {novel.title}
        </h3>
        <p className="mt-2 text-sm text-neutral-500">{novel.author}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-700">
          {novel.description}
        </p>
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-ember">
          {novel.genres[0]} / {novel.chapterCount} {chaptersLabel}
        </p>
      </div>
    </Link>
  );
}

function filterButtonClass(active: boolean) {
  return active
    ? "whitespace-nowrap rounded-full bg-ink px-4 py-2 text-sm font-bold text-white"
    : "whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-neutral-700 transition hover:bg-ink hover:text-white focus:outline-none focus:ring-2 focus:ring-ember";
}

function normalizeLabel(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}