import { Professor } from '@academic-tasks/schemas';
import { Field, ObjectType } from '@nestjs/graphql';
import { DisciplinaType } from '../disciplina/disciplina.type';

@ObjectType('Professor')
export class ProfessorType implements Professor {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  codSuap!: string;

  //

  @Field(() => [DisciplinaType])
  disciplinas!: DisciplinaType[];
}
