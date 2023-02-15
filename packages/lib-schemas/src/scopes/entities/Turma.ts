import { Curso } from "./Curso";
import { Disciplina } from "./Disciplina";

export type Turma = {
  id: string;

  nome: string;

  dataInicio: Date;

  serie: string;

  turno: string;

  //

  curso: Curso;

  disciplinas: Disciplina[];
};
