"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Course } from "@/types";

interface TasksFiltersProps {
  courses: Course[];
}

export function TasksFilters({ courses }: TasksFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCourse = searchParams.get("course_id") ?? "";
  const currentPriority = searchParams.get("priority") ?? "";
  const currentStatus = searchParams.get("status") ?? "";
  const currentSearch = searchParams.get("search") ?? "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to first page when filters change
      params.delete("page");
      router.push(`/tasks?${params.toString()}`);
    },
    [router, searchParams]
  );

  function clearFilters() {
    router.push("/tasks");
  }

  const hasActiveFilters =
    currentCourse || currentPriority || currentStatus || currentSearch;

  return (
    <div className="flex flex-col lg:flex-row gap-4 bg-card p-4 rounded-xl border">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar tareas..."
          className="w-full pl-10 bg-muted/50 border-input"
          defaultValue={currentSearch}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Course filter */}
        <Select
          value={currentCourse || "all"}
          onValueChange={(v) => updateFilter("course_id", v)}
        >
          <SelectTrigger className="w-full sm:w-[200px] bg-background">
            <SelectValue placeholder="Todos los cursos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los cursos</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority filter */}
        <Select
          value={currentPriority || "all"}
          onValueChange={(v) => updateFilter("priority", v)}
        >
          <SelectTrigger className="w-full sm:w-[180px] bg-background">
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las prioridades</SelectItem>
            <SelectItem value="urgente">🔴 Urgente</SelectItem>
            <SelectItem value="alta">🟠 Alta</SelectItem>
            <SelectItem value="media">🟡 Media</SelectItem>
            <SelectItem value="baja">🟢 Baja</SelectItem>
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={currentStatus || "all"}
          onValueChange={(v) => updateFilter("status", v)}
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-background">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="en_progreso">En progreso</SelectItem>
            <SelectItem value="completada">Completada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}
