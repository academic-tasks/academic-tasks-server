import { z } from "zod";
import { FindCursoByIdInputZod } from "../curso";

export const CreateTurmaInputZod = z.object({
  year: z
    .number()
    .min(1)
    .max(9999)
    .default(() => new Date().getFullYear()),

  serie: z.string().min(1).max(255),
  turno: z.string().min(1).max(255),

  //

  cursoId: FindCursoByIdInputZod.shape.id,
});

export type ICreateTurmaInput = z.infer<typeof CreateTurmaInputZod>;
