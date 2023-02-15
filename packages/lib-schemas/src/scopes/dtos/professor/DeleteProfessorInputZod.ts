import { z } from "zod";
import { FindProfessorByIdInputZod } from "./FindProfessorByIdInputZod";

export const DeleteProfessorInputZod = z.object({
  id: FindProfessorByIdInputZod.shape.id,
});

export type IDeleteProfessorInput = z.infer<typeof DeleteProfessorInputZod>;
