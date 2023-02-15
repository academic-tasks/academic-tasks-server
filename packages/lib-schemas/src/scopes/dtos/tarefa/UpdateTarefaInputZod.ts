import { z } from "zod";
import { CreateTarefaInputZod } from "./CreateTarefaInputZod";
import { FindTarefaByIdInputZod } from "./FindTarefaByIdInputZod";

export const UpdateTarefaInputZod = z.intersection(
  FindTarefaByIdInputZod.pick({ id: true }),

  CreateTarefaInputZod.pick({
    title: true,
    description: true,

    dateOpen: true,
    dateClose: true,

    submissionFormat: true,
  }).partial()
);

export type IUpdateTarefaInput = z.infer<typeof UpdateTarefaInputZod>;
