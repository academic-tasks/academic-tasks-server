import { z } from "zod";

export const CreateUsuarioInputZod = z.object({
  username: z.string().min(1).max(64),
});

export type ICreateUsuarioInput = z.infer<typeof CreateUsuarioInputZod>;
