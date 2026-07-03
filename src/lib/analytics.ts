import posthog from "posthog-js";

export function initAnalytics() {
  if (typeof window !== "undefined") {
    // Solo inicializar si tenemos la API key válida
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_KEY !== "phc_xxxxx") {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false, // Lo hacemos manualmente
        loaded: (ph) => {
          if (process.env.NODE_ENV === 'development') ph.opt_out_capturing();
        }
      });
      return posthog;
    }
  }
}

// Eventos a trackear (Diccionario inmutable)
export const AnalyticsEvents = {
  SIGNED_UP: "user_signed_up",
  LOGGED_IN: "user_logged_in",
  CREATED_COURSE: "course_created",
  CREATED_TASK: "task_created",
  COMPLETED_TASK: "task_completed",
  DELETED_TASK: "task_deleted",
  VIEWED_DASHBOARD: "viewed_dashboard",
  COMPLETED_ONBOARDING: "onboarding_completed",
} as const;
