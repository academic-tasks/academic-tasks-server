import { z } from "zod";
import { FindDisciplinaByIdInputZod } from "../disciplina/FindDisciplinaByIdInputZod";
import { FindProfessorByIdInputZod } from "../professor";

export const RemoveProfessorFromDisciplinaInputZod = z.object({
  professorId: FindProfessorByIdInputZod.shape.id,
  disciplinaId: FindDisciplinaByIdInputZod.shape.id,
});

export type IRemoveProfessorFromDisciplinaInput = z.infer<
  typeof RemoveProfessorFromDisciplinaInputZod
>;
