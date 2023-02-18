import {
  CreateProfessorInputZod,
  DeleteProfessorInputZod,
  FindProfessorByIdInputZod,
  UpdateProfessorInputZod,
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
import {
  CreateProfessorInputType,
  DeleteProfessorInputType,
  FindProfessorByIdInputType,
  UpdateProfessorInputType,
} from './dtos';
import { ProfessorService } from './professor.service';
import { ProfessorType } from './professor.type';

@Resolver(() => ProfessorType)
export class ProfessorResolver {
  constructor(private professorService: ProfessorService) {}

  // START: queries

  @ResourceAuth(AuthMode.STRICT)
  @Query(() => ProfessorType)
  async findProfessorById(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', FindProfessorByIdInputZod)
    dto: FindProfessorByIdInputType,
  ) {
    return this.professorService.findProfessorById(resourceActionRequest, dto);
  }

  // END: queries

  // START: mutations

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => ProfessorType)
  async createProfessor(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', CreateProfessorInputZod)
    dto: CreateProfessorInputType,
  ) {
    return this.professorService.createProfessor(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => ProfessorType)
  async updateProfessor(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', UpdateProfessorInputZod)
    dto: UpdateProfessorInputType,
  ) {
    return this.professorService.updateProfessor(resourceActionRequest, dto);
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => ProfessorType)
  async deleteProfessor(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', DeleteProfessorInputZod)
    dto: DeleteProfessorInputType,
  ) {
    return this.professorService.deleteProfessor(resourceActionRequest, dto);
  }
  // END: mutations

  // START: fields resolvers

  /*
  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('field', () => GraphQLJSON)
  async field(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() professor: ProfessorType,
  ): Promise<ProfessorType['field']> {
    return this.professorService.getProfessorField(resourceActionRequest, professor.id);
  }
  */

  /*
  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('relation', () => GraphQLJSON)
  async relation(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() professor: ProfessorType,
  ): Promise<ProfessorType['relation']> {
    return this.professorService.getProfessorRelation(resourceActionRequest, professor.id);
  }
  */

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('name', () => String)
  async name(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() professor: ProfessorType,
  ): Promise<ProfessorType['name']> {
    return this.professorService.getProfessorName(
      resourceActionRequest,
      professor.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('codSuap', () => String)
  async codSuap(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() professor: ProfessorType,
  ): Promise<ProfessorType['codSuap']> {
    return this.professorService.getProfessorCodSuap(
      resourceActionRequest,
      professor.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('disciplinas', () => [DisciplinaType])
  async disciplinas(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() professor: ProfessorType,
  ): Promise<ProfessorType['disciplinas']> {
    return this.professorService.getProfessorDisciplinas(
      resourceActionRequest,
      professor.id,
    );
  }

  // END: fields resolvers
}
