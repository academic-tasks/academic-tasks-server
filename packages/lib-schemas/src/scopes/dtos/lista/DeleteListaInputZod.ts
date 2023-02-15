import { z } from "zod";
import { FindListaByIdInputZod } from "./FindListaByIdInputZod";

export const DeleteListaInputZod = z.object({
  id: FindListaByIdInputZod.shape.id,
});

export type IDeleteListaInput = z.infer<typeof DeleteListaInputZod>;
