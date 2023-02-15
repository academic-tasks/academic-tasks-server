import { z } from "zod";
import { FindTurmaByIdInputZod } from "./FindTurmaByIdInputZod";

export const DeleteTurmaInputZod = z.object({
  id: FindTurmaByIdInputZod.shape.id,
});

export type IDeleteTurmaInput = z.infer<typeof DeleteTurmaInputZod>;
