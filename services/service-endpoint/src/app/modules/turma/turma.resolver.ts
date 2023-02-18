import {
  CreateTurmaInputZod,
  DeleteTurmaInputZod,
  FindTurmaByIdInputZod,
  UpdateTurmaInputZod,
} from '@academic-tasks/schemas';
import {
  Int,
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
import { CursoType } from '../curso/curso.type';
import {
  CreateTurmaInputType,
  DeleteTurmaInputType,
  FindTurmaByIdInputType,
  UpdateTurmaInputType,
} from './dtos';
import { TurmaService } from './turma.service';
import { TurmaType } from './turma.type';

@Resolver(() => TurmaType)
export class TurmaResolver {
  constructor(private turmaService: TurmaService) {}

  // START: queries

  @ResourceAuth(AuthMode.STRICT)
  @Query(() => TurmaType)
  async findTurmaById(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', FindTurmaByIdInputZod)
    dto: FindTurmaByIdInputType,
  ) {
    return this.turmaService.findTurmaById(resourceActionRequest, dto);
  }

  // END: queries

  // START: mutations

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => TurmaType)
  async createTurma(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', CreateTurmaInputZod)
    dto: CreateTurmaInputType,
  ) {
    return this.turmaService.createTurma(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => TurmaType)
  async updateTurma(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', UpdateTurmaInputZod)
    dto: UpdateTurmaInputType,
  ) {
    return this.turmaService.updateTurma(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => TurmaType)
  async deleteTurma(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', DeleteTurmaInputZod)
    dto: DeleteTurmaInputType,
  ) {
    return this.turmaService.deleteTurma(resourceActionRequest, dto);
  }
  // END: mutations

  // START: fields resolvers

  /*
  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('field', () => GraphQLJSON)
  async field(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() turma: TurmaType,
  ): Promise<TurmaType['field']> {
    return this.turmaService.getTurmaField(resourceActionRequest, turma.id);
  }
  */

  /*
  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('relation', () => GraphQLJSON)
  async relation(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() turma: TurmaType,
  ): Promise<TurmaType['relation']> {
    return this.turmaService.getTurmaRelation(resourceActionRequest, turma.id);
  }
  */

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('name', () => String)
  async name(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() turma: TurmaType,
  ): Promise<TurmaType['name']> {
    return this.turmaService.getTurmaName(resourceActionRequest, turma.id);
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('year', () => Int)
  async year(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() turma: TurmaType,
  ): Promise<TurmaType['year']> {
    return this.turmaService.getTurmaYear(resourceActionRequest, turma.id);
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('serie', () => String)
  async serie(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() turma: TurmaType,
  ): Promise<TurmaType['serie']> {
    return this.turmaService.getTurmaSerie(resourceActionRequest, turma.id);
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('turno', () => String)
  async turno(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() turma: TurmaType,
  ): Promise<TurmaType['turno']> {
    return this.turmaService.getTurmaTurno(resourceActionRequest, turma.id);
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('curso', () => CursoType)
  async curso(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() turma: TurmaType,
  ): Promise<TurmaType['curso']> {
    return this.turmaService.getTurmaCurso(resourceActionRequest, turma.id);
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('disciplinas', () => GraphQLJSON)
  async disciplinas(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() turma: TurmaType,
  ): Promise<TurmaType['disciplinas']> {
    return this.turmaService.getTurmaDisciplinas(
      resourceActionRequest,
      turma.id,
    );
  }
  // END: fields resolvers
}
