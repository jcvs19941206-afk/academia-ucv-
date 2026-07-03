"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { createTask, updateTask } from "@/app/actions/tasks";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

import type { Task, Course } from "@/types";
import { useAnalytics } from "@/hooks/use-analytics";

interface TaskDetailModalProps {
  task?: Task;
  courses: Course[];
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
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
        "Crear tarea"
      )}
    </Button>
  );
}

export function TaskDetailModal({
  task,
  courses,
  children,
  open,
  onOpenChange,
}: TaskDetailModalProps) {
  const isEditing = !!task;

  const boundAction = isEditing
    ? updateTask.bind(null, task.id)
    : createTask;

  const [state, formAction] = useActionState(boundAction, null);

  const { track } = useAnalytics();

  // React to action result
  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      if (!isEditing && state.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = state.data as any;
        track("task_created", { 
          task_id: responseData.id, 
          priority: responseData.priority, 
          has_due_date: !!responseData.due_date 
        });
      }
      onOpenChange?.(false);
    } else {
      toast.error(state.message);
    }
  }, [state, onOpenChange, isEditing, track]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children && (
        <div onClick={() => onOpenChange?.(true)} className="contents">
          {children}
        </div>
      )}

      <SheetContent
        className="w-full sm:max-w-md md:max-w-lg overflow-y-auto"
        aria-describedby="task-modal-description"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">
            {isEditing ? "Editar Tarea" : "Nueva Tarea"}
          </SheetTitle>
          <div id="task-modal-description" className="text-sm text-muted-foreground">
            {isEditing
              ? "Modifica los detalles de tu entrega."
              : "Añade una nueva entrega para organizarte."}
          </div>
        </SheetHeader>

        <form action={formAction} className="space-y-5 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título de la tarea</Label>
            <Input
              id="title"
              name="title"
              defaultValue={task?.title}
              placeholder="Ej. Ensayo final"
              required
            />
            {state?.errors?.title && (
              <p className="text-sm text-destructive" role="alert">
                {state.errors.title[0]}
              </p>
            )}
          </div>

          {/* Course + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course_id">Curso</Label>
              <select
                id="course_id"
                name="course_id"
                defaultValue={task?.course_id || ""}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Sin curso</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <select
                id="priority"
                name="priority"
                defaultValue={task?.priority || "medium"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="low">🟢 Baja</option>
                <option value="medium">🟡 Media</option>
                <option value="high">🟠 Alta</option>
                <option value="urgent">🔴 Urgente</option>
              </select>
              {state?.errors?.priority && (
                <p className="text-sm text-destructive" role="alert">
                  {state.errors.priority[0]}
                </p>
              )}
            </div>
          </div>

          {/* Status + Due date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                name="status"
                defaultValue={task?.status || "pending"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En progreso</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Fecha límite</Label>
              <Input
                id="due_date"
                name="due_date"
                type="date"
                defaultValue={task?.due_date?.split("T")[0] || ""}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Detalles, instrucciones o apuntes sobre la tarea..."
              defaultValue={task?.description || ""}
              className="min-h-[120px] resize-y"
            />
          </div>

          <SheetFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange?.(false)}
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
