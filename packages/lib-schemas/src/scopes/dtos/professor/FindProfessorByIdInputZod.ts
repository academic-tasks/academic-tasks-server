import { z } from "zod";
import { UUIDZod } from "../../../utils";

export const FindProfessorByIdInputZod = z.object({
  id: UUIDZod,
});

export type IFindProfessorByIdInput = z.infer<typeof FindProfessorByIdInputZod>;
