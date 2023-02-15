import { z } from "zod";
import { CreateCargoInputZod } from "./CreateCargoInputZod";
import { FindCargoByIdInputZod } from "./FindCargoByIdInputZod";

export const UpdateCargoInputZod = z.intersection(
  z.object({
    id: FindCargoByIdInputZod.shape.id,
  }),
  CreateCargoInputZod.pick({}).partial()
);

export type IUpdateCargoInputZod = z.infer<typeof UpdateCargoInputZod>;
