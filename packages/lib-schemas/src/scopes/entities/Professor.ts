import { Turma } from "./Turma";

export type Professor = {
  id: string;

  name: string;

  codSuap: string;

  //

  turmas: Turma[];
};
