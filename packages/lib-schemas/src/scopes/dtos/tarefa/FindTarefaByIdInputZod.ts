import { z } from "zod";
import { UUIDZod } from "../../../utils";

export const FindTarefaByIdInputZod = z.object({
  id: UUIDZod,
});

export type IFindTarefaByIdInput = z.infer<typeof FindTarefaByIdInputZod>;
