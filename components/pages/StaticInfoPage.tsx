import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { getLocaleCopy } from "@/lib/i18n";
import { homePath } from "@/lib/routes";
import type { Locale } from "@/types/novel";

interface StaticInfoPageProps {
  locale: Locale;
  title: string;
  body: string;
}

export function StaticInfoPage({ locale, title, body }: StaticInfoPageProps) {
  const copy = getLocaleCopy(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: copy.nav.home, href: homePath(locale) },
          { label: title }
        ]}
      />
      <p className="text-sm font-bold uppercase text-ember">
        {copy.labels.legalReviewNotice}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-bold text-ink">{title}</h1>
      <p className="mt-5 text-lg leading-8 text-neutral-700">{body}</p>
    </div>
  );
}
