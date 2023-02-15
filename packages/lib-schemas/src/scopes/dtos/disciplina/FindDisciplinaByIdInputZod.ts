import { z } from "zod";
import { UUIDZod } from "../../../utils";

export const FindDisciplinaByIdInputZod = z.object({
  id: UUIDZod,
});

export type IFindDisciplinaByIdInput = z.infer<
  typeof FindDisciplinaByIdInputZod
>;
