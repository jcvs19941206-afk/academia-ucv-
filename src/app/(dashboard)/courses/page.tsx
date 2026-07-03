import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourses } from "@/app/actions/courses";
import { EmptyCourses } from "@/components/shared/empty-courses";
import { CourseCard } from "@/components/courses/course-card";
import { CreateCourseButton } from "@/components/courses/create-course-button";

export const metadata = {
  title: "Cursos | AcademIA",
  description: "Tus materias y asignaturas",
};

export default async function CoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const courses = await getCourses();

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-16 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Cursos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra tus asignaturas y materias.
          </p>
        </div>
        
        {courses.length > 0 && (
          <CreateCourseButton />
        )}
      </div>

      {courses.length === 0 ? (
        <EmptyCourses />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
