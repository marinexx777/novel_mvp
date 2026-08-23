"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { getLocaleCopy } from "@/lib/i18n";
import { novelPath } from "@/lib/routes";
import type { Locale, SearchIndexItem } from "@/types/novel";

interface SearchPageProps {
  locale: Locale;
}

interface RankedResult {
  item: SearchIndexItem;
  rank: number;
}

export function SearchPage({ locale }: SearchPageProps) {
  const copy = getLocaleCopy(locale);
  const [index, setIndex] = useState<SearchIndexItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");

    fetch(`/search-index-${locale}.json`)
      .then((response) => (response.ok ? response.json() : []))
      .then((items: SearchIndexItem[]) => setIndex(items))
      .catch(() => setIndex([]));
  }, [locale]);

  const results = useMemo(() => {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return [];
    }

    return index
      .map((item): RankedResult | null => {
        const rank = getMatchRank(item, normalizedQuery);
        return rank === null ? null : { item, rank };
      })
      .filter(Boolean)
      .sort((a, b) => a!.rank - b!.rank || a!.item.title.localeCompare(b!.item.title))
      .map((result) => result!.item);
  }, [index, query]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    const nextUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
    trackEvent("search", {
      language: locale,
      query: query.trim(),
      result_count: results.length
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase text-ember">
          {copy.nav.search}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-ink">
          {copy.labels.searchTitle}
        </h1>
        <p className="mt-4 text-lg leading-8 text-neutral-700">
          {copy.labels.searchIntro}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-3 rounded-lg border border-line bg-white p-4 sm:grid-cols-[1fr_auto]"
      >
        <label className="sr-only" htmlFor="novel-search">
          {copy.labels.searchTitle}
        </label>
        <input
          id="novel-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.labels.searchPlaceholder}
          className="min-h-12 rounded-md border border-line px-4 text-base outline-none focus:border-ember focus:ring-2 focus:ring-ember/20"
        />
        <button
          type="submit"
          className="min-h-12 rounded-md bg-ember px-5 font-bold text-white transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2"
        >
          {copy.labels.searchButton}
        </button>
      </form>

      <section className="mt-8">
        <h2 className="font-serif text-2xl font-bold text-ink">
          {copy.labels.searchResults}
        </h2>

        {!query.trim() ? (
          <p className="mt-4 text-neutral-600">{copy.labels.searchEmpty}</p>
        ) : results.length === 0 ? (
          <p className="mt-4 text-neutral-600">
            {copy.labels.noSearchResults}
          </p>
        ) : (
          <div className="mt-4 grid gap-4">
            {results.map((novel) => (
              <Link
                key={novel.id}
                href={novelPath(locale, novel.slug)}
                onClick={() =>
                  trackEvent("search_result_click", {
                    language: locale,
                    novel_id: novel.id,
                    novel_title: novel.title,
                    genre: novel.genres[0],
                    query
                  })
                }
                className="rounded-lg border border-line bg-white p-4 transition hover:border-ember focus:outline-none focus:ring-2 focus:ring-ember"
              >
                <h3 className="font-serif text-2xl font-bold text-ink">
                  {novel.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  {novel.author} · {novel.genres.join(" · ")}
                </p>
                <p className="mt-3 leading-7 text-neutral-700">
                  {novel.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {novel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line px-2 py-1 text-xs text-neutral-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function getMatchRank(item: SearchIndexItem, query: string) {
  const fields = [
    item.title,
    item.author,
    item.genres.join(" "),
    item.tags.join(" "),
    item.description
  ];

  for (let index = 0; index < fields.length; index += 1) {
    if (normalize(fields[index]).includes(query)) {
      return index;
    }
  }

  return null;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
