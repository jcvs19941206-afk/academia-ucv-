"use client";

import { usePostHog } from "posthog-js/react";
import { AnalyticsEvents } from "@/lib/analytics";

type EventName = typeof AnalyticsEvents[keyof typeof AnalyticsEvents] | "error_occurred";

export function useAnalytics() {
  const posthog = usePostHog();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const track = (eventName: string, properties?: Record<string, any>) => {
    // Fire and forget
    if (posthog && typeof posthog.capture === 'function') {
      try {
        posthog.capture(eventName, properties);
      } catch (e) {
        // Ignorar errores de tracking para no afectar UI
        console.warn("Analytics error", e);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const identify = (id: string, traits?: Record<string, any>) => {
    if (posthog && typeof posthog.identify === 'function') {
      try {
        posthog.identify(id, traits);
      } catch (e) {}
    }
  };

  const reset = () => {
    if (posthog && typeof posthog.reset === 'function') {
      try {
        posthog.reset();
      } catch (e) {}
    }
  };

  return { track, identify, reset };
}
