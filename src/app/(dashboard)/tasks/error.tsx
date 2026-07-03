"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/shared/error-fallback";
import * as Sentry from "@sentry/nextjs";

export default function TasksError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Tasks error:", error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <ErrorFallback
        title="Error al cargar tareas"
        message="No pudimos obtener tu lista de tareas. Intenta de nuevo en unos segundos."
        onRetry={reset}
      />
    </div>
  );
}
