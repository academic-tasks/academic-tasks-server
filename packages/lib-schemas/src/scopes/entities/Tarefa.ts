import { Disciplina } from "./Disciplina";
import { Lista } from "./Lista";

export type Tarefa = {
  id: string;

  title: string;
  description: string;

  dateOpen: Date | null;
  dateClose: Date | null;

  submissionFormat: string;

  //

  lista: Lista;

  disciplina: Disciplina;
};
