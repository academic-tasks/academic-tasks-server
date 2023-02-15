import { z } from "zod";
import { FindTarefaByIdInputZod } from "./FindTarefaByIdInputZod";

export const DeleteTarefaInputZod = z.object({
  id: FindTarefaByIdInputZod.shape.id,
});

export type IDeleteTarefaInput = z.infer<typeof DeleteTarefaInputZod>;
