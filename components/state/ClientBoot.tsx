"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";
import { getExistingAnonymousId, getOrCreateAnonymousId } from "@/lib/storage";
import type { Locale } from "@/types/novel";

interface ClientBootProps {
  locale: Locale;
}

export function ClientBoot({ locale }: ClientBootProps) {
  useEffect(() => {
    const existingAnonymousId = getExistingAnonymousId();
    getOrCreateAnonymousId();

    if (existingAnonymousId) {
      trackEvent("return_visit", {
        language: locale
      });
    }
  }, [locale]);

  return null;
}
