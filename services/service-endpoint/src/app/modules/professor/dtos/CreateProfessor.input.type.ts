import { ICreateProfessorInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProfessorInputType implements ICreateProfessorInput {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  codSiape!: string | null | undefined;
}
