import {
  CreateListaInputZod,
  DeleteListaInputZod,
  FindListaByIdInputZod,
  ListaMembro,
  UpdateListaInputZod,
} from '@academic-tasks/schemas';
import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { AuthMode } from '../../../infrastructure/auth/consts/AuthMode';
import { BindResourceActionRequest } from '../../../infrastructure/auth/decorators/BindResourceActionRequest.decorator';
import { ResourceAuth } from '../../../infrastructure/auth/decorators/ResourceAuth.decorator';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import { ValidatedArgs } from '../../../infrastructure/graphql/ValidatedArgs.decorator';
import { ListaMembroService } from '../lista-membro/lista-membro.service';
import { ListaMembroType } from '../lista-membro/lista-membro.type';
import {
  CreateListaInputType,
  DeleteListaInputType,
  FindListaByIdInputType,
  UpdateListaInputType,
} from './dtos';
import { ListaService } from './lista.service';
import { ListaType } from './lista.type';

@Resolver(() => ListaType)
export class ListaResolver {
  constructor(
    private listaService: ListaService,
    private listaMembroService: ListaMembroService,
  ) {}

  // START: queries

  @ResourceAuth(AuthMode.STRICT)
  @Query(() => ListaType)
  async findListaById(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', FindListaByIdInputZod)
    dto: FindListaByIdInputType,
  ) {
    return this.listaService.findListaById(resourceActionRequest, dto);
  }

  // END: queries

  // START: mutations

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => ListaType)
  async createLista(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', CreateListaInputZod)
    dto: CreateListaInputType,
  ) {
    return this.listaService.createLista(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => ListaType)
  async updateLista(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', UpdateListaInputZod)
    dto: UpdateListaInputType,
  ) {
    const listaResourceActionRequest =
      await this.listaMembroService.getListaResourceActionRequestFromListaId(
        resourceActionRequest,
        dto.id,
      );

    return this.listaService.updateLista(
      resourceActionRequest,
      listaResourceActionRequest,
      dto,
    );
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => ListaType)
  async deleteLista(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', DeleteListaInputZod)
    dto: DeleteListaInputType,
  ) {
    const listaResourceActionRequest =
      await this.listaMembroService.getListaResourceActionRequestFromListaId(
        resourceActionRequest,
        dto.id,
      );

    return this.listaService.deleteLista(
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
    @Parent() lista: ListaType,
  ): Promise<ListaType['field']> {
    return this.listaService.getListaField(resourceActionRequest, lista.id);
  }
  */

  /*
  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('relation', () => GraphQLJSON)
  async relation(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() lista: ListaType,
  ): Promise<ListaType['relation']> {
    return this.listaService.getListaRelation(resourceActionRequest, lista.id);
  }
  */

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('title', () => GraphQLJSON)
  async title(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() lista: ListaType,
  ): Promise<ListaType['title']> {
    const listaResourceActionRequest =
      await this.listaMembroService.getListaResourceActionRequestFromListaId(
        resourceActionRequest,
        lista.id,
      );

    return this.listaService.getListaTitle(
      resourceActionRequest,
      listaResourceActionRequest,
      lista.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('listaMembros', () => [ListaMembroType])
  async listaMembros(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() lista: ListaType,
  ): Promise<ListaMembro[]> {
    const listaResourceActionRequest =
      await this.listaMembroService.getListaResourceActionRequestFromListaId(
        resourceActionRequest,
        lista.id,
      );

    return this.listaService.getListaListaMembros(
      resourceActionRequest,
      listaResourceActionRequest,
      lista.id,
    );
  }

  // END: fields resolvers
}
