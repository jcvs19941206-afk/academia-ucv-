import { describe, it, expect } from "vitest";
import { taskSchema } from "@/lib/validations/task";
import { courseSchema } from "@/lib/validations/course";

describe("Validaciones - Task Schema", () => {
  it("rejects empty title", () => {
    const result = taskSchema.safeParse({
      title: "",
      priority: "high",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("El título es obligatorio");
    }
  });

  it("accepts valid task", () => {
    const result = taskSchema.safeParse({
      title: "Tarea válida",
      description: "Descripción de prueba",
      course_id: "71cbcd28-4dc1-4cf1-ae5d-2200dc3a105f",
      due_date: "2024-12-31",
      priority: "high",
      status: "pending",
    });
    expect(result.success).toBe(true);
  });
});

describe("Validaciones - Course Schema", () => {
  it("rejects short name", () => {
    const result = courseSchema.safeParse({
      name: "A",
      color: "#000000",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("El nombre debe tener al menos 2 caracteres");
    }
  });

  it("accepts valid course", () => {
    const result = courseSchema.safeParse({
      name: "Curso válido",
      color: "#FF0000",
      description: "Descripción del curso",
    });
    expect(result.success).toBe(true);
  });
});
