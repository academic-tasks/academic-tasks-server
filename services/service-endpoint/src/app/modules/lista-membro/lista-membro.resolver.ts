import {
  AddMembroToListaInputZod,
  FindListaMembroByIdInputZod,
  RemoveMembroFromListaInputZod,
} from '@academic-tasks/schemas';
import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthMode } from 'src/infrastructure/auth/consts/AuthMode';
import { BindResourceActionRequest } from 'src/infrastructure/auth/decorators/BindResourceActionRequest.decorator';
import { ResourceAuth } from 'src/infrastructure/auth/decorators/ResourceAuth.decorator';
import { ResourceActionRequest } from 'src/infrastructure/auth/ResourceActionRequest';
import { ValidatedArgs } from 'src/infrastructure/graphql/ValidatedArgs.decorator';
import { ListaType } from '../lista/lista.type';
import { UsuarioType } from '../usuario/usuario.type';
import {
  AddMembroToListaInputType,
  RemoveMembroFromListaInputType,
} from './dtos';
import { FindListaMembroByIdInputType } from './dtos/FindListaMembroById.input.type';
import { ListaMembroService } from './lista-membro.service';
import { ListaMembroType } from './lista-membro.type';

@Resolver(() => ListaMembroType)
export class ListaMembroResolver {
  constructor(private listaMembroService: ListaMembroService) {}

  // START: queries

  @ResourceAuth(AuthMode.STRICT)
  @Query(() => ListaMembroType)
  async findListaMembroById(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', FindListaMembroByIdInputZod)
    dto: FindListaMembroByIdInputType,
  ) {
    const listaResourceActionRequest =
      await this.listaMembroService.getListaResourceActionRequestFromListaMembroId(
        resourceActionRequest,
        dto.id,
      );

    return this.listaMembroService.findListaMembroById(
      resourceActionRequest,
      listaResourceActionRequest,
      dto,
    );
  }

  // END: queries

  // START: mutations

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => Boolean)
  async addMembroToLista(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', AddMembroToListaInputZod)
    dto: AddMembroToListaInputType,
  ) {
    const listaResourceActionRequest =
      await this.listaMembroService.getListaResourceActionRequestFromListaId(
        resourceActionRequest,
        dto.listaId,
      );

    return this.listaMembroService.addMembroToLista(
      resourceActionRequest,
      listaResourceActionRequest,
      dto,
    );
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => Boolean)
  async removeMembroFromLista(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', RemoveMembroFromListaInputZod)
    dto: RemoveMembroFromListaInputType,
  ) {
    const listaResourceActionRequest =
      await this.listaMembroService.getListaResourceActionRequestFromListaId(
        resourceActionRequest,
        dto.listaId,
      );

    return this.listaMembroService.removeMembroFromLista(
      resourceActionRequest,
      listaResourceActionRequest,
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

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('lista', () => ListaType)
  async lista(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() listaMembro: ListaMembroType,
  ): Promise<ListaType> {
    const listaResourceActionRequest =
      await this.listaMembroService.getListaResourceActionRequestFromListaMembroId(
        resourceActionRequest,
        listaMembro.id,
      );

    const lista = await this.listaMembroService.getListaMembroLista(
      resourceActionRequest,
      listaResourceActionRequest,
      listaMembro.id,
    );

    return lista as ListaType;
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('usuario', () => UsuarioType)
  async usuario(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() listaMembro: ListaMembroType,
  ): Promise<UsuarioType> {
    const listaResourceActionRequest =
      await this.listaMembroService.getListaResourceActionRequestFromListaMembroId(
        resourceActionRequest,
        listaMembro.id,
      );

    const usuario = await this.listaMembroService.getListaMembroUsuario(
      resourceActionRequest,
      listaResourceActionRequest,
      listaMembro.id,
    );

    return usuario as UsuarioType;
  }

  // END: fields resolvers
}
