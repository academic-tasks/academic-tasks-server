import { Tarefa } from '@academic-tasks/schemas';
import { Field, ObjectType } from '@nestjs/graphql';
import { DisciplinaType } from '../disciplina/disciplina.type';
import { ListaType } from '../lista/lista.type';

@ObjectType('Tarefa')
export class TarefaType implements Tarefa {
  @Field()
  id!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field(() => Date, { nullable: true })
  dateOpen!: Date | null;

  @Field(() => Date, { nullable: true })
  dateClose!: Date | null;

  @Field()
  submissionFormat!: string;

  //

  @Field(() => ListaType)
  lista!: ListaType;

  @Field(() => DisciplinaType)
  disciplina!: DisciplinaType;
}
