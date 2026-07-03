"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  full_name: z.string().min(3, "Mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
  timezone: z.string().optional(),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Contraseña actual requerida"),
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

export async function updateProfile(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "No autorizado" };

  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, message: "Datos inválidos", errors: parsed.error.flatten().fieldErrors };

  const { error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", user.id);

  if (error) return { success: false, message: "Error al actualizar perfil" };

  revalidatePath("/settings");
  return { success: true, message: "Perfil actualizado correctamente" };
}

export async function updatePassword(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "No autorizado" };

  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, message: "Datos inválidos", errors: parsed.error.flatten().fieldErrors };

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: parsed.data.current_password,
  });
  if (signInError) return { success: false, message: "Contraseña actual incorrecta" };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.new_password });
  if (error) return { success: false, message: "Error al cambiar contraseña" };

  return { success: true, message: "Contraseña actualizada correctamente" };
}
