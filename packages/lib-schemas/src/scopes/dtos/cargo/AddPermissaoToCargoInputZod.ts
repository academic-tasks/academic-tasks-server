import { z } from "zod";
import { FindPermissaoByIdInputZod } from "../permissao";
import { FindCargoByIdInputZod } from "./FindCargoByIdInputZod";

export const AddPermissaoToCargoInputZod = z.object({
  cargoId: FindCargoByIdInputZod.shape.id,
  permissaoId: FindPermissaoByIdInputZod.shape.id,
});

export type IAddPermissaoToCargoInput = z.infer<
  typeof AddPermissaoToCargoInputZod
>;
