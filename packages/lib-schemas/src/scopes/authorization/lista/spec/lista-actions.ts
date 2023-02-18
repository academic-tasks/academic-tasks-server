export enum ListaAction {
  MANAGE = "manage",

  //

  CREATE = "create",

  READ = "read",
  LIST = "list",

  UPDATE = "update",
  DELETE = "delete",
}

export const listaActions = [
  "manage",

  //

  "create",

  "read",
  "list",

  "update",
  "delete",
] as const;
