"use client";

import { useState } from "react";
import { PlusCircle, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseForm } from "@/components/courses/course-form";

export function EmptyDashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed rounded-xl bg-card/50 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
        <GraduationCap className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">¡Bienvenido a AcademIA!</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        El primer paso para organizar tu maestría es crear tu primer curso o asignatura.
      </p>
      
      <Button size="lg" className="rounded-full font-medium" onClick={() => setOpen(true)}>
        <PlusCircle className="mr-2 h-5 w-5" />
        Crear primer curso
      </Button>

      <CourseForm open={open} onOpenChange={setOpen} />
    </div>
  );
}
