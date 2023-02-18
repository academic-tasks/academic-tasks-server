import {
  CreateTarefaInputZod,
  DeleteTarefaInputZod,
  FindTarefaByIdInputZod,
  UpdateTarefaInputZod,
} from '@academic-tasks/schemas';
import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ListaResourceActionRequest } from 'src/infrastructure/auth-lista/ListaResourceActionRequest';
import { AuthMode } from '../../../infrastructure/auth/consts/AuthMode';
import { BindResourceActionRequest } from '../../../infrastructure/auth/decorators/BindResourceActionRequest.decorator';
import { ResourceAuth } from '../../../infrastructure/auth/decorators/ResourceAuth.decorator';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import { ValidatedArgs } from '../../../infrastructure/graphql/ValidatedArgs.decorator';
import { DisciplinaType } from '../disciplina/disciplina.type';
import { ListaMembroService } from '../lista-membro/lista-membro.service';
import { ListaType } from '../lista/lista.type';
import {
  CreateTarefaInputType,
  DeleteTarefaInputType,
  FindTarefaByIdInputType,
  UpdateTarefaInputType,
} from './dtos';
import { TarefaService } from './tarefa.service';
import { TarefaType } from './tarefa.type';

@Resolver(() => TarefaType)
export class TarefaResolver {
  constructor(
    private tarefaService: TarefaService,
    private listaMembroService: ListaMembroService,
  ) {}

  // START: queries

  @ResourceAuth(AuthMode.STRICT)
  @Query(() => TarefaType)
  async findTarefaById(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', FindTarefaByIdInputZod)
    dto: FindTarefaByIdInputType,
  ) {
    const listaResourceActionRequest =
      await this.getListaResourceActionRequestFromTarefaId(
        resourceActionRequest,
        dto.id,
      );

    return this.tarefaService.findTarefaById(
      resourceActionRequest,
      listaResourceActionRequest,
      dto,
    );
  }

  // END: queries

  // START: mutations

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => TarefaType)
  async createTarefa(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', CreateTarefaInputZod)
    dto: CreateTarefaInputType,
  ) {
    const listaResourceActionRequest =
      await this.listaMembroService.getListaResourceActionRequestFromListaId(
        resourceActionRequest,
        dto.listaId,
      );

    return this.tarefaService.createTarefa(
      resourceActionRequest,
      listaResourceActionRequest,
      dto,
    );
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => TarefaType)
  async updateTarefa(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', UpdateTarefaInputZod)
    dto: UpdateTarefaInputType,
  ) {
    const listaResourceActionRequest =
      await this.getListaResourceActionRequestFromTarefaId(
        resourceActionRequest,
        dto.id,
      );

    return this.tarefaService.updateTarefa(
      resourceActionRequest,
      listaResourceActionRequest,
      dto,
    );
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => TarefaType)
  async deleteTarefa(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', DeleteTarefaInputZod)
    dto: DeleteTarefaInputType,
  ) {
    const listaResourceActionRequest =
      await this.getListaResourceActionRequestFromTarefaId(
        resourceActionRequest,
        dto.id,
      );

    return this.tarefaService.deleteTarefa(
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
    @Parent() tarefa: TarefaType,
  ): Promise<TarefaType['field']> {
    return this.tarefaService.getTarefaField(resourceActionRequest, tarefa.id);
  }
  */

  /*
  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('relation', () => GraphQLJSON)
  async relation(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() tarefa: TarefaType,
  ): Promise<TarefaType['relation']> {
    return this.tarefaService.getTarefaRelation(resourceActionRequest, tarefa.id);
  }
  */

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('title', () => String)
  async title(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() tarefa: TarefaType,
  ): Promise<TarefaType['title']> {
    const listaResourceActionRequest =
      await this.getListaResourceActionRequestFromTarefaId(
        resourceActionRequest,
        tarefa.id,
      );

    return this.tarefaService.getTarefaTitle(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefa.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('description', () => String)
  async description(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() tarefa: TarefaType,
  ): Promise<TarefaType['description']> {
    const listaResourceActionRequest =
      await this.getListaResourceActionRequestFromTarefaId(
        resourceActionRequest,
        tarefa.id,
      );

    return this.tarefaService.getTarefaDescription(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefa.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('dateOpen', () => Date, { nullable: true })
  async dateOpen(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() tarefa: TarefaType,
  ): Promise<TarefaType['dateOpen']> {
    const listaResourceActionRequest =
      await this.getListaResourceActionRequestFromTarefaId(
        resourceActionRequest,
        tarefa.id,
      );

    return this.tarefaService.getTarefaDateOpen(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefa.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('dateClose', () => Date, { nullable: true })
  async dateClose(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() tarefa: TarefaType,
  ): Promise<TarefaType['dateClose']> {
    const listaResourceActionRequest =
      await this.getListaResourceActionRequestFromTarefaId(
        resourceActionRequest,
        tarefa.id,
      );

    return this.tarefaService.getTarefaDateClose(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefa.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('submissionFormat', () => String)
  async submissionFormat(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() tarefa: TarefaType,
  ): Promise<TarefaType['submissionFormat']> {
    const listaResourceActionRequest =
      await this.getListaResourceActionRequestFromTarefaId(
        resourceActionRequest,
        tarefa.id,
      );

    return this.tarefaService.getTarefaSubmissionFormat(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefa.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('lista', () => ListaType)
  async lista(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() tarefa: TarefaType,
  ): Promise<ListaType> {
    const listaResourceActionRequest =
      await this.getListaResourceActionRequestFromTarefaId(
        resourceActionRequest,
        tarefa.id,
      );

    const lista = await this.tarefaService.getTarefaLista(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefa.id,
    );

    return lista as ListaType;
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('disciplina', () => DisciplinaType)
  async disciplina(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() tarefa: TarefaType,
  ): Promise<DisciplinaType> {
    const listaResourceActionRequest =
      await this.getListaResourceActionRequestFromTarefaId(
        resourceActionRequest,
        tarefa.id,
      );

    const disciplina = await this.tarefaService.getTarefaDisciplina(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefa.id,
    );

    return disciplina as DisciplinaType;
  }

  //

  async getListaResourceActionRequestFromTarefaId(
    resourceActionRequest: ResourceActionRequest,
    tarefaId: string,
  ): Promise<ListaResourceActionRequest> {
    const tarefa = await this.tarefaService.findTarefaByIdSimple(
      ResourceActionRequest.forSystemInternalActions(),
      ListaResourceActionRequest.forSystemInternalActions(),
      tarefaId,
    );

    const lista = await this.tarefaService.getTarefaLista(
      ResourceActionRequest.forSystemInternalActions(),
      ListaResourceActionRequest.forSystemInternalActions(),
      tarefa.id,
    );

    return this.listaMembroService.getListaResourceActionRequestFromListaId(
      resourceActionRequest,
      lista.id,
    );
  }

  // END: fields resolvers
}
