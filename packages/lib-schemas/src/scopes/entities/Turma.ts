import { Curso } from "./Curso";
import { Disciplina } from "./Disciplina";

export type Turma = {
  id: string;

  name: string;

  year: number;

  serie: string;

  turno: string;

  //

  curso: Curso;

  disciplinas: Disciplina[];
};
