import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourses } from "@/app/actions/courses";
import { getTasks } from "@/app/actions/tasks";
import type { TaskFilters } from "@/lib/validations/task-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { TasksFilters } from "@/components/tasks/tasks-filters";
import { TasksTable } from "@/components/tasks/tasks-table";
import { NewTaskButtonClient } from "@/components/tasks/new-task-button";

import { EmptyTasks } from "@/components/shared/empty-tasks";

export const metadata = {
  title: "Tareas | AcademIA",
  description: "Gestión de entregas y tareas",
};

interface TasksPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

function TasksTableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-12 w-full rounded-lg" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;

  const filters: TaskFilters = {
    course_id: params.course_id ?? null,
    priority: (params.priority as TaskFilters["priority"]) ?? null,
    status: (params.status as TaskFilters["status"]) ?? null,
    search: params.search ?? null,
  };

  const [courses, tasks] = await Promise.all([getCourses(), getTasks(filters)]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-16 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tareas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona tus entregas y objetivos de investigación.
          </p>
        </div>
        <NewTaskButtonClient courses={courses} />
      </div>

      {tasks.length === 0 && Object.keys(filters).every(k => !filters[k as keyof TaskFilters]) ? (
        <EmptyTasks hasCourses={courses.length > 0} courses={courses} />
      ) : (
        <>
          {/* Filters */}
          <Suspense fallback={<Skeleton className="h-[72px] w-full rounded-xl" />}>
            <TasksFilters courses={courses} />
          </Suspense>

          {/* Table */}
          <Suspense fallback={<TasksTableSkeleton />}>
            <TasksTable tasks={tasks} courses={courses} />
          </Suspense>
        </>
      )}
    </div>
  );
}
