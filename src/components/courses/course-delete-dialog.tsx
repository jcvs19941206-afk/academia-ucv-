"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCourse } from "@/app/actions/courses";
import type { Course } from "@/types";

interface CourseDeleteDialogProps {
  course?: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDeleteDialog({
  course,
  open,
  onOpenChange,
}: CourseDeleteDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!course) return;

    startTransition(async () => {
      const result = await deleteCourse(course.id);
      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar este curso?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará permanentemente{" "}
            <span className="font-semibold text-foreground">
              &ldquo;{course?.name}&rdquo;
            </span>
            . Las tareas asociadas perderán su asignación de curso pero no
            serán eliminadas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Eliminando...
              </>
            ) : (
              "Eliminar curso"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
