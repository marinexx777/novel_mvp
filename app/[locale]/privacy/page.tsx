import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StaticInfoPage } from "@/components/pages/StaticInfoPage";
import { getLocaleCopy } from "@/lib/i18n";
import { privacyPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale !== "en") {
    return {};
  }

  const copy = getLocaleCopy("en");

  return {
    title: copy.labels.privacyTitle,
    description: copy.labels.privacyBody,
    alternates: {
      canonical: privacyPath("en"),
      languages: {
        en: privacyPath("en"),
        fr: privacyPath("fr")
      }
    }
  };
}

export default function Page({ params }: { params: { locale: string } }) {
  if (params.locale !== "en") {
    notFound();
  }

  const copy = getLocaleCopy("en");

  // Needs legal review before production launch.
  return (
    <StaticInfoPage
      locale="en"
      title={copy.labels.privacyTitle}
      body={copy.labels.privacyBody}
    />
  );
}
