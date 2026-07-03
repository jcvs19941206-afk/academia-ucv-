"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 text-center p-4">
          <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Algo salió mal</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y estamos trabajando en ello.
          </p>
          <Button onClick={() => reset()} size="lg" className="rounded-full">
            Intentar de nuevo
          </Button>
        </div>
      </body>
    </html>
  );
}
