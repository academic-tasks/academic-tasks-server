import { Curso } from '@academic-tasks/schemas';
import { Field, ObjectType } from '@nestjs/graphql';
import { TurmaType } from '../turma/turma.type';

@ObjectType('Curso')
export class CursoType implements Curso {
  @Field()
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => [TurmaType])
  turmas!: TurmaType[];
}
