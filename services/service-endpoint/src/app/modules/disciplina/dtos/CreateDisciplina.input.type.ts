import { ICreateDisciplinaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateDisciplinaInputType implements ICreateDisciplinaInput {
  @Field(() => String)
  turmaId!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  codSuap?: string | null | undefined;
}
