import { Professor } from "./Professor";
import { Tarefa } from "./Tarefa";
import { Turma } from "./Turma";

export type Disciplina = {
  id: string;

  name: string;

  codSuap: string;

  //

  turma: Turma;

  tarefas: Tarefa[];

  professores: Professor[];
};
