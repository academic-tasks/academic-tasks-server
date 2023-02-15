import { z } from "zod";

export const CreateCursoInputZod = z.object({
  name: z.string().min(1).max(255),
});

export type ICreateCursoInput = z.infer<typeof CreateCursoInputZod>;
