import { IFindCursoByIdInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindCursoByIdInputType implements IFindCursoByIdInput {
  @Field()
  id!: string;
}
