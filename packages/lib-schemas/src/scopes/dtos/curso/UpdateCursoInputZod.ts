import { z } from "zod";
import { CreateCursoInputZod } from "./CreateCursoInputZod";
import { FindCursoByIdInputZod } from "./FindCursoByIdInputZod";

export const UpdateCursoInputZod = z.intersection(
  FindCursoByIdInputZod.pick({ id: true }),

  CreateCursoInputZod.pick({
    name: true,
  }).partial()
);

export type IUpdateCursoInput = z.infer<typeof UpdateCursoInputZod>;
