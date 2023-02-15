import { z } from "zod";

export const CreateProfessorInputZod = z.object({
  name: z.string().min(1).max(255),

  codSiape: z.string().min(1).max(255).nullable(),
});

export type ICreateProfessorInput = z.infer<typeof CreateProfessorInputZod>;
