import { z } from "zod";
import { FindDisciplinaByIdInputZod } from "../disciplina/FindDisciplinaByIdInputZod";
import { FindProfessorByIdInputZod } from "../professor";

export const AddProfessorToDisciplinaInputZod = z.object({
  professorId: FindProfessorByIdInputZod.shape.id,
  disciplinaId: FindDisciplinaByIdInputZod.shape.id,
});

export type IAddProfessorToDisciplinaInput = z.infer<
  typeof AddProfessorToDisciplinaInputZod
>;
