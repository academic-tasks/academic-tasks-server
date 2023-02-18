import { IUpdateListaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateListaInputType implements IUpdateListaInput {
  @Field()
  id!: string;

  @Field(() => String, { nullable: true })
  title?: string;
}
