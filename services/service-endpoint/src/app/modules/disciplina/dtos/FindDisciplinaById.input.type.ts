import { IFindDisciplinaByIdInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindDisciplinaByIdInputType implements IFindDisciplinaByIdInput {
  @Field()
  id!: string;
}
