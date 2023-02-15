import { z } from "zod";
import { FindCargoByIdInputZod } from "./FindCargoByIdInputZod";

export const DeleteCargoInputZod = z.object({
  id: FindCargoByIdInputZod.shape.id,
});

export type IDeleteCargoInput = z.infer<typeof DeleteCargoInputZod>;
