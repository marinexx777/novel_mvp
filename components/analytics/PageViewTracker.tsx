"use client";

import { useEffect } from "react";

import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";
import type { Locale } from "@/types/novel";

interface PageViewTrackerProps {
  eventName: AnalyticsEventName;
  locale: Locale;
  properties?: Record<string, string | number | boolean | null | undefined>;
}

export function PageViewTracker({
  eventName,
  locale,
  properties
}: PageViewTrackerProps) {
  useEffect(() => {
    trackEvent(eventName, {
      language: locale,
      ...properties
    });
  }, [eventName, locale, properties]);

  return null;
}
