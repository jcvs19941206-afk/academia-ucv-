"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAnalytics } from "@/hooks/use-analytics";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Ingresa un correo válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Correo o contraseña incorrectos",
  "Email not confirmed":
    "Por favor confirma tu correo electrónico antes de iniciar sesión",
  "User not found": "No existe una cuenta con este correo",
  "Rate limit exceeded":
    "Demasiados intentos. Espera un momento e intenta de nuevo",
};

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { track } = useAnalytics();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(ERROR_MESSAGES[error.message] ?? "Error al iniciar sesión");
        return;
      }

      toast.success("¡Bienvenido a AcademIA!");
      track("user_logged_in", { method: "email" });
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Error de conexión. Intenta de nuevo");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Brand Header */}
      <div className="mb-8 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-primary">
          <GraduationCap className="h-10 w-10" strokeWidth={2.5} />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            AcademIA
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Organiza tu maestría, alcanza tus metas.
        </p>
      </div>

      {/* Login Card */}
      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              autoComplete="email"
              disabled={isLoading}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p
                id="email-error"
                className="text-sm font-medium text-destructive"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password")}
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
            {errors.password && (
              <p
                id="password-error"
                className="text-sm font-medium text-destructive"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link
              href="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </Card>

      {/* Footer Links */}
      <div className="mt-8 flex justify-center gap-6 text-sm text-muted-foreground">
        <Link href="#" className="hover:text-foreground transition-colors">
          Privacidad
        </Link>
        <Link href="#" className="hover:text-foreground transition-colors">
          Términos
        </Link>
        <Link href="#" className="hover:text-foreground transition-colors">
          Soporte
        </Link>
      </div>
    </div>
  );
}
