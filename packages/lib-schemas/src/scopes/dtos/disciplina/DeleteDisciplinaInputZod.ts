import { z } from "zod";
import { FindDisciplinaByIdInputZod } from "./FindDisciplinaByIdInputZod";

export const DeleteDisciplinaInputZod = z.object({
  id: FindDisciplinaByIdInputZod.shape.id,
});

export type IDeleteDisciplinaInput = z.infer<typeof DeleteDisciplinaInputZod>;
