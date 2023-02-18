import { IUpdateProfessorInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateProfessorInputType implements IUpdateProfessorInput {
  @Field()
  id!: string;

  @Field(() => String, { nullable: true })
  name?: string | undefined;

  @Field(() => String, { nullable: true })
  codSiape!: string | null | undefined;
}
