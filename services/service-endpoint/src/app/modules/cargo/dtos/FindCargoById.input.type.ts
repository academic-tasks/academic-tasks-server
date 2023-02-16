import { IFindCargoByIdInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindCargoByIdInputType implements IFindCargoByIdInput {
  @Field()
  id!: string;
}
