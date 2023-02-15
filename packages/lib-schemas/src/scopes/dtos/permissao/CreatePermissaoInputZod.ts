import { z } from "zod";

export const CreatePermissaoInputZod = z.object({
  description: z.string().min(1).max(255).default(""),

  recipe: z.string().max(3000),
});

export type ICreatePermissaoInput = z.infer<typeof CreatePermissaoInputZod>;
