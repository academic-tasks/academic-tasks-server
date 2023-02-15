import { z } from "zod";
import { FindCursoByIdInputZod } from "./FindCursoByIdInputZod";

export const DeleteCursoInputZod = z.object({
  id: FindCursoByIdInputZod.shape.id,
});

export type IDeleteCursoInput = z.infer<typeof DeleteCursoInputZod>;
