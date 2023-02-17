import { IDeleteCursoInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteCursoInputType implements IDeleteCursoInput {
  @Field()
  id!: string;
}
