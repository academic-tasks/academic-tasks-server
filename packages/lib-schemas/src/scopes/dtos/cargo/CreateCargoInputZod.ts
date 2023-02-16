import { z } from "zod";

export const CreateCargoInputZod = z.object({
  name: z.string().min(1).max(255),
});

export type ICreateCargoInput = z.infer<typeof CreateCargoInputZod>;
