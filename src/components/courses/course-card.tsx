"use client";

import { useState } from "react";
import { BookOpen, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Course } from "@/types";
import { CourseForm } from "./course-form";
import { CourseDeleteDialog } from "./course-delete-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="p-6 border rounded-xl shadow-sm bg-card flex flex-col gap-4 relative overflow-hidden group">
        <div
          className="absolute top-0 left-0 w-1 h-full"
          style={{ backgroundColor: course.color }}
        />
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5" style={{ color: course.color }} />
            </div>
            <div>
              <h3 className="font-semibold">{course.name}</h3>
              {course.code && (
                <p className="text-xs text-muted-foreground">{course.code}</p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Opciones del curso</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        )}
      </div>

      <CourseForm
        course={course}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <CourseDeleteDialog
        course={course}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
}
