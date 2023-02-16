import { IDeleteCargoInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteCargoInputType implements IDeleteCargoInput {
  @Field()
  id!: string;
}
