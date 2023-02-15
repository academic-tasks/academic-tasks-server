import { z } from "zod";
import { FindPermissaoByIdInputZod } from "../permissao";
import { FindCargoByIdInputZod } from "./FindCargoByIdInputZod";

export const RemovePermissaoFromCargoInputZod = z.object({
  cargoId: FindCargoByIdInputZod.shape.id,
  permissaoId: FindPermissaoByIdInputZod.shape.id,
});

export type IRemovePermissaoFromCargoInput = z.infer<
  typeof RemovePermissaoFromCargoInputZod
>;
