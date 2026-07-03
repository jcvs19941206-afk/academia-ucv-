// ─── Shared Server Action response type ─────────────────────────────────────
export type ActionResponse<T = void> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export type Priority = "urgente" | "alta" | "media" | "baja";
export type TaskStatus = "pendiente" | "en_progreso" | "completada" | "cancelada";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  user_id: string;
  name: string;
  code?: string;
  color: string;
  description?: string;
  semester?: string;
  credits?: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  course_id?: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  pending_count: number;
  completed_today: number;
  overdue_count: number;
  total_courses: number;
  completion_rate: number;
}
