import { IFindTarefaByIdInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindTarefaByIdInputType implements IFindTarefaByIdInput {
  @Field()
  id!: string;
}
