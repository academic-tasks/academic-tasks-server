import { IDeleteTarefaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteTarefaInputType implements IDeleteTarefaInput {
  @Field()
  id!: string;
}
