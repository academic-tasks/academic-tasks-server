import { z } from "zod";
import { UUIDZod } from "../../../utils";

export const DeletePermissaoInputZod = z.object({
  id: UUIDZod,
});

export type IDeletePermissaoInput = z.infer<typeof DeletePermissaoInputZod>;
