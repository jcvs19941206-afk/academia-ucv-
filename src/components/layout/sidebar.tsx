"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Settings,
  Plus,
  LogOut,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { CourseForm } from "@/components/courses/course-form";
import { CourseDeleteDialog } from "@/components/courses/course-delete-dialog";
import type { Course } from "@/types";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Cursos", icon: BookOpen },
  { href: "/tasks", label: "Tareas", icon: ClipboardList },
  { href: "/settings", label: "Configuración", icon: Settings },
];

interface SidebarProps {
  courses?: Course[];
}

export function Sidebar({ courses = [] }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | undefined>(undefined);
  const [deleteCourse, setDeleteCourse] = useState<Course | undefined>(undefined);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  function handleEditCourse(course: Course) {
    setEditCourse(course);
    setIsCourseFormOpen(true);
  }

  function handleDeleteCourse(course: Course) {
    setDeleteCourse(course);
    setIsDeleteOpen(true);
  }

  function handleNewCourse() {
    setEditCourse(undefined);
    setIsCourseFormOpen(true);
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión");
      return;
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 p-4 bg-background border-r w-64 transition-all duration-300">
        {/* Brand */}
        <div className="mb-8 px-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity"
          >
            <GraduationCap className="h-8 w-8" strokeWidth={2.5} />
            <div className="flex flex-col">
              <h1 className="font-bold text-xl leading-none">AcademIA</h1>
              <span className="text-xs text-muted-foreground font-medium">
                Master&apos;s Management
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all active:scale-[0.98]",
                  isActive
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-muted-foreground hover:bg-accent/5 hover:text-accent"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Courses Section */}
        <div className="mt-6 px-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Mis Cursos
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground hover:text-foreground"
              onClick={handleNewCourse}
              aria-label="Agregar curso"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="space-y-0.5">
            {courses.length === 0 && (
              <p className="text-xs text-muted-foreground px-1 py-1.5">
                Sin cursos aún.{" "}
                <button
                  onClick={handleNewCourse}
                  className="text-primary hover:underline"
                >
                  Crear uno
                </button>
              </p>
            )}
            {courses.map((course) => (
              <div
                key={course.id}
                className="group flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent/5 transition-colors"
              >
                <div
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: course.color }}
                />
                <span className="truncate text-sm text-muted-foreground group-hover:text-foreground flex-1 transition-colors">
                  {course.name}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      aria-label={`Opciones de ${course.name}`}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem
                      onClick={() => handleEditCourse(course)}
                      className="cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteCourse(course)}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom actions */}
        <div className="mt-auto pt-4 space-y-2">
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={handleNewCourse}
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Curso</span>
          </Button>
          <div className="border-t pt-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Course Form Sheet */}
      <CourseForm
        course={editCourse}
        open={isCourseFormOpen}
        onOpenChange={setIsCourseFormOpen}
      />

      {/* Course Delete Dialog */}
      <CourseDeleteDialog
        course={deleteCourse}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
}
