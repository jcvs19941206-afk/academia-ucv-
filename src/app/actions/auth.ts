"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const emailSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
});

export async function requestPasswordReset(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const parsed = emailSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, message: "Correo inválido", errors: parsed.error.flatten().fieldErrors };

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    console.error("Error reset password:", error);
  }

  // Siempre devolver éxito (seguridad: no revelar si el email existe)
  return { success: true, message: "Si el correo existe, recibirás instrucciones" };
}

const passwordSchema = z
  .object({
    code: z.string().min(1, "Código de recuperación faltante"),
    new_password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
      .regex(/[a-z]/, "Debe tener al menos una minúscula")
      .regex(/[0-9]/, "Debe tener al menos un número"),
    confirm_password: z.string().min(1, "Confirma la contraseña"),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

export async function resetPassword(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  
  if (!parsed.success) {
    return { success: false, message: "Datos inválidos", errors: parsed.error.flatten().fieldErrors };
  }

  // 1. Intercambiar el código por una sesión (esto autentica temporalmente al usuario)
  const { error: sessionError } = await supabase.auth.exchangeCodeForSession(parsed.data.code);
  
  if (sessionError) {
    return { success: false, message: "Enlace inválido o expirado. Solicita uno nuevo." };
  }

  // 2. Actualizar la contraseña del usuario autenticado
  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.new_password,
  });

  if (updateError) {
    return { success: false, message: "Error al actualizar la contraseña" };
  }

  return { success: true, message: "Contraseña actualizada correctamente" };
}
