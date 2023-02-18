import { z } from "zod";
import { UUIDZod } from "../../../utils/Id.zod";

export const FindListaMembroByIdInputZod = z.object({
  id: UUIDZod,
});

export type IFindListaMembroByIdInput = z.infer<
  typeof FindListaMembroByIdInputZod
>;
