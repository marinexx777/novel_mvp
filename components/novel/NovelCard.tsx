import Link from "next/link";

import { getLocaleCopy } from "@/lib/i18n";
import { novelPath } from "@/lib/routes";
import type { Locale, Novel } from "@/types/novel";

interface NovelCardProps {
  locale: Locale;
  novel: Novel;
  priority?: boolean;
}

export function NovelCard({ locale, novel, priority = false }: NovelCardProps) {
  const copy = getLocaleCopy(locale);

  return (
    <Link
      href={novelPath(locale, novel.slug)}
      className="group grid grid-cols-[96px_1fr] gap-4 rounded-lg border border-line bg-white p-3 shadow-sm transition hover:border-ember focus:outline-none focus:ring-2 focus:ring-ember sm:grid-cols-1"
    >
      <img
        src={novel.cover}
        alt={`${novel.title} cover`}
        width={240}
        height={320}
        loading={priority ? "eager" : "lazy"}
        className="aspect-[3/4] w-24 rounded-md object-cover shadow-cover sm:w-full"
      />
      <div className="min-w-0">
        <p className="mb-2 inline-flex rounded-full bg-pine/10 px-2 py-1 text-xs font-semibold text-pine">
          {copy.labels.completed}
        </p>
        <h3 className="text-base font-bold leading-snug text-ink group-hover:text-ember">
          {novel.title}
        </h3>
        <p className="mt-1 text-sm text-neutral-600">{novel.genres[0]}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {novel.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-2 py-1 text-xs text-neutral-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
