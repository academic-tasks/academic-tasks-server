import { Resolver } from '@nestjs/graphql';
import { ListaMembroService } from './lista-membro.service';
import { ListaMembroType } from './lista-membro.type';

@Resolver(() => ListaMembroType)
export class ListaMembroResolver {
  constructor(private listaMembroService: ListaMembroService) {}

  // START: queries

  // END: mutations

  // START: fields resolvers

  /*
  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('field', () => GraphQLJSON)
  async field(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() listaMembro: ListaMembroType,
  ): Promise<ListaMembroType['field']> {
    return this.listaMembroService.getListaMembroField(resourceActionRequest, listaMembro.id);
  }
  */

  /*
  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('relation', () => GraphQLJSON)
  async relation(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() listaMembro: ListaMembroType,
  ): Promise<ListaMembroType['relation']> {
    return this.listaMembroService.getListaMembroRelation(resourceActionRequest, listaMembro.id);
  }
  */

  // END: fields resolvers
}
