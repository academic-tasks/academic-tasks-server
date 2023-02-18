import { ListaMembro } from '@academic-tasks/schemas';
import { Field, ObjectType } from '@nestjs/graphql';
import { ListaType } from '../lista/lista.type';
import { UsuarioType } from '../usuario/usuario.type';

@ObjectType('ListaMembro')
export class ListaMembroType implements ListaMembro {
  @Field()
  id!: string;

  @Field(() => ListaType)
  lista!: ListaType;

  @Field(() => UsuarioType)
  usuario!: UsuarioType;
}
