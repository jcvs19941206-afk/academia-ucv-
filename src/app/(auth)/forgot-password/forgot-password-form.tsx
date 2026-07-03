"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { GraduationCap, Loader2, ArrowLeft } from "lucide-react";
import { requestPasswordReset } from "@/app/actions/auth";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-6" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enviando...
        </>
      ) : (
        "Enviar instrucciones"
      )}
    </Button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordReset, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-primary">
          <GraduationCap className="h-10 w-10" strokeWidth={2.5} />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            AcademIA
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Recupera el acceso a tu cuenta.
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <form action={formAction} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@correo.com"
              autoComplete="email"
              required
              aria-invalid={!!state?.errors?.email}
              aria-describedby={state?.errors?.email ? "email-error" : undefined}
            />
            {state?.errors?.email && (
              <p
                id="email-error"
                className="text-sm font-medium text-destructive"
                role="alert"
              >
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <SubmitButton />
        </form>

        <div className="mt-6 pt-6 border-t text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a inicio de sesión
          </Link>
        </div>
      </Card>
    </div>
  );
}
