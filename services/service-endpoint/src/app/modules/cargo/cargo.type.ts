import { Cargo, Permissao } from '@academic-tasks/schemas';
import { Field, ObjectType } from '@nestjs/graphql';
import { PermissaoType } from '../permissao/permissao.type';

@ObjectType('Cargo')
export class CargoType implements Cargo {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field(() => [PermissaoType])
  permissoes!: Permissao[];
}
