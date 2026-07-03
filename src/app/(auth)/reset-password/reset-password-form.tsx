"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/app/actions/auth";
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
          Actualizando...
        </>
      ) : (
        "Restablecer contraseña"
      )}
    </Button>
  );
}

interface ResetPasswordFormProps {
  code: string;
}

export function ResetPasswordForm({ code }: ResetPasswordFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(resetPassword, null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      // Tras restablecer la contraseña, redirigimos al login
      router.push("/login");
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, router]);

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
          Crea una nueva contraseña segura.
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <form action={formAction} className="space-y-4" noValidate>
          {/* El código viaja oculto para el server action */}
          <input type="hidden" name="code" value={code} />

          <div className="space-y-2">
            <Label htmlFor="new_password">Nueva contraseña</Label>
            <div className="relative">
              <Input
                id="new_password"
                name="new_password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                aria-invalid={!!state?.errors?.new_password}
                aria-describedby={state?.errors?.new_password ? "new_password-error" : undefined}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {state?.errors?.new_password && (
              <p
                id="new_password-error"
                className="text-sm font-medium text-destructive"
                role="alert"
              >
                {state.errors.new_password[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirmar contraseña</Label>
            <div className="relative">
              <Input
                id="confirm_password"
                name="confirm_password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                aria-invalid={!!state?.errors?.confirm_password}
                aria-describedby={state?.errors?.confirm_password ? "confirm_password-error" : undefined}
              />
            </div>
            {state?.errors?.confirm_password && (
              <p
                id="confirm_password-error"
                className="text-sm font-medium text-destructive"
                role="alert"
              >
                {state.errors.confirm_password[0]}
              </p>
            )}
          </div>

          <SubmitButton />
        </form>
      </Card>
    </div>
  );
}
