import { getOrCreateAnonymousId } from "@/lib/storage";
import type { Locale } from "@/types/novel";

export type AnalyticsEventName =
  | "home_view"
  | "category_view"
  | "search"
  | "search_result_click"
  | "novel_view"
  | "start_read"
  | "add_to_library"
  | "remove_from_library"
  | "chapter_view"
  | "chapter_3"
  | "chapter_5"
  | "chapter_10"
  | "chapter_20"
  | "chapter_50"
  | "next_chapter"
  | "previous_chapter"
  | "reward_wall_view"
  | "reward_ad_click"
  | "reward_ad_started"
  | "reward_ad_completed"
  | "reward_unlock_success"
  | "reward_unlock_continue"
  | "return_visit";

export interface AnalyticsProperties {
  anonymous_id?: string | null;
  language?: Locale;
  novel_id?: string;
  novel_title?: string;
  genre?: string;
  chapter_number?: number;
  traffic_source?: string;
  [key: string]: string | number | boolean | null | undefined;
}

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      target: string | Date,
      properties?: AnalyticsProperties
    ) => void;
    posthog?: {
      capture: (name: string, properties?: AnalyticsProperties) => void;
    };
  }
}

export function trackEvent(
  name: AnalyticsEventName,
  properties: AnalyticsProperties = {}
) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    ...getPublicEventProperties(),
    ...properties
  };

  window.gtag?.("event", name, payload);
  window.posthog?.capture(name, payload);
}

function getPublicEventProperties(): AnalyticsProperties {
  return {
    anonymous_id: getOrCreateAnonymousId(),
    traffic_source: document.referrer || "direct"
  };
}
