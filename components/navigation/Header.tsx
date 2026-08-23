import Link from "next/link";

import { getLocaleCopy, localeNames } from "@/lib/i18n";
import { categoriesPath, homePath, libraryPath, searchPath } from "@/lib/routes";
import type { Locale } from "@/types/novel";

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const copy = getLocaleCopy(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
        <Link
          href={homePath(locale)}
          className="font-serif text-xl font-bold text-ink"
        >
          {copy.brand}
        </Link>

        <nav
          className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-neutral-700 sm:w-auto sm:gap-5"
          aria-label="Main navigation"
        >
          <Link className="hover:text-ember" href={homePath(locale)}>
            {copy.nav.home}
          </Link>
          <Link className="hover:text-ember" href={categoriesPath(locale)}>
            {copy.nav.browse}
          </Link>
          <Link className="hover:text-ember" href={searchPath(locale)}>
            {copy.nav.search}
          </Link>
          <Link className="hover:text-ember" href={libraryPath(locale)}>
            {copy.nav.library}
          </Link>
          <span className="hidden h-4 w-px bg-line sm:inline-block" />
          <Link
            className={locale === "en" ? "text-ember" : "hover:text-ember"}
            href="/en/"
            hrefLang="en"
          >
            EN
          </Link>
          <Link
            className={locale === "fr" ? "text-ember" : "hover:text-ember"}
            href="/fr/"
            hrefLang="fr"
          >
            FR
          </Link>
          <span className="sr-only">{localeNames[locale]}</span>
        </nav>
      </div>
    </header>
  );
}