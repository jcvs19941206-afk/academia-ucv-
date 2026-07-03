"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/shared/error-fallback";
import * as Sentry from "@sentry/nextjs";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <ErrorFallback
        title="Error al cargar el panel"
        message="No pudimos cargar tus métricas recientes. Intenta refrescar la página."
        onRetry={reset}
      />
    </div>
  );
}
