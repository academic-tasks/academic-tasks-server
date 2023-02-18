import { ICreateListaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateListaInputType implements ICreateListaInput {
  @Field(() => String)
  title!: string;
}
