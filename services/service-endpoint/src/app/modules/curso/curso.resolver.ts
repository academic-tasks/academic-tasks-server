import {
  CreateCursoInputZod,
  DeleteCursoInputZod,
  FindCursoByIdInputZod,
  UpdateCursoInputZod,
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
import { TurmaType } from '../turma/turma.type';
import { CursoService } from './curso.service';
import { CursoType } from './curso.type';
import {
  CreateCursoInputType,
  DeleteCursoInputType,
  FindCursoByIdInputType,
  UpdateCursoInputType,
} from './dtos';

@Resolver(() => CursoType)
export class CursoResolver {
  constructor(private cursoService: CursoService) {}

  // START: queries

  @ResourceAuth(AuthMode.OPTIONAL)
  @Query(() => CursoType)
  async findCursoById(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', FindCursoByIdInputZod)
    dto: FindCursoByIdInputType,
  ) {
    return this.cursoService.findCursoById(resourceActionRequest, dto);
  }

  // END: queries

  // START: mutations

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => CursoType)
  async createCurso(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', CreateCursoInputZod)
    dto: CreateCursoInputType,
  ) {
    return this.cursoService.createCurso(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => CursoType)
  async updateCurso(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', UpdateCursoInputZod)
    dto: UpdateCursoInputType,
  ) {
    return this.cursoService.updateCurso(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => CursoType)
  async deleteCurso(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', DeleteCursoInputZod)
    dto: DeleteCursoInputType,
  ) {
    return this.cursoService.deleteCurso(resourceActionRequest, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('name', () => String)
  async name(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() curso: CursoType,
  ): Promise<CursoType['name']> {
    return this.cursoService.getCursoName(resourceActionRequest, curso.id);
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('turmas', () => [TurmaType])
  async turmas(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() curso: CursoType,
  ): Promise<CursoType['turmas']> {
    return this.cursoService.getCursoTurmas(resourceActionRequest, curso.id);
  }

  // END: fields resolvers
}
