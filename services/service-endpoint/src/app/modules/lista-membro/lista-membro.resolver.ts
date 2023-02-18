import {
  AddMembroToListaInputZod,
  RemoveMembroFromListaInputZod,
} from '@academic-tasks/schemas';
import { Mutation, Resolver } from '@nestjs/graphql';
import { AuthMode } from 'src/infrastructure/auth/consts/AuthMode';
import { BindResourceActionRequest } from 'src/infrastructure/auth/decorators/BindResourceActionRequest.decorator';
import { ResourceAuth } from 'src/infrastructure/auth/decorators/ResourceAuth.decorator';
import { ResourceActionRequest } from 'src/infrastructure/auth/ResourceActionRequest';
import { ValidatedArgs } from 'src/infrastructure/graphql/ValidatedArgs.decorator';
import {
  AddMembroToListaInputType,
  RemoveMembroFromListaInputType,
} from './dtos';
import { ListaMembroService } from './lista-membro.service';
import { ListaMembroType } from './lista-membro.type';

@Resolver(() => ListaMembroType)
export class ListaMembroResolver {
  constructor(private listaMembroService: ListaMembroService) {}

  // START: queries

  // END: queries

  // START: mutations

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => Boolean)
  async addMembroToLista(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', AddMembroToListaInputZod)
    dto: AddMembroToListaInputType,
  ) {
    return this.listaMembroService.addMembroToLista(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => Boolean)
  async removeMembroFromLista(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', RemoveMembroFromListaInputZod)
    dto: RemoveMembroFromListaInputType,
  ) {
    return this.listaMembroService.removeMembroFromLista(
      resourceActionRequest,
      dto,
    );
  }

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
