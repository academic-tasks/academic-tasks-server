import { Curso } from '@academic-tasks/schemas';
import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { TurmaDbEntity } from 'src/app/entities/turma.db.entity';

@ObjectType('Curso')
export class CursoType implements Curso {
  @Field()
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => GraphQLJSON)
  turmas!: TurmaDbEntity[];
}
