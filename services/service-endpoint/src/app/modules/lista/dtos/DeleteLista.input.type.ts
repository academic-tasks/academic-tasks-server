import { IDeleteListaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteListaInputType implements IDeleteListaInput {
  @Field()
  id!: string;
}
