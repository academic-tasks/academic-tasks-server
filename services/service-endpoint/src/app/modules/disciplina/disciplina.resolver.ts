import {
  CreateDisciplinaInputZod,
  DeleteDisciplinaInputZod,
  FindDisciplinaByIdInputZod,
  UpdateDisciplinaInputZod,
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
import { DisciplinaService } from './disciplina.service';
import { DisciplinaType } from './disciplina.type';
import {
  CreateDisciplinaInputType,
  DeleteDisciplinaInputType,
  FindDisciplinaByIdInputType,
  UpdateDisciplinaInputType,
} from './dtos';

@Resolver(() => DisciplinaType)
export class DisciplinaResolver {
  constructor(private disciplinaService: DisciplinaService) {}

  // START: queries

  @ResourceAuth(AuthMode.STRICT)
  @Query(() => DisciplinaType)
  async findDisciplinaById(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', FindDisciplinaByIdInputZod)
    dto: FindDisciplinaByIdInputType,
  ) {
    return this.disciplinaService.findDisciplinaById(resourceActionRequest, dto);
  }

  // END: queries

  // START: mutations

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => DisciplinaType)
  async createDisciplina(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', CreateDisciplinaInputZod)
    dto: CreateDisciplinaInputType,
  ) {
    return this.disciplinaService.createDisciplina(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => DisciplinaType)
  async updateDisciplina(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', UpdateDisciplinaInputZod)
    dto: UpdateDisciplinaInputType,
  ) {
    return this.disciplinaService.updateDisciplina(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => DisciplinaType)
  async deleteDisciplina(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', DeleteDisciplinaInputZod)
    dto: DeleteDisciplinaInputType,
  ) {
    return this.disciplinaService.deleteDisciplina(resourceActionRequest, dto);
  }
  // END: mutations

  // START: fields resolvers

  /*
  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('field', () => GraphQLJSON)
  async field(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() disciplina: DisciplinaType,
  ): Promise<DisciplinaType['field']> {
    return this.disciplinaService.getDisciplinaField(resourceActionRequest, disciplina.id);
  }
  */

  /*
  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('relation', () => GraphQLJSON)
  async relation(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() disciplina: DisciplinaType,
  ): Promise<DisciplinaType['relation']> {
    return this.disciplinaService.getDisciplinaRelation(resourceActionRequest, disciplina.id);
  }
  */

  // END: fields resolvers
}
