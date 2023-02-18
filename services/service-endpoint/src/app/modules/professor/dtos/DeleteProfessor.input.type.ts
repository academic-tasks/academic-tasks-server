import { IDeleteProfessorInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteProfessorInputType implements IDeleteProfessorInput {
  @Field()
  id!: string;
}
