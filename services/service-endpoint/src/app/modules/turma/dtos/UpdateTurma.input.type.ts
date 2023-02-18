import { IUpdateTurmaInput } from '@academic-tasks/schemas';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateTurmaInputType implements IUpdateTurmaInput {
  @Field()
  id!: string;

  @Field(() => Int, { nullable: true })
  year?: number;

  @Field(() => String, { nullable: true })
  serie?: string;

  @Field(() => String, { nullable: true })
  turno?: string;
}
