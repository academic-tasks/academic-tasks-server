import { z } from "zod";
import { CreateProfessorInputZod } from "./CreateProfessorInputZod";
import { FindProfessorByIdInputZod } from "./FindProfessorByIdInputZod";

export const UpdateProfessorInputZod = z.intersection(
  FindProfessorByIdInputZod.pick({ id: true }),

  CreateProfessorInputZod.pick({
    name: true,
    codSiape: true,
  }).partial()
);

export type IUpdateProfessorInput = z.infer<typeof UpdateProfessorInputZod>;
