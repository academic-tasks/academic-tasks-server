import { z } from "zod";

export const CreateListaInputZod = z.object({
  title: z.string().min(1).max(255),
});

export type ICreateListaInput = z.infer<typeof CreateListaInputZod>;
