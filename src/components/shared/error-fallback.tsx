"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorFallback({
  title = "Algo salió mal",
  message = "No pudimos cargar esta sección. Intenta de nuevo.",
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4 w-full border border-dashed rounded-lg bg-muted/30">
      <div className="p-3 rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />Reintentar
        </Button>
      )}
    </div>
  );
}
