import { z } from "zod";
import { UUIDZod } from "../../../utils";

export const FindTurmaByIdInputZod = z.object({
  id: UUIDZod,
});

export type IFindTurmaByIdInput = z.infer<typeof FindTurmaByIdInputZod>;
