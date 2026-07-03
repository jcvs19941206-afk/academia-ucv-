import { z } from "zod";

// Task filter schema — lives outside "use server" so it can be exported as a plain object
export const taskFiltersSchema = z.object({
  course_id: z.string().uuid().optional().nullable(),
  priority: z.enum(["urgente", "alta", "media", "baja"]).optional().nullable(),
  status: z
    .enum(["pendiente", "en_progreso", "completada", "cancelada"])
    .optional()
    .nullable(),
  search: z.string().max(100).optional().nullable(),
});

export type TaskFilters = z.infer<typeof taskFiltersSchema>;
