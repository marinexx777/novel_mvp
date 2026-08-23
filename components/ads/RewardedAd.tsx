"use client";

import { useEffect, useState } from "react";

import { getLocaleCopy } from "@/lib/i18n";
import type { Locale } from "@/types/novel";

interface RewardedAdProps {
  locale: Locale;
  onComplete: () => void;
}

const mockDurationMs = 3000;

export function RewardedAd({ locale, onComplete }: RewardedAdProps) {
  const copy = getLocaleCopy(locale);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setComplete(true);
      onComplete();
    }, mockDurationMs);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={copy.labels.watchAd}
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-cover">
        <p className="text-sm font-bold uppercase text-ember">
          {copy.labels.watchAd}
        </p>
        <p className="mt-4 text-lg font-semibold text-ink">
          {complete
            ? copy.labels.adComplete
            : copy.labels.simulatingRewardedAd}
        </p>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-line">
          <div
            className={
              complete
                ? "h-full w-full bg-pine transition-all duration-300"
                : "h-full w-2/3 animate-pulse bg-ember"
            }
          />
        </div>
      </div>
    </div>
  );
}
