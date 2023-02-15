import { z } from "zod";
import { UUIDZod } from "../../../utils";

export const FindListaByIdInputZod = z.object({
  id: UUIDZod,
});

export type IFindListaByIdInput = z.infer<typeof FindListaByIdInputZod>;
