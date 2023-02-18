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
import { AuthMode } from '../../../infrastructure/auth/consts/AuthMode';
import { BindResourceActionRequest } from '../../../infrastructure/auth/decorators/BindResourceActionRequest.decorator';
import { ResourceAuth } from '../../../infrastructure/auth/decorators/ResourceAuth.decorator';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import { ValidatedArgs } from '../../../infrastructure/graphql/ValidatedArgs.decorator';
import { DisciplinaType } from '../disciplina/disciplina.type';
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
  constructor(private tarefaService: TarefaService) {}

  // START: queries

  @ResourceAuth(AuthMode.STRICT)
  @Query(() => TarefaType)
  async findTarefaById(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', FindTarefaByIdInputZod)
    dto: FindTarefaByIdInputType,
  ) {
    return this.tarefaService.findTarefaById(resourceActionRequest, dto);
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
    return this.tarefaService.createTarefa(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => TarefaType)
  async updateTarefa(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', UpdateTarefaInputZod)
    dto: UpdateTarefaInputType,
  ) {
    return this.tarefaService.updateTarefa(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => TarefaType)
  async deleteTarefa(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', DeleteTarefaInputZod)
    dto: DeleteTarefaInputType,
  ) {
    return this.tarefaService.deleteTarefa(resourceActionRequest, dto);
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
    return this.tarefaService.getTarefaTitle(resourceActionRequest, tarefa.id);
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('description', () => String)
  async description(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() tarefa: TarefaType,
  ): Promise<TarefaType['description']> {
    return this.tarefaService.getTarefaDescription(
      resourceActionRequest,
      tarefa.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('dateOpen', () => Date, { nullable: true })
  async dateOpen(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() tarefa: TarefaType,
  ): Promise<TarefaType['dateOpen']> {
    return this.tarefaService.getTarefaDateOpen(
      resourceActionRequest,
      tarefa.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('dateClose', () => Date, { nullable: true })
  async dateClose(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() tarefa: TarefaType,
  ): Promise<TarefaType['dateClose']> {
    return this.tarefaService.getTarefaDateClose(
      resourceActionRequest,
      tarefa.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('submissionFormat', () => String)
  async submissionFormat(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() tarefa: TarefaType,
  ): Promise<TarefaType['submissionFormat']> {
    return this.tarefaService.getTarefaSubmissionFormat(
      resourceActionRequest,
      tarefa.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('lista', () => ListaType)
  async lista(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() tarefa: TarefaType,
  ): Promise<ListaType> {
    const lista = await this.tarefaService.getTarefaLista(
      resourceActionRequest,
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
    const disciplina = await this.tarefaService.getTarefaDisciplina(
      resourceActionRequest,
      tarefa.id,
    );

    return disciplina as DisciplinaType;
  }

  // END: fields resolvers
}
