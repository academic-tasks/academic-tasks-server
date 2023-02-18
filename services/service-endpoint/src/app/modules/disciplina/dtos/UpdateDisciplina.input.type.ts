import { IUpdateDisciplinaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateDisciplinaInputType implements IUpdateDisciplinaInput {
  @Field()
  id!: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  codSuap?: string | null | undefined;
}
