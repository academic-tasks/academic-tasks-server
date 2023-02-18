import { ListaMembro } from '@academic-tasks/schemas';
import { Field } from '@nestjs/graphql';
import { ListaType } from '../lista/lista.type';
import { UsuarioType } from '../usuario/usuario.type';

export class ListaMembroType implements ListaMembro {
  @Field()
  id!: string;

  @Field(() => ListaType)
  lista!: ListaType;

  @Field(() => UsuarioType)
  usuario!: UsuarioType;
}
