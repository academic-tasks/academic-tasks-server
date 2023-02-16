import { IUpdatePermissaoInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePermissaoInputType implements IUpdatePermissaoInput {
  @Field()
  id!: string;

  @Field(() => String, { nullable: true })
  recipe?: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
