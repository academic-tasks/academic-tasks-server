import { z } from "zod";
import { CreateTurmaInputZod } from "./CreateTurmaInputZod";
import { FindTurmaByIdInputZod } from "./FindTurmaByIdInputZod";

export const UpdateTurmaInputZod = z.intersection(
  FindTurmaByIdInputZod.pick({ id: true }),

  CreateTurmaInputZod.pick({
    year: true,
    serie: true,
    turno: true,
  }).partial()
);

export type IUpdateTurmaInput = z.infer<typeof UpdateTurmaInputZod>;
