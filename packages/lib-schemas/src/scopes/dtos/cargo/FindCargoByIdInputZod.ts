import { z } from "zod";
import { UUIDZod } from "../../../utils";

export const FindCargoByIdInputZod = z.object({
  id: UUIDZod,
});

export type IFindCargoByIdInput = z.infer<typeof FindCargoByIdInputZod>;
