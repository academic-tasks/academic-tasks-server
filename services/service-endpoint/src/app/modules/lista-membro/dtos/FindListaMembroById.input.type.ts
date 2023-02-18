import { IFindListaMembroByIdInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindListaMembroByIdInputType implements IFindListaMembroByIdInput {
  @Field(() => String)
  id!: string;
}
