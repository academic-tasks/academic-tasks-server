import { z } from "zod";
import { FindCargoByIdInputZod } from "../cargo";
import { FindUsuarioByIdInputZod } from "./FindUsuarioByIdInputZod";

export const SetUsuarioCargosInputZod = z.object({
  id: FindUsuarioByIdInputZod.shape.id,

  //

  cargos: z.array(FindCargoByIdInputZod.shape.id),
});

export type ISetUsuarioRolesInput = z.infer<typeof SetUsuarioCargosInputZod>;
