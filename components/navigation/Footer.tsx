import { getLocaleCopy } from "@/lib/i18n";
import { contactPath, privacyPath, termsPath } from "@/lib/routes";
import type { Locale } from "@/types/novel";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const copy = getLocaleCopy(locale);

  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-neutral-600 sm:px-6">
        <p className="font-serif text-lg font-bold text-ink">{copy.brand}</p>
        <p>{copy.footer}</p>
        <nav className="mt-3 flex flex-wrap gap-4 font-semibold" aria-label="Footer navigation">
          <a className="hover:text-ember" href={privacyPath(locale)}>
            {copy.nav.privacy}
          </a>
          <a className="hover:text-ember" href={termsPath(locale)}>
            {copy.nav.terms}
          </a>
          <a className="hover:text-ember" href={contactPath(locale)}>
            {copy.nav.contact}
          </a>
        </nav>
      </div>
    </footer>
  );
}
