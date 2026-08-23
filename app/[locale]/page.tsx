import type { Metadata } from "next";

import { HomePage } from "@/components/pages/HomePage";
import { productConfig } from "@/lib/config";
import { getLocaleCopy, isLocale } from "@/lib/i18n";
import { getHomeAlternates } from "@/lib/seo";
import type { Locale } from "@/types/novel";

export function generateStaticParams() {
  return productConfig.supportedLanguages.map((locale) => ({ locale }));
}

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  const locale = params.locale as Locale;
  const copy = getLocaleCopy(locale);

  return {
    title: copy.home.title,
    description: copy.siteDescription,
    alternates: getHomeAlternates(locale),
    openGraph: {
      title: copy.home.title,
      description: copy.siteDescription,
      url: `/${locale}/`,
      type: "website"
    }
  };
}

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    return null;
  }

  return <HomePage locale={params.locale} />;
}
