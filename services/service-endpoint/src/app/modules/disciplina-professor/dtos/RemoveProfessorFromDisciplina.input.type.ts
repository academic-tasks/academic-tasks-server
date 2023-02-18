import { IRemoveProfessorFromDisciplinaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveProfessorFromDisciplinaInputType
  implements IRemoveProfessorFromDisciplinaInput
{
  @Field(() => String)
  professorId!: string;

  @Field(() => String)
  disciplinaId!: string;
}
