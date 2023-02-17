import { ICreateCursoInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCursoInputType implements ICreateCursoInput {
  @Field(() => String)
  name!: string;
}
