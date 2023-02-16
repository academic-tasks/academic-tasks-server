import { IUpdateCargoInputZod } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCargoInputType implements IUpdateCargoInputZod {
  @Field()
  id!: string;
}
