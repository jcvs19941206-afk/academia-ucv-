"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { format, isBefore, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useAnalytics } from "@/hooks/use-analytics";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { toggleTaskStatus, deleteTask } from "@/app/actions/tasks";
import { TaskDetailModal } from "./task-detail-modal";
import { TaskDeleteDialog } from "./task-delete-dialog";
import type { Task, Course } from "@/types";

type TaskWithCourse = Task & {
  courses?: { name: string; color: string } | null;
};

interface TasksTableProps {
  tasks: TaskWithCourse[];
  courses: Course[];
}

export function TasksTable({ tasks, courses }: TasksTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Optimistic local state
  const [optimisticTasks, setOptimisticTasks] = useState<TaskWithCourse[]>(tasks);
  // Sync when server-refreshed tasks arrive (only when not mid-transition)
  if (tasks !== optimisticTasks && !isPending) {
    setOptimisticTasks(tasks);
  }

  // Modal state
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteTaskTarget, setDeleteTaskTarget] = useState<Task | undefined>(undefined);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setIsEditOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setDeleteTaskTarget(task);
    setIsDeleteOpen(true);
  };

  const { track } = useAnalytics();

  // ── Optimistic status toggle ─────────────────────────────────────────────
  function handleToggleComplete(task: TaskWithCourse, checked: boolean) {
    const newStatus = checked ? "completed" : "pending";

    // Instant optimistic update
    setOptimisticTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: newStatus,
              completed_at: checked ? new Date().toISOString() : undefined,
            }
          : t
      )
    );

    startTransition(async () => {
      const result = await toggleTaskStatus(task.id, newStatus);
      if (!result.success) {
        // Revert optimistic update
        setOptimisticTasks(tasks);
        toast.error(result.message);
      } else {
        if (newStatus === "completed") {
          let days_before_due = null;
          if (task.due_date) {
            const diffTime = new Date(task.due_date).getTime() - new Date().getTime();
            days_before_due = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
          track("task_completed", { task_id: task.id, days_before_due });
        }
        router.refresh();
      }
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getCourseName = (task: TaskWithCourse) =>
    task.courses?.name ?? (task.course_id ? "Curso desconocido" : "Sin curso");

  const getCourseColor = (task: TaskWithCourse) =>
    task.courses?.color ?? "#6b7280";

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgente":
        return (
          <Badge variant="destructive" className="uppercase text-[10px]">
            Urgente
          </Badge>
        );
      case "alta":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 uppercase text-[10px]">
            Alta
          </Badge>
        );
      case "media":
        return (
          <Badge variant="secondary" className="uppercase text-[10px]">
            Media
          </Badge>
        );
      case "baja":
        return (
          <Badge
            variant="outline"
            className="uppercase text-[10px] text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30 dark:text-green-400"
          >
            Baja
          </Badge>
        );
    }
  };

  const getStatusDisplay = (status: Task["status"]) => {
    switch (status) {
      case "completada":
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-success/10 text-success text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completada</span>
          </div>
        );
      case "en_progreso":
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>En progreso</span>
          </div>
        );
      case "cancelada":
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
            <span>Cancelada</span>
          </div>
        );
      case "pendiente":
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            <span>Pendiente</span>
          </div>
        );
    }
  };

  const getDueDateDisplay = (task: TaskWithCourse) => {
    if (!task.due_date)
      return <span className="text-muted-foreground">Sin fecha</span>;

    const date = new Date(task.due_date);
    const now = new Date();
    const isOverdue = isBefore(date, now) && task.status !== "completed";
    const isSoon =
      !isOverdue &&
      isBefore(date, addDays(now, 3)) &&
      task.status !== "completed";
    const formatted = format(date, "dd MMM, yyyy", { locale: es });

    if (isOverdue) {
      return (
        <div className="flex flex-col">
          <span className="font-mono text-destructive font-bold text-xs">
            {formatted}
          </span>
          <span className="text-[10px] text-destructive flex items-center gap-1 font-semibold uppercase mt-0.5">
            <AlertTriangle className="h-3 w-3" /> Vencida
          </span>
        </div>
      );
    }

    if (isSoon) {
      return (
        <div className="flex flex-col">
          <span className="font-mono text-warning font-bold text-xs">
            {formatted}
          </span>
          <span className="text-[10px] text-warning flex items-center gap-1 font-semibold uppercase mt-0.5">
            <Clock className="h-3 w-3" /> Pronto
          </span>
        </div>
      );
    }

    return <span className="font-mono text-xs text-muted-foreground">{formatted}</span>;
  };

  if (optimisticTasks.length === 0) {
    return (
      <div className="border rounded-xl bg-card p-12 text-center space-y-3">
        <p className="text-muted-foreground">No hay tareas que mostrar.</p>
        <p className="text-sm text-muted-foreground">
          Crea una nueva tarea para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isPending && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Actualizando...
        </div>
      )}

      <div className="border rounded-xl bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-[350px]">Tarea</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Fecha Límite</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optimisticTasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  {/* Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={task.status === "completed"}
                      onCheckedChange={(checked) =>
                        handleToggleComplete(task, !!checked)
                      }
                      aria-label={`Marcar "${task.title}" como ${
                        task.status === "completed" ? "pendiente" : "completada"
                      }`}
                    />
                  </TableCell>

                  {/* Title */}
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => handleEditTask(task)}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`font-semibold text-sm ${
                          task.status === "completed"
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {task.description}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Course */}
                  <TableCell>
                    {task.course_id ? (
                      <Badge
                        variant="outline"
                        className="uppercase text-[9px] font-bold tracking-wider"
                        style={{
                          backgroundColor: `${getCourseColor(task)}15`,
                          color: getCourseColor(task),
                          borderColor: `${getCourseColor(task)}30`,
                        }}
                      >
                        {getCourseName(task)}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>{getDueDateDisplay(task)}</TableCell>
                  <TableCell>{getStatusDisplay(task.status)}</TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditTask(task)}>
                          Editar tarea
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteTask(task)}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>{optimisticTasks.length}</strong> tareas
          </div>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" className="h-8 px-2" aria-disabled />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive className="h-8 w-8">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="h-8 px-2" aria-disabled />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Edit Modal */}
      <TaskDetailModal
        task={editTask}
        courses={courses}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Delete Dialog */}
      <TaskDeleteDialog
        task={deleteTaskTarget}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
}
