import { z } from "zod";
import { CreateDisciplinaInputZod } from "./CreateDisciplinaInputZod";
import { FindDisciplinaByIdInputZod } from "./FindDisciplinaByIdInputZod";

export const UpdateDisciplinaInputZod = z.intersection(
  FindDisciplinaByIdInputZod.pick({ id: true }),

  CreateDisciplinaInputZod.pick({
    name: true,
    codSuap: true,
  }).partial()
);

export type IUpdateDisciplinaInput = z.infer<typeof UpdateDisciplinaInputZod>;
