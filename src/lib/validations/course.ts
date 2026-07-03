import { z } from "zod";

export const courseSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "Máximo 100 caracteres"),
  code: z.string().max(20, "Máximo 20 caracteres").optional().nullable(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color hex inválido")
    .default("#1F4E79"),
  description: z.string().max(500, "Máximo 500 caracteres").optional().nullable(),
  semester: z.string().max(20, "Máximo 20 caracteres").optional().nullable(),
});
