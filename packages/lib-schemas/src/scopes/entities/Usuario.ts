import { ListaMembro } from "./ListaMembro";

export type Usuario = {
  id: string;

  username: string;

  //

  memberships: ListaMembro[];
};
