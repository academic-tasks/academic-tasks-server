import { IDeleteTurmaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteTurmaInputType implements IDeleteTurmaInput {
  @Field()
  id!: string;
}
