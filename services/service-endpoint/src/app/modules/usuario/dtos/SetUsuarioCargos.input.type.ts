import { ISetUsuarioRolesInput } from '@academic-tasks/schemas';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SetUsuarioCargosInputType implements ISetUsuarioRolesInput {
  @Field()
  id!: string;

  @Field(() => [String])
  cargos!: string[];
}
