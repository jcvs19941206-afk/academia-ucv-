"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import type { Course } from "@/types";

interface NewTaskButtonClientProps {
  courses: Course[];
}

export function NewTaskButtonClient({ courses }: NewTaskButtonClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="w-full sm:w-auto flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Nueva tarea
      </Button>
      <TaskDetailModal courses={courses} open={open} onOpenChange={setOpen} />
    </>
  );
}
