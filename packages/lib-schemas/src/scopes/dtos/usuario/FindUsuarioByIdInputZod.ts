import { z } from "zod";
import { UUIDZod } from "../../../utils";

export const FindUsuarioByIdInputZod = z.object({
  id: UUIDZod,
});

export type IFindUsuarioByIdInput = z.infer<typeof FindUsuarioByIdInputZod>;
