import { IDeleteDisciplinaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteDisciplinaInputType implements IDeleteDisciplinaInput {
  @Field()
  id!: string;
}
