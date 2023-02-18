import { ICreateTurmaInput } from '@academic-tasks/schemas';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateTurmaInputType implements ICreateTurmaInput {
  @Field(() => String)
  cursoId!: string;

  @Field(() => Int)
  year!: number;

  @Field(() => String)
  serie!: string;

  @Field(() => String)
  turno!: string;
}
