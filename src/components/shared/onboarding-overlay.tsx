"use client";

import { useState, useTransition } from "react";
import { GraduationCap, CheckCircle2, Folder, BookOpen, Sparkles } from "lucide-react";
import { useFirstVisit } from "@/hooks/use-first-visit";
import { OnboardingStep } from "./onboarding-step";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCourse } from "@/app/actions/courses";
import { createTask } from "@/app/actions/tasks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useAnalytics } from "@/hooks/use-analytics";

interface OnboardingOverlayProps {
  coursesCount: number;
}

export function OnboardingOverlay({ coursesCount }: OnboardingOverlayProps) {
  const { isFirstVisit, isLoading, completeOnboarding } = useFirstVisit();
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { track } = useAnalytics();

  // State for step 2 (Course)
  const [courseName, setCourseName] = useState("");
  const [courseColor, setCourseColor] = useState("#1F4E79");
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);

  // State for step 3 (Task)
  const [taskTitle, setTaskTitle] = useState("");

  // Only show if there are 0 courses AND it is the first visit (from local storage)
  if (isLoading || !isFirstVisit || coursesCount > 0) return null;

  const handleCreateCourseAndNext = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", courseName);
      formData.append("color", courseColor);

      const result = await createCourse(null, formData);
      if (result.success && result.data) {
        const cId = (result.data as any).id;
        setCreatedCourseId(cId);
        toast.success(result.message);
        track("course_created", { course_id: cId, course_name: courseName });
        setStep(3);
      } else {
        toast.error(result.message || "Error al crear curso");
      }
    });
  };

  const handleCreateTaskAndFinish = async () => {
    if (!createdCourseId) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", taskTitle);
      formData.append("course_id", createdCourseId);
      formData.append("priority", "medium");
      formData.append("status", "pending");

      const result = await createTask(null, formData);
      if (result.success) {
        toast.success("¡Todo listo para comenzar!");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        track("task_created", { task_id: (result.data as any).id, priority: "medium", has_due_date: false });
        track("onboarding_completed");
        completeOnboarding(); // Oculta el overlay
        router.refresh();
      } else {
        toast.error(result.message || "Error al crear tarea");
      }
    });
  };

  const skipOnboarding = () => {
    completeOnboarding();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      {step === 1 && (
        <OnboardingStep
          step={1}
          totalSteps={3}
          title="¡Bienvenido a AcademIA!"
          description="Organiza tu maestría en 3 rápidos pasos."
          onNext={() => setStep(2)}
          nextLabel="Comenzar →"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Folder className="h-5 w-5" />
              </div>
              <span>Crea tu primer curso</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span>Crea tu primera tarea</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span>Revisa tu progreso</span>
            </div>
            <div className="pt-4 text-center">
              <button onClick={skipOnboarding} className="text-sm text-muted-foreground hover:underline">
                Saltar tutorial
              </button>
            </div>
          </div>
        </OnboardingStep>
      )}

      {step === 2 && (
        <OnboardingStep
          step={2}
          totalSteps={3}
          title="Tu Primer Curso"
          description="Añade la primera materia que estás cursando."
          onNext={handleCreateCourseAndNext}
          onPrev={() => setStep(1)}
          isNextDisabled={!courseName.trim() || isPending}
          nextLabel={isPending ? "Creando..." : "Siguiente"}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courseName">Nombre del curso</Label>
              <Input
                id="courseName"
                placeholder="Ej. Metodología de la Investigación"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                disabled={isPending}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseColor">Color distintivo</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="courseColor"
                  type="color"
                  value={courseColor}
                  onChange={(e) => setCourseColor(e.target.value)}
                  className="w-14 h-10 p-1 cursor-pointer"
                  disabled={isPending}
                />
                <span className="text-sm text-muted-foreground font-mono">{courseColor.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </OnboardingStep>
      )}

      {step === 3 && (
        <OnboardingStep
          step={3}
          totalSteps={3}
          title="Tu Primera Tarea"
          description={`¿Qué pendiente tienes para el curso recién creado?`}
          onNext={handleCreateTaskAndFinish}
          onPrev={() => setStep(2)}
          isNextDisabled={!taskTitle.trim() || isPending}
          nextLabel={isPending ? "Finalizando..." : "Terminar y ver Dashboard"}
        >
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg flex items-center gap-3 border mb-4">
               <BookOpen className="h-5 w-5 text-muted-foreground" style={{ color: courseColor }} />
               <span className="font-medium text-sm">{courseName}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Título de la tarea</Label>
              <Input
                id="taskTitle"
                placeholder="Ej. Leer capítulo 3"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                disabled={isPending}
                autoFocus
              />
            </div>
          </div>
        </OnboardingStep>
      )}
    </div>
  );
}
