import Link from "next/link";

import { getCategories } from "@/lib/i18n";
import { categoryPath } from "@/lib/routes";
import type { Locale } from "@/types/novel";

interface CategoryLinksProps {
  locale: Locale;
}

export function CategoryLinks({ locale }: CategoryLinksProps) {
  return (
    <div
      id="categories"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {getCategories(locale).map((category) => (
        <Link
          key={category.slug}
          href={categoryPath(locale, category.slug)}
          className="rounded-lg border border-line bg-white p-4 transition hover:border-ember focus:outline-none focus:ring-2 focus:ring-ember"
        >
          <h3 className="font-bold text-ink">{category.label}</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            {category.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
