"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/types";
import { courseSchema } from "@/lib/validations/course";


// ─── CREATE ───────────────────────────────────────────────────────────────────
export async function createCourse(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, message: "Debes iniciar sesión para crear un curso" };
    }

    const rawData = Object.fromEntries(formData);
    const parsed = courseSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        message: "Datos inválidos",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { data: existingCourse } = await supabase
      .from("courses")
      .select("id")
      .eq("user_id", user.id)
      .ilike("name", parsed.data.name)
      .maybeSingle();

    if (existingCourse) {
      return { success: false, message: "Ya existe un curso con este nombre" };
    }


    const { data, error } = await supabase
      .from("courses")
      .insert({
        user_id: user.id,
        name: parsed.data.name,
        code: parsed.data.code || null,
        color: parsed.data.color,
        description: parsed.data.description || null,
        semester: parsed.data.semester || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return { success: false, message: "Ya existe un curso con ese código" };
      }
      return { success: false, message: "Error al crear el curso. Intenta de nuevo." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/tasks");

    return { success: true, message: "Curso creado correctamente", data };
  } catch {
    return { success: false, message: "Error de conexión. Intenta de nuevo." };
  }
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export async function updateCourse(
  id: string,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "No autorizado" };

    const rawData = Object.fromEntries(formData);
    const parsed = courseSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        message: "Datos inválidos",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { data: existingCourse } = await supabase
      .from("courses")
      .select("id")
      .eq("user_id", user.id)
      .ilike("name", parsed.data.name)
      .neq("id", id)
      .maybeSingle();

    if (existingCourse) {
      return { success: false, message: "Ya existe un curso con este nombre" };
    }


    const { error } = await supabase
      .from("courses")
      .update({
        name: parsed.data.name,
        code: parsed.data.code || null,
        color: parsed.data.color,
        description: parsed.data.description || null,
        semester: parsed.data.semester || null,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      if (error.code === "23505") {
        return { success: false, message: "Ya existe otro curso con ese código" };
      }
      return { success: false, message: "Error al actualizar el curso" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/tasks");

    return { success: true, message: "Curso actualizado correctamente" };
  } catch {
    return { success: false, message: "Error de conexión. Intenta de nuevo." };
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function deleteCourse(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "No autorizado" };

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { success: false, message: "Error al eliminar el curso" };

    revalidatePath("/dashboard");
    revalidatePath("/tasks");

    return { success: true, message: "Curso eliminado correctamente" };
  } catch {
    return { success: false, message: "Error de conexión. Intenta de nuevo." };
  }
}

// ─── LIST (for Server Components) ─────────────────────────────────────────────
export async function getCourses() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  return data ?? [];
}
