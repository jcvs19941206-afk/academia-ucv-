"use client";

import { useEffect } from "react";
import { useAnalytics } from "@/hooks/use-analytics";

interface DashboardTrackerProps {
  pendingCount: number;
  completionRate: number;
}

export function DashboardTracker({ pendingCount, completionRate }: DashboardTrackerProps) {
  const { track } = useAnalytics();

  useEffect(() => {
    track("viewed_dashboard", { 
      pending_count: pendingCount, 
      completion_rate: completionRate 
    });
  }, [track, pendingCount, completionRate]);

  return null;
}
