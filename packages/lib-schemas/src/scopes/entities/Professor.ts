import { Disciplina } from "./Disciplina";

export type Professor = {
  id: string;

  name: string;

  codSuap: string;

  //

  disciplinas: Disciplina[];
};
