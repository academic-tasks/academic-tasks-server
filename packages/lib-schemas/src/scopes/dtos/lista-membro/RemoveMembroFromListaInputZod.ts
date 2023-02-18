import { z } from "zod";
import { FindListaByIdInputZod } from "../lista/FindListaByIdInputZod";
import { FindUsuarioByIdInputZod } from "../usuario";

export const RemoveMembroFromListaInputZod = z.object({
  listaId: FindListaByIdInputZod.shape.id,
  usuarioId: FindUsuarioByIdInputZod.shape.id,
});

export type IRemoveMembroFromListaInput = z.infer<
  typeof RemoveMembroFromListaInputZod
>;
