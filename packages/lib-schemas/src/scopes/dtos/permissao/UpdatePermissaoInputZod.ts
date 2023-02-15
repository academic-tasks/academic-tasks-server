import { z } from "zod";
import { CreatePermissaoInputZod } from "./CreatePermissaoInputZod";
import { FindPermissaoByIdInputZod } from "./FindPermissaoByIdInputZod";

export const UpdatePermissaoInputZod = z.intersection(
  FindPermissaoByIdInputZod.pick({ id: true }),

  CreatePermissaoInputZod.pick({
    description: true,
    recipe: true,
  }).partial()
);

export type IUpdatePermissaoInput = z.infer<typeof UpdatePermissaoInputZod>;
