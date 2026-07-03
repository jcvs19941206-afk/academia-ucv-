"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createCourse, updateCourse } from "@/app/actions/courses";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Course } from "@/types";

const PRESET_COLORS = [
  "#1F4E79", "#2EC4B6", "#E67E22", "#8E44AD", "#27AE60",
  "#E74C3C", "#2980B9", "#F39C12", "#16A085", "#D35400",
];

interface CourseFormProps {
  course?: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          {isEditing ? "Guardando..." : "Creando..."}
        </>
      ) : isEditing ? (
        "Guardar cambios"
      ) : (
        "Crear curso"
      )}
    </Button>
  );
}

import { useAnalytics } from "@/hooks/use-analytics";

export function CourseForm({ course, open, onOpenChange }: CourseFormProps) {
  const isEditing = !!course;
  const { track } = useAnalytics();

  const boundAction = isEditing
    ? updateCourse.bind(null, course.id)
    : createCourse;

  const [state, formAction] = useActionState(boundAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      if (!isEditing && state.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        track("course_created", { course_id: (state.data as any).id, course_name: (state.data as any).name });
      }
      onOpenChange(false);
    } else {
      toast.error(state.message);
    }
  }, [state, onOpenChange, isEditing, track]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-md overflow-y-auto"
        aria-describedby="course-form-description"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">
            {isEditing ? "Editar Curso" : "Nuevo Curso"}
          </SheetTitle>
          <div
            id="course-form-description"
            className="text-sm text-muted-foreground"
          >
            {isEditing
              ? "Modifica los detalles del curso."
              : "Añade un nuevo curso a tu maestría."}
          </div>
        </SheetHeader>

        <form action={formAction} className="space-y-5 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="course-name">Nombre del curso *</Label>
            <Input
              id="course-name"
              name="name"
              defaultValue={course?.name}
              placeholder="Ej. Inteligencia Artificial"
              required
            />
            {state?.errors?.name && (
              <p className="text-sm text-destructive" role="alert">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          {/* Code + Semester */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course-code">Código</Label>
              <Input
                id="course-code"
                name="code"
                defaultValue={course?.code ?? ""}
                placeholder="Ej. CC-701"
                maxLength={20}
              />
              {state?.errors?.code && (
                <p className="text-sm text-destructive" role="alert">
                  {state.errors.code[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-semester">Semestre</Label>
              <Input
                id="course-semester"
                name="semester"
                defaultValue={course?.semester ?? ""}
                placeholder="Ej. 2026-I"
                maxLength={20}
              />
            </div>
          </div>

          {/* Color */}
          <div className="space-y-3">
            <Label>Color del curso</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <label
                  key={color}
                  className="relative cursor-pointer"
                  title={color}
                >
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    defaultChecked={
                      course?.color === color ||
                      (!course && color === "#1F4E79")
                    }
                    className="sr-only peer"
                  />
                  <div
                    className="h-8 w-8 rounded-full border-2 border-transparent peer-checked:border-foreground peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-foreground transition-all"
                    style={{ backgroundColor: color }}
                  />
                </label>
              ))}
              {/* Custom color picker */}
              <div className="space-y-1">
                <input
                  type="color"
                  name="color"
                  defaultValue={course?.color ?? "#1F4E79"}
                  className="h-8 w-8 rounded-full cursor-pointer border border-input overflow-hidden"
                  title="Color personalizado"
                />
              </div>
            </div>
            {state?.errors?.color && (
              <p className="text-sm text-destructive" role="alert">
                {state.errors.color[0]}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="course-description">Descripción</Label>
            <textarea
              id="course-description"
              name="description"
              defaultValue={course?.description ?? ""}
              placeholder="Breve descripción del curso..."
              maxLength={500}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
            />
          </div>

          <SheetFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <SubmitButton isEditing={isEditing} />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
