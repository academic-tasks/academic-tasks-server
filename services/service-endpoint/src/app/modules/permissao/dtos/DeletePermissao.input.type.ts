import { IDeletePermissaoInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeletePermissaoInputType implements IDeletePermissaoInput {
  @Field()
  id!: string;
}
