import { ICreatePermissaoInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePermissaoInputType implements ICreatePermissaoInput {
  @Field(() => String)
  description!: string;

  @Field(() => String)
  recipe!: string;
}
