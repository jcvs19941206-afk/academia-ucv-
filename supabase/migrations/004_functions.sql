-- 004_functions.sql
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS SETOF public.profiles
SECURITY DEFINER
LANGUAGE SQL STABLE
AS $$
  SELECT * FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_dashboard_metrics()
RETURNS TABLE (
  pending_count BIGINT,
  completed_today BIGINT,
  overdue_count BIGINT,
  total_courses BIGINT,
  completion_rate NUMERIC
)
SECURITY DEFINER
LANGUAGE SQL STABLE
AS $$
  SELECT
    (SELECT COUNT(*) FROM public.tasks WHERE user_id = auth.uid() AND status IN ('pendiente', 'en_progreso')),
    (SELECT COUNT(*) FROM public.tasks WHERE user_id = auth.uid() AND status = 'completada' AND completed_at::date = CURRENT_DATE),
    (SELECT COUNT(*) FROM public.tasks WHERE user_id = auth.uid() AND due_date < CURRENT_DATE AND status != 'completada'),
    (SELECT COUNT(*) FROM public.courses WHERE user_id = auth.uid()),
    CASE 
      WHEN (SELECT COUNT(*) FROM public.tasks WHERE user_id = auth.uid()) > 0
      THEN ROUND(
        (SELECT COUNT(*) FROM public.tasks WHERE user_id = auth.uid() AND status = 'completada')::NUMERIC /
        (SELECT COUNT(*) FROM public.tasks WHERE user_id = auth.uid())::NUMERIC * 100, 1
      )
      ELSE 0
    END;
$$;

CREATE OR REPLACE FUNCTION public.get_upcoming_tasks(days INTEGER DEFAULT 7)
RETURNS SETOF public.tasks
SECURITY DEFINER
LANGUAGE SQL STABLE
AS $$
  SELECT *
  FROM public.tasks
  WHERE user_id = auth.uid()
    AND status != 'completada'
    AND due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + days
  ORDER BY due_date ASC, priority DESC;
$$;
