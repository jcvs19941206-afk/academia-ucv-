"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary caught an error:", error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
      <div className="p-4 rounded-full bg-destructive/10 mb-6">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Error inesperado</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Algo salió mal. Puedes intentar de nuevo o volver al inicio.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <Home className="h-4 w-4 mr-2" />
            Ir al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
