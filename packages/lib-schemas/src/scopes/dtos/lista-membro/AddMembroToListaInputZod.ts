import { z } from "zod";
import { FindListaByIdInputZod } from "../lista/FindListaByIdInputZod";
import { FindUsuarioByIdInputZod } from "../usuario";

export const AddMembroToListaInputZod = z.object({
  listaId: FindListaByIdInputZod.shape.id,
  usuarioId: FindUsuarioByIdInputZod.shape.id,
});

export type IAddMembroToListaInput = z.infer<typeof AddMembroToListaInputZod>;
