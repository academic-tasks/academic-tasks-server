import { z } from "zod";

export const IdZod = z.number().int().gt(0);

export const UUIDZod = z.string().uuid();
