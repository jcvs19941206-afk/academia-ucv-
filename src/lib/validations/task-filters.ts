import { z } from "zod";

// Task filter schema — lives outside "use server" so it can be exported as a plain object
export const taskFiltersSchema = z.object({
  course_id: z.string().uuid().optional().nullable(),
  priority: z.enum(["urgent", "high", "medium", "low"]).optional().nullable(),
  status: z
    .enum(["pending", "in_progress", "completed", "cancelled"])
    .optional()
    .nullable(),
  search: z.string().max(100).optional().nullable(),
});

export type TaskFilters = z.infer<typeof taskFiltersSchema>;
