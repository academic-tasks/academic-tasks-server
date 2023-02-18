import { IFindTurmaByIdInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindTurmaByIdInputType implements IFindTurmaByIdInput {
  @Field()
  id!: string;
}
