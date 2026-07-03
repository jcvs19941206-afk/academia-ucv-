import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .max(200, "Máximo 200 caracteres"),
  description: z.string().max(2000, "Máximo 2000 caracteres").optional().nullable(),
  course_id: z.string().uuid("Selecciona un curso válido").optional().nullable(),
  priority: z.enum(["urgente", "alta", "media", "baja"], {
    errorMap: () => ({ message: "Selecciona una prioridad válida" }),
  }),
  status: z.enum(["pendiente", "en_progreso", "completada", "cancelada"]).optional(),
  due_date: z.string().optional().nullable(),
});
