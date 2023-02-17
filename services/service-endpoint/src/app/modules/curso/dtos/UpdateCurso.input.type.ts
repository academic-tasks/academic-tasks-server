import { IUpdateCursoInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCursoInputType implements IUpdateCursoInput {
  @Field()
  id!: string;

  @Field(() => String, { nullable: true })
  name?: string;
}
