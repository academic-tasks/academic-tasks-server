import { z } from "zod";
import { FindDisciplinaByIdInputZod } from "../disciplina";

export const CreateTarefaInputZod = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(0).max(2000).default(""),

  dateOpen: z.date().nullable().default(null),
  dateClose: z.date().nullable().default(null),

  submissionFormat: z.string().min(1).max(255).default("Não informado."),

  //

  disciplinaId: FindDisciplinaByIdInputZod.shape.id,
});

export type ICreateTarefaInput = z.infer<typeof CreateTarefaInputZod>;
