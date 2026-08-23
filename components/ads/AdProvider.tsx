"use client";

import { createContext, useContext } from "react";

interface AdContextValue {
  adsenseClientId: string | null;
  rewardedAdSlot: string | null;
}

const AdContext = createContext<AdContextValue>({
  adsenseClientId: null,
  rewardedAdSlot: null
});

export function AdProvider({ children }: { children: React.ReactNode }) {
  return (
    <AdContext.Provider
      value={{
        adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || null,
        rewardedAdSlot: process.env.NEXT_PUBLIC_REWARDED_AD_SLOT || null
      }}
    >
      {children}
    </AdContext.Provider>
  );
}

export function useAdConfig() {
  return useContext(AdContext);
}
