import { ICreateUsuarioInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUsuarioInputType implements ICreateUsuarioInput {
  @Field()
  username!: string;
}
