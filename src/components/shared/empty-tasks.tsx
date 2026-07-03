"use client";

import { useState } from "react";
import { ClipboardList, PlusCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import type { Course } from "@/types";
import Link from "next/link";

interface EmptyTasksProps {
  hasCourses: boolean;
  courses?: Course[];
}

export function EmptyTasks({ hasCourses, courses = [] }: EmptyTasksProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed rounded-xl bg-card/50 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
        {hasCourses ? (
          <ClipboardList className="h-8 w-8" />
        ) : (
          <BookOpen className="h-8 w-8" />
        )}
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">
        {hasCourses ? "No tienes tareas registradas" : "Primero crea un curso"}
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        {hasCourses 
          ? "Añade tu primera tarea o entrega para comenzar a trackear tu progreso."
          : "Para poder crear y organizar tus tareas, necesitas asignarles un curso de referencia."
        }
      </p>
      
      {hasCourses ? (
        <>
          <Button size="lg" className="rounded-full font-medium" onClick={() => setOpen(true)}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Añade tu primera tarea
          </Button>
          <TaskDetailModal open={open} onOpenChange={setOpen} courses={courses} />
        </>
      ) : (
        <Button size="lg" className="rounded-full font-medium" asChild>
          <Link href="/courses">
            <PlusCircle className="mr-2 h-5 w-5" />
            Ir a Cursos
          </Link>
        </Button>
      )}
    </div>
  );
}
