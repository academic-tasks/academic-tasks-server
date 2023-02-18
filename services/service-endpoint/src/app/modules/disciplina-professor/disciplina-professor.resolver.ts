import {
  AddProfessorToDisciplinaInputZod,
  RemoveProfessorFromDisciplinaInputZod,
} from '@academic-tasks/schemas';
import { Mutation, Resolver } from '@nestjs/graphql';
import { AuthMode } from 'src/infrastructure/auth/consts/AuthMode';
import { BindResourceActionRequest } from 'src/infrastructure/auth/decorators/BindResourceActionRequest.decorator';
import { ResourceAuth } from 'src/infrastructure/auth/decorators/ResourceAuth.decorator';
import { ResourceActionRequest } from 'src/infrastructure/auth/ResourceActionRequest';
import { ValidatedArgs } from 'src/infrastructure/graphql/ValidatedArgs.decorator';
import { DisciplinaProfessorService } from './disciplina-professor.service';
import { DisciplinaProfessorType } from './disciplina-professor.type';
import {
  AddProfessorToDisciplinaInputType,
  RemoveProfessorFromDisciplinaInputType,
} from './dtos';

@Resolver(() => DisciplinaProfessorType)
export class DisciplinaProfessorResolver {
  constructor(private disciplinaProfessorService: DisciplinaProfessorService) {}

  // START: queries

  // END: queries

  // START: mutations

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => Boolean)
  async addProfessorToDisciplina(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', AddProfessorToDisciplinaInputZod)
    dto: AddProfessorToDisciplinaInputType,
  ) {
    return this.disciplinaProfessorService.addProfessorToDisciplina(
      resourceActionRequest,
      dto,
    );
  }

  @ResourceAuth(AuthMode.STRICT)
  @Mutation(() => Boolean)
  async removeProfessorFromDisciplina(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @ValidatedArgs('dto', RemoveProfessorFromDisciplinaInputZod)
    dto: RemoveProfessorFromDisciplinaInputType,
  ) {
    return this.disciplinaProfessorService.removeProfessorFromDisciplina(
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
    @Parent() disciplinaProfessor: DisciplinaProfessorType,
  ): Promise<DisciplinaProfessorType['field']> {
    return this.disciplinaProfessorService.getDisciplinaProfessorField(resourceActionRequest, disciplinaProfessor.id);
  }
  */

  /*
  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('relation', () => GraphQLJSON)
  async relation(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() disciplinaProfessor: DisciplinaProfessorType,
  ): Promise<DisciplinaProfessorType['relation']> {
    return this.disciplinaProfessorService.getDisciplinaProfessorRelation(resourceActionRequest, disciplinaProfessor.id);
  }
  */

  // END: fields resolvers
}
