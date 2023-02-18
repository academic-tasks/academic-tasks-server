import { ForcedSubject } from "@casl/ability";
import { listaActions } from "../spec/lista-actions";
import { listaSubjects } from "../spec/lista-subjects";

export type ListaAbilities = [
  typeof listaActions[number],
  (
    | typeof listaSubjects[number]
    | ForcedSubject<Exclude<typeof listaSubjects[number], "all">>
  )
];
