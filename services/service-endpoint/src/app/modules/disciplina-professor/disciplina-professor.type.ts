import { DisciplinaProfessor } from '@academic-tasks/schemas';
import { Field, ObjectType } from '@nestjs/graphql';
import { DisciplinaType } from '../disciplina/disciplina.type';
import { ProfessorType } from '../professor/professor.type';

@ObjectType('DisciplinaProfessor')
export class DisciplinaProfessorType implements DisciplinaProfessor {
  @Field()
  id!: string;

  @Field(() => ProfessorType)
  professor!: ProfessorType;

  @Field(() => DisciplinaType)
  disciplina!: DisciplinaType;
}
