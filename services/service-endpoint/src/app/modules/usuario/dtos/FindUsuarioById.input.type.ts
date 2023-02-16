import { IFindUsuarioByIdInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindUsuarioByIdInputType implements IFindUsuarioByIdInput {
  @Field(() => String)
  id!: string;
}
