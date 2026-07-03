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

const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "El nombre es obligatorio")
      .min(3, "Mínimo 3 caracteres")
      .max(100, "Máximo 100 caracteres"),
    email: z
      .string()
      .min(1, "El correo es obligatorio")
      .email("Ingresa un correo válido"),
    password: z
      .string()
      .min(1, "La contraseña es obligatoria")
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const ERROR_MESSAGES: Record<string, string> = {
  "User already registered": "Ya existe una cuenta con este correo",
  "Password should be at least 6 characters":
    "La contraseña debe tener al menos 6 caracteres",
  "Rate limit exceeded":
    "Demasiados intentos. Espera un momento e intenta de nuevo",
};

export function SignupForm() {
  const router = useRouter();
  const { track } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) {
        toast.error(ERROR_MESSAGES[error.message] ?? "Error al registrarse");
        return;
      }

      toast.success("Cuenta creada correctamente. ¡Bienvenido a AcademIA!");
      track("user_signed_up", { method: "email" });
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
          Crea tu cuenta y empieza a organizarte.
        </p>
      </div>

      {/* Signup Card */}
      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              placeholder="Ej: María García"
              disabled={isLoading}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p
                id="fullName-error"
                className="text-sm font-medium text-destructive"
                role="alert"
              >
                {errors.fullName.message}
              </p>
            )}
          </div>

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
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                disabled={isLoading}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "confirmPassword-error" : undefined
                }
                {...register("confirmPassword")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className="text-sm font-medium text-destructive"
                role="alert"
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              "Crear cuenta"
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Inicia sesión
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
