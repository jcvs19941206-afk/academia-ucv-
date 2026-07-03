"use client";

import { useState, useEffect } from "react";

const ONBOARDING_KEY = "academia_onboarded";

export function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if running on the client
    if (typeof window !== "undefined") {
      const onboarded = localStorage.getItem(ONBOARDING_KEY);
      if (!onboarded) {
        // eslint-disable-next-line
        setIsFirstVisit(true);
      }
      setIsLoading(false);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setIsFirstVisit(false);
  };

  return {
    isFirstVisit,
    isLoading,
    completeOnboarding,
  };
}
