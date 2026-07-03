import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourses } from "@/app/actions/courses";
import { EmptyCourses } from "@/components/shared/empty-courses";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen } from "lucide-react";

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
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo curso
          </Button>
        )}
      </div>

      {courses.length === 0 ? (
        <EmptyCourses />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="p-6 border rounded-xl shadow-sm bg-card flex flex-col gap-4 relative overflow-hidden group">
              <div 
                className="absolute top-0 left-0 w-1 h-full"
                style={{ backgroundColor: course.color }}
              />
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                    <BookOpen className="h-5 w-5" style={{ color: course.color }} />
                 </div>
                 <div>
                    <h3 className="font-semibold">{course.name}</h3>
                    {course.code && <p className="text-xs text-muted-foreground">{course.code}</p>}
                 </div>
              </div>
              {course.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
