import { z } from "zod";
import { UUIDZod } from "../../../utils";

export const FindPermissaoByIdInputZod = z.object({
  id: UUIDZod,
});

export type IFindPermissaoByIdInput = z.infer<typeof FindPermissaoByIdInputZod>;
