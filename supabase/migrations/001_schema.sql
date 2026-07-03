-- 001_schema.sql
-- Enum Types
CREATE TYPE task_priority AS ENUM ('baja', 'media', 'alta', 'urgente');
CREATE TYPE task_status AS ENUM ('pendiente', 'en_progreso', 'completada', 'cancelada');
CREATE TYPE course_role AS ENUM ('owner', 'teacher', 'student');

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'America/Caracas',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_user
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

COMMENT ON TABLE public.profiles IS 'Perfiles de usuario vinculados a auth.users';
COMMENT ON COLUMN public.profiles.id IS 'UUID que coincide con auth.users.id';
COMMENT ON COLUMN public.profiles.email IS 'Correo institucional del estudiante';
COMMENT ON COLUMN public.profiles.full_name IS 'Nombre completo visible en la app';
COMMENT ON COLUMN public.profiles.timezone IS 'Zona horaria del usuario para fechas';

-- Courses Table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  color TEXT NOT NULL DEFAULT '#1F4E79',
  description TEXT,
  semester TEXT,
  credits INTEGER CHECK (credits > 0 AND credits <= 30),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE,
  
  CONSTRAINT uq_course_code_per_user
    UNIQUE (user_id, code)
);

CREATE INDEX idx_courses_user_id ON public.courses(user_id);
CREATE INDEX idx_courses_semester ON public.courses(semester);

COMMENT ON TABLE public.courses IS 'Cursos del semestre actual del estudiante';
COMMENT ON COLUMN public.courses.color IS 'Color hex asignado para identificar el curso visualmente';
COMMENT ON COLUMN public.courses.code IS 'Código de la materia (ej: CC-101)';
COMMENT ON COLUMN public.courses.semester IS 'Periodo académico (ej: 2026-I)';

-- Tasks Table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority NOT NULL DEFAULT 'media',
  status task_status NOT NULL DEFAULT 'pendiente',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE,
  
  CONSTRAINT fk_course
    FOREIGN KEY (course_id)
    REFERENCES public.courses(id)
    ON DELETE SET NULL,
  
  CONSTRAINT chk_title_length
    CHECK (char_length(title) >= 1 AND char_length(title) <= 200),
  
  CONSTRAINT chk_completed_consistency
    CHECK (
      (status = 'completada' AND completed_at IS NOT NULL) OR
      (status != 'completada' AND completed_at IS NULL)
    )
);

CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_course_id ON public.tasks(course_id);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_user_due ON public.tasks(user_id, due_date);
CREATE INDEX idx_tasks_user_status ON public.tasks(user_id, status);

COMMENT ON TABLE public.tasks IS 'Tareas académicas del estudiante';
COMMENT ON COLUMN public.tasks.completed_at IS 'Timestamp de cuando se marcó como completada (solo si status=completada)';
COMMENT ON COLUMN public.tasks.due_date IS 'Fecha límite de entrega (sin hora, timezone del usuario)';
