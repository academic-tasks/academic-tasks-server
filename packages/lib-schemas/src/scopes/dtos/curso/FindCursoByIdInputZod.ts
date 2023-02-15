import { z } from "zod";
import { UUIDZod } from "../../../utils";

export const FindCursoByIdInputZod = z.object({
  id: UUIDZod,
});

export type IFindCursoByIdInput = z.infer<typeof FindCursoByIdInputZod>;
