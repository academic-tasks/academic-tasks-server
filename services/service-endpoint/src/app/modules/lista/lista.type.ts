import { Lista, ListaMembro } from '@academic-tasks/schemas';
import { Field, ObjectType } from '@nestjs/graphql';
import { ListaMembroType } from '../lista-membro/lista-membro.type';

@ObjectType('Lista')
export class ListaType implements Lista {
  @Field()
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => [ListaMembroType])
  listaMembros!: ListaMembro[];
}
