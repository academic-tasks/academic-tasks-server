import { z } from "zod";
import { CreateUsuarioInputZod } from "./CreateUsuarioInputZod";
import { FindUsuarioByIdInputZod } from "./FindUsuarioByIdInputZod";

export const UpdateUsuarioInputZod = z.intersection(
  FindUsuarioByIdInputZod.pick({ id: true }),

  CreateUsuarioInputZod.pick({
    username: true,
  }).partial()
);

export type IUpdateUsuarioInput = z.infer<typeof UpdateUsuarioInputZod>;
