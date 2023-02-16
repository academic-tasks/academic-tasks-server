import { Permissao } from '@academic-tasks/schemas';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Permissao')
export class PermissaoType implements Permissao {
  @Field()
  id!: string;

  @Field(() => String)
  recipe!: string;

  @Field(() => String)
  description!: string;
}
