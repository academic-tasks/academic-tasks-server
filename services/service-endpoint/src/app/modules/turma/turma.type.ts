import { Turma } from '@academic-tasks/schemas';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CursoType } from '../curso/curso.type';
import { DisciplinaType } from '../disciplina/disciplina.type';

@ObjectType('Turma')
export class TurmaType implements Turma {
  @Field()
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => Int)
  year!: number;

  @Field(() => String)
  serie!: string;

  @Field(() => String)
  turno!: string;

  @Field(() => CursoType)
  curso!: CursoType;

  @Field(() => [DisciplinaType])
  disciplinas!: DisciplinaType[];
}
