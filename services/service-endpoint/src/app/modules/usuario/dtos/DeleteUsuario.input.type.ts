import { IDeleteUsuarioInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteUsuarioInputType implements IDeleteUsuarioInput {
  @Field(() => String)
  id!: string;
}
