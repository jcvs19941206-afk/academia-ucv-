"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseForm } from "./course-form";

export function CreateCourseButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nuevo curso
      </Button>
      <CourseForm open={open} onOpenChange={setOpen} />
    </>
  );
}
