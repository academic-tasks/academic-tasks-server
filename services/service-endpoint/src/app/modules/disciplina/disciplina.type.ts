import { Disciplina } from '@academic-tasks/schemas';
import { Field, ObjectType } from '@nestjs/graphql';
import { ProfessorType } from '../professor/professor.type';
import { TarefaType } from '../tarefa/tarefa.type';
import { TurmaType } from '../turma/turma.type';

@ObjectType('Disciplina')
export class DisciplinaType implements Disciplina {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  codSuap!: string;

  @Field(() => TurmaType)
  turma!: TurmaType;

  @Field(() => [TarefaType])
  tarefas!: TarefaType[];

  @Field(() => [ProfessorType])
  professores!: ProfessorType[];
}
