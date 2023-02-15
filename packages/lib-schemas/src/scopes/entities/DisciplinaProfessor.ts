import { Disciplina } from "./Disciplina";
import { Professor } from "./Professor";

export type DisciplinaProfessor = {
  id: string;

  disciplina: Disciplina;

  professor: Professor;
};
