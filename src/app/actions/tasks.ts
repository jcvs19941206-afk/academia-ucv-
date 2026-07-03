"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/types";
import type { TaskFilters } from "@/lib/validations/task-filters";
import { taskSchema } from "@/lib/validations/task";

// ─── CREATE ───────────────────────────────────────────────────────────────────
export async function createTask(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Debes iniciar sesión" };

    const rawData = Object.fromEntries(formData);
    // Convert empty strings to null for optional UUID fields
    if (!rawData.course_id) rawData.course_id = "";
    if (!rawData.due_date) rawData.due_date = "";

    const parsed = taskSchema.safeParse({
      ...rawData,
      course_id: rawData.course_id || null,
      due_date: rawData.due_date || null,
    });

    if (!parsed.success) {
      return {
        success: false,
        message: "Datos inválidos",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title: parsed.data.title,
        description: parsed.data.description || null,
        course_id: parsed.data.course_id || null,
        priority: parsed.data.priority,
        status: parsed.data.status,
        due_date: parsed.data.due_date || null,
      })
      .select("*, courses:course_id(name, color)")
      .single();

    if (error) return { success: false, message: "Error al crear la tarea" };

    revalidatePath("/dashboard");
    revalidatePath("/tasks");

    return { success: true, message: "Tarea creada correctamente", data };
  } catch {
    return { success: false, message: "Error de conexión. Intenta de nuevo." };
  }
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export async function updateTask(
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

    const parsed = taskSchema.safeParse({
      ...rawData,
      course_id: rawData.course_id || null,
      due_date: rawData.due_date || null,
    });

    if (!parsed.success) {
      return {
        success: false,
        message: "Datos inválidos",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const updateData: Record<string, unknown> = {
      title: parsed.data.title,
      description: parsed.data.description || null,
      course_id: parsed.data.course_id || null,
      priority: parsed.data.priority,
      status: parsed.data.status,
      due_date: parsed.data.due_date || null,
      completed_at:
        parsed.data.status === "completed" ? new Date().toISOString() : null,
    };

    const { error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { success: false, message: "Error al actualizar la tarea" };

    revalidatePath("/dashboard");
    revalidatePath("/tasks");

    return { success: true, message: "Tarea actualizada correctamente" };
  } catch {
    return { success: false, message: "Error de conexión. Intenta de nuevo." };
  }
}

// ─── TOGGLE STATUS (optimistic-friendly) ─────────────────────────────────────
export async function toggleTaskStatus(
  id: string,
  newStatus: "pending" | "in_progress" | "completed"
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "No autorizado" };

    const { error } = await supabase
      .from("tasks")
      .update({
        status: newStatus,
        completed_at:
          newStatus === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { success: false, message: "Error al actualizar estado" };

    revalidatePath("/dashboard");
    revalidatePath("/tasks");

    return { success: true, message: "Estado actualizado" };
  } catch {
    return { success: false, message: "Error de conexión" };
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function deleteTask(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "No autorizado" };

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { success: false, message: "Error al eliminar la tarea" };

    revalidatePath("/dashboard");
    revalidatePath("/tasks");

    return { success: true, message: "Tarea eliminada correctamente" };
  } catch {
    return { success: false, message: "Error de conexión" };
  }
}

// ─── LIST with filters ────────────────────────────────────────────────────────
export async function getTasks(filters?: TaskFilters) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("tasks")
    .select("*, courses:course_id(name, color)")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (filters?.course_id) query = query.eq("course_id", filters.course_id);
  if (filters?.priority) query = query.eq("priority", filters.priority);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.search) query = query.ilike("title", `%${filters.search}%`);

  const { data } = await query;
  return data ?? [];
}

// ─── GET SINGLE ───────────────────────────────────────────────────────────────
export async function getTask(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("tasks")
    .select("*, courses:course_id(name, color)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  return data;
}

