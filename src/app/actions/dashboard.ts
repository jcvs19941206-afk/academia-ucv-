"use server";

import { createClient } from "@/lib/supabase/server";

export interface DashboardMetrics {
  pending_count: number;
  completed_today: number;
  overdue_count: number;
  total_courses: number;
  completion_rate: number;
}

export interface WeeklyActivity {
  date: string;
  completed: number;
  created: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      pending_count: 0,
      completed_today: 0,
      overdue_count: 0,
      total_courses: 0,
      completion_rate: 0,
    };
  }

  // Obtener fecha actual en zona del usuario
  const today = new Date().toISOString().split("T")[0]!;

  // Ejecutar consultas en paralelo
  const [
    { count: pendingCount },
    { count: completedToday },
    { count: overdueCount },
    { count: totalCourses },
    { count: totalTasks },
    { count: completedTasks },
  ] = await Promise.all([
    // Pendientes (sin completar ni cancelar)
    supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .in("status", ["pending", "in_progress"]),

    // Completadas hoy
    supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "completed")
      .gte("completed_at", today),

    // Vencidas y no completadas
    supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .neq("status", "completed")
      .lt("due_date", today),

    // Total cursos
    supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),

    // Total tareas (para tasa de completitud)
    supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),

    // Tareas completadas
    supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "completed"),
  ]);

  const total = totalTasks ?? 0;
  const completed = completedTasks ?? 0;

  return {
    pending_count: pendingCount ?? 0,
    completed_today: completedToday ?? 0,
    overdue_count: overdueCount ?? 0,
    total_courses: totalCourses ?? 0,
    completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export async function getWeeklyActivity(): Promise<WeeklyActivity[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Últimos 7 días
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]!);
  }

  // Consultar tareas completadas y creadas por día
  const { data: tasks } = await supabase
    .from("tasks")
    .select("created_at, completed_at, status")
    .eq("user_id", user.id)
    .gte("created_at", dates[0]!);

  const activity = dates.map((date) => {
    const dayTasks = (tasks ?? []).filter((t) =>
      t.created_at?.startsWith(date)
    );
    const completedDay = (tasks ?? []).filter(
      (t) => t.completed_at?.startsWith(date) && t.status === "completed"
    );

    return {
      date,
      completed: completedDay.length,
      created: dayTasks.length,
    };
  });

  return activity;
}

export async function getUpcomingTasks(limit = 5) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const today = new Date().toISOString().split("T")[0]!;

  const { data } = await supabase
    .from("tasks")
    .select(`*, courses:course_id(name, color)`)
    .eq("user_id", user.id)
    .neq("status", "completed")
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("priority", { ascending: false })
    .limit(limit);

  return data ?? [];
}
