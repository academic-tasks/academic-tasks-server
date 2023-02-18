import { z } from "zod";
import { FindDisciplinaByIdInputZod } from "../disciplina";
import { FindListaByIdInputZod } from "../lista";

export const CreateTarefaInputZod = z.object({
  listaId: FindListaByIdInputZod.shape.id,
  disciplinaId: FindDisciplinaByIdInputZod.shape.id,

  //

  title: z.string().min(1).max(255),
  description: z.string().min(0).max(2000).default(""),

  dateOpen: z.date().nullable().default(null),
  dateClose: z.date().nullable().default(null),

  submissionFormat: z.string().min(1).max(255).default("Não informado."),
});

export type ICreateTarefaInput = z.infer<typeof CreateTarefaInputZod>;
