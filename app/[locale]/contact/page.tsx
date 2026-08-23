import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StaticInfoPage } from "@/components/pages/StaticInfoPage";
import { getLocaleCopy, isLocale } from "@/lib/i18n";
import { contactPath } from "@/lib/routes";
import type { Locale } from "@/types/novel";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }];
}

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  if (!isLocale(params.locale)) {
    return {};
  }

  const locale = params.locale as Locale;
  const copy = getLocaleCopy(locale);

  return {
    title: copy.labels.contactTitle,
    description: copy.labels.contactBody,
    alternates: {
      canonical: contactPath(locale),
      languages: {
        en: contactPath("en"),
        fr: contactPath("fr")
      }
    }
  };
}

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const copy = getLocaleCopy(locale);

  // Needs legal review before production launch.
  return (
    <StaticInfoPage
      locale={locale}
      title={copy.labels.contactTitle}
      body={copy.labels.contactBody}
    />
  );
}
