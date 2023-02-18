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
import GraphQLJSON from 'graphql-type-json';
import { AuthMode } from '../../../infrastructure/auth/consts/AuthMode';
import { BindResourceActionRequest } from '../../../infrastructure/auth/decorators/BindResourceActionRequest.decorator';
import { ResourceAuth } from '../../../infrastructure/auth/decorators/ResourceAuth.decorator';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import { ValidatedArgs } from '../../../infrastructure/graphql/ValidatedArgs.decorator';
import { TarefaService } from './tarefa.service';
import { TarefaType } from './tarefa.type';
import {
  CreateTarefaInputType,
  DeleteTarefaInputType,
  FindTarefaByIdInputType,
  UpdateTarefaInputType,
} from './dtos';

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

  // END: fields resolvers
}
