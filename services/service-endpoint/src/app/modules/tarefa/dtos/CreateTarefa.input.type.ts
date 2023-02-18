import { ICreateTarefaInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTarefaInputType implements ICreateTarefaInput {
  @Field(() => String)
  disciplinaId!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  description!: string;

  @Field(() => Date, { nullable: true })
  dateOpen!: Date | null;

  @Field(() => Date, { nullable: true })
  dateClose!: Date | null;

  @Field(() => String)
  submissionFormat!: string;
}
