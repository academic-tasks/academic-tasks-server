import { z } from "zod";
import { FindUsuarioByIdInputZod } from "./FindUsuarioByIdInputZod";

export const DeleteUsuarioInputZod = z.object({
  id: FindUsuarioByIdInputZod.shape.id,
});

export type IDeleteUsuarioInput = z.infer<typeof DeleteUsuarioInputZod>;
