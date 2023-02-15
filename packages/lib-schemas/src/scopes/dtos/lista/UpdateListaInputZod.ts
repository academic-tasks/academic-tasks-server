import { z } from "zod";
import { CreateListaInputZod } from "./CreateListaInputZod";
import { FindListaByIdInputZod } from "./FindListaByIdInputZod";

export const UpdateListaInputZod = z.intersection(
  FindListaByIdInputZod.pick({ id: true }),

  CreateListaInputZod.pick({
    title: true,
  }).partial()
);

export type IUpdateListaInput = z.infer<typeof UpdateListaInputZod>;
