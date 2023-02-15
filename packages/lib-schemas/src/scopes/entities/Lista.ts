import { ListaMembro } from "./ListaMembro";

export type Lista = {
  id: string;

  titulo: string;

  membros: ListaMembro[];
};
