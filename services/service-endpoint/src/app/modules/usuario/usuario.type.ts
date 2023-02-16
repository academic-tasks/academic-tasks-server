import { AppRawRule, Usuario } from '@academic-tasks/schemas';
import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { CargoType } from '../cargo/cargo.type';
import { ListaMembroType } from '../lista-membro/lista-membro.type';

@ObjectType('Usuario')
export class UsuarioType implements Usuario {
  @Field(() => String)
  id!: string;

  keycloakId!: string | null;

  @Field()
  username!: string;

  //

  @Field(() => [CargoType])
  cargos!: CargoType[];

  // @Field(() => [ListaMembroType])
  listaMembros!: ListaMembroType[];

  // computed

  @Field(() => GraphQLJSON)
  authorizationRules!: AppRawRule[];
}
