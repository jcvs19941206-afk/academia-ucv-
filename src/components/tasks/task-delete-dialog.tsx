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
import { deleteTask } from "@/app/actions/tasks";
import type { Task } from "@/types";
import { useAnalytics } from "@/hooks/use-analytics";

interface TaskDeleteDialogProps {
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDeleteDialog({
  task,
  open,
  onOpenChange,
}: TaskDeleteDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { track } = useAnalytics();

  function handleDelete() {
    if (!task) return;

    startTransition(async () => {
      const result = await deleteTask(task.id);
      if (result.success) {
        toast.success(result.message);
        track("task_deleted", { task_id: task.id });
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
          <AlertDialogTitle>¿Eliminar esta tarea?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará permanentemente{" "}
            <span className="font-semibold text-foreground">
              &ldquo;{task?.title}&rdquo;
            </span>
            . Esta acción no se puede deshacer.
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
              "Eliminar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
