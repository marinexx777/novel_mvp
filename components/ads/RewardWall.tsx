"use client";

import { useEffect, useState } from "react";

import { RewardedAd } from "@/components/ads/RewardedAd";
import { productConfig } from "@/lib/config";
import { getLocaleCopy } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import {
  isRewardUnlocked,
  unlockRewardReading
} from "@/lib/storage";
import type { Locale } from "@/types/novel";

interface RewardWallProps {
  locale: Locale;
  novelId: string;
  novelTitle: string;
  genre: string;
  chapterNumber: number;
  children: React.ReactNode;
}

export function RewardWall({
  locale,
  novelId,
  novelTitle,
  genre,
  chapterNumber,
  children
}: RewardWallProps) {
  const copy = getLocaleCopy(locale);
  const [allowed, setAllowed] = useState(
    chapterNumber <= productConfig.freeChapterCount
  );
  const [watchingAd, setWatchingAd] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const canRead =
      chapterNumber <= productConfig.freeChapterCount || isRewardUnlocked();
    setAllowed(canRead);

    if (!canRead) {
      trackEvent("reward_wall_view", getEventProperties());
    }
  }, [chapterNumber]);

  function getEventProperties() {
    return {
      language: locale,
      novel_id: novelId,
      novel_title: novelTitle,
      genre,
      chapter_number: chapterNumber
    };
  }

  function handleWatchAd() {
    trackEvent("reward_ad_click", getEventProperties());
    trackEvent("reward_ad_started", getEventProperties());
    setWatchingAd(true);
  }

  function handleAdComplete() {
    unlockRewardReading(productConfig.rewardUnlockMinutes);
    trackEvent("reward_ad_completed", getEventProperties());
    trackEvent("reward_unlock_success", getEventProperties());
    setWatchingAd(false);
    setCompleted(true);
  }

  function handleContinue() {
    trackEvent("reward_unlock_continue", getEventProperties());
    setAllowed(true);
  }

  if (allowed) {
    return <>{children}</>;
  }

  return (
    <section className="my-10 rounded-lg border border-line bg-white p-6 text-center shadow-sm">
      <p className="text-sm font-bold uppercase text-ember">
        {copy.labels.continueReadingFree}
      </p>
      <h2 className="mt-3 font-serif text-3xl font-bold text-ink">
        {copy.labels.continueReadingFree}
      </h2>
      <p className="mt-3 text-neutral-700">{copy.labels.rewardWallBody}</p>
      <p className="mt-2 text-sm font-semibold text-neutral-600">
        {copy.labels.noPaymentRequired}
      </p>

      {completed ? (
        <button
          type="button"
          onClick={handleContinue}
          className="mt-6 rounded-md bg-ember px-5 py-3 font-bold text-white transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2"
        >
          {copy.labels.continue}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleWatchAd}
          className="mt-6 rounded-md bg-ember px-5 py-3 font-bold text-white transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2"
        >
          {copy.labels.watchAd}
        </button>
      )}

      {watchingAd ? (
        <RewardedAd locale={locale} onComplete={handleAdComplete} />
      ) : null}
    </section>
  );
}
