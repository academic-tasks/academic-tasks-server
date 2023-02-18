import { Resolver } from '@nestjs/graphql';
import { DisciplinaProfessorService } from './disciplina-professor.service';
import { DisciplinaProfessorType } from './disciplina-professor.type';

@Resolver(() => DisciplinaProfessorType)
export class DisciplinaProfessorResolver {
  constructor(private disciplinaProfessorService: DisciplinaProfessorService) {}

  // START: queries

  // END: queries

  // START: mutations

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
