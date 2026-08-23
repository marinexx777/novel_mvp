import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "../globals.css";

import { AdProvider } from "@/components/ads/AdProvider";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { Footer } from "@/components/navigation/Footer";
import { Header } from "@/components/navigation/Header";
import { ClientBoot } from "@/components/state/ClientBoot";
import { brandName, productConfig } from "@/lib/config";
import { getLocaleCopy, isLocale } from "@/lib/i18n";
import type { Locale } from "@/types/novel";

export const dynamicParams = false;

export function generateStaticParams() {
  return productConfig.supportedLanguages.map((locale) => ({ locale }));
}

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  const locale = isLocale(params.locale)
    ? params.locale
    : productConfig.defaultLanguage;
  const copy = getLocaleCopy(locale);

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
    ),
    title: {
      default: brandName,
      template: `%s | ${brandName}`
    },
    description: copy.siteDescription
  };
}

export default function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-paper">
        <AnalyticsProvider />
        <ClientBoot locale={locale} />
        <AdProvider>
          <Header locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />
        </AdProvider>
      </body>
    </html>
  );
}
