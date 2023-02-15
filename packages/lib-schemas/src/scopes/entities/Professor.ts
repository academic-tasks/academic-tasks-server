import { Turma } from "./Turma";

export type Professor = {
  id: string;

  nome: string;

  codSuap: string;

  //

  turmas: Turma[];
};
