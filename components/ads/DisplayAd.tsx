import { getLocaleCopy } from "@/lib/i18n";
import type { Locale } from "@/types/novel";

interface DisplayAdProps {
  locale: Locale;
  placement: "novel-detail" | "chapter-bottom";
}

export function DisplayAd({ locale, placement }: DisplayAdProps) {
  const copy = getLocaleCopy(locale);

  return (
    <aside
      className="my-10 rounded-lg border border-dashed border-line bg-white px-4 py-5 text-center text-xs font-semibold uppercase text-neutral-500"
      aria-label={copy.labels.advertisement}
      data-ad-placement={placement}
    >
      {copy.labels.advertisement}
    </aside>
  );
}
