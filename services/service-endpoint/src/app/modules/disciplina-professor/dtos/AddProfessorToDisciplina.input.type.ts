import { IAddProfessorToDisciplinaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddProfessorToDisciplinaInputType
  implements IAddProfessorToDisciplinaInput
{
  @Field(() => String)
  professorId!: string;

  @Field(() => String)
  disciplinaId!: string;
}
