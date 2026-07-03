import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, ClipboardList } from "lucide-react";
import Link from "next/link";
import type { Task } from "@/types";

interface UpcomingTasksProps {
  tasks: (Task & { courses?: { name: string; color: string } | null })[];
}

const priorityConfig = {
  urgent: { label: "Urgente", variant: "destructive" as const },
  high: { label: "Alta", variant: "default" as const },
  medium: { label: "Media", variant: "secondary" as const },
  low: { label: "Baja", variant: "outline" as const },
};


export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Próximas tareas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              No hay tareas próximas
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Todas tus tareas están al día
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  function isOverdue(dueDate: string | undefined): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }

  function isNear(dueDate: string | undefined): boolean {
    if (!dueDate) return false;
    // eslint-disable-next-line react-hooks/purity
    const diff = new Date(dueDate).getTime() - Date.now();
    return diff > 0 && diff < 48 * 60 * 60 * 1000; // < 48 horas
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Próximas tareas
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tasks">
            Ver todas
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => {
            const config = priorityConfig[task.priority as keyof typeof priorityConfig] ?? priorityConfig.medium;
            const overdue = isOverdue(task.due_date);
            const near = isNear(task.due_date);

            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {task.title}
                    </span>
                    <Badge variant={config.variant} className="text-[10px] px-1.5 py-0">
                      {config.label}
                    </Badge>
                  </div>
                  {task.courses && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: task.courses.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {task.courses.name}
                      </span>
                    </div>
                  )}
                </div>
                {task.due_date && (
                  <div className="flex items-center gap-1 ml-3">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span
                      className={`text-xs whitespace-nowrap ${
                        overdue
                          ? "text-destructive font-medium"
                          : near
                            ? "text-warning font-medium"
                            : "text-muted-foreground"
                      }`}
                    >
                      {new Date(task.due_date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function UpcomingTasksSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
