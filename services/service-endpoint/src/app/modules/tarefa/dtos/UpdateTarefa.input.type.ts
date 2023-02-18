import { IUpdateTarefaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateTarefaInputType implements IUpdateTarefaInput {
  @Field()
  id!: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date, { nullable: true })
  dateOpen?: Date | null;

  @Field(() => Date, { nullable: true })
  dateClose?: Date | null;

  @Field(() => String, { nullable: true })
  submissionFormat?: string;
}
