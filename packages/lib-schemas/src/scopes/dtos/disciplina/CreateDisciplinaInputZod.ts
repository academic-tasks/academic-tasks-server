import { z } from "zod";
import { FindTurmaByIdInputZod } from "../turma";

export const CreateDisciplinaInputZod = z.object({
  name: z.string().min(1).max(255),

  codSuap: z.string().min(1).max(255).optional().nullable(),

  //

  turmaId: FindTurmaByIdInputZod.shape.id,
});

export type ICreateDisciplinaInput = z.infer<typeof CreateDisciplinaInputZod>;
