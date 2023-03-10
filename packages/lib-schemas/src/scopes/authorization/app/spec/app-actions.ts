export enum AppAction {
  MANAGE = "manage",

  CREATE = "create",

  READ = "read",
  LIST = "list",

  UPDATE = "update",
  DELETE = "delete",
}

export const appActions = [
  "manage",

  "create",

  "read",
  "list",

  "update",
  "delete",
] as const;
