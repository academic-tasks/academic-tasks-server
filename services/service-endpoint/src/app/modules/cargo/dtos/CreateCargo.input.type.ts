import { ICreateCargoInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCargoInputType implements ICreateCargoInput {
  @Field(() => String)
  name!: string;
}
