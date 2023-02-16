import { IFindPermissaoByIdInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindPermissaoByIdInputType implements IFindPermissaoByIdInput {
  @Field()
  id!: string;
}
