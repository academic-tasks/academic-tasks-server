import { IFindListaByIdInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindListaByIdInputType implements IFindListaByIdInput {
  @Field()
  id!: string;
}
