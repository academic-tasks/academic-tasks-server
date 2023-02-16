import { IUpdateUsuarioInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUsuarioInputType implements IUpdateUsuarioInput {
  @Field()
  id!: string;

  @Field(() => String, { nullable: true })
  username?: string;
}
