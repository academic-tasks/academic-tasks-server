import { IFindProfessorByIdInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindProfessorByIdInputType implements IFindProfessorByIdInput {
  @Field()
  id!: string;
}
