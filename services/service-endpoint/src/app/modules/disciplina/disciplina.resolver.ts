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
import { AuthMode } from '../../../infrastructure/auth/consts/AuthMode';
import { BindResourceActionRequest } from '../../../infrastructure/auth/decorators/BindResourceActionRequest.decorator';
import { ResourceAuth } from '../../../infrastructure/auth/decorators/ResourceAuth.decorator';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import { ValidatedArgs } from '../../../infrastructure/graphql/ValidatedArgs.decorator';
import { ProfessorType } from '../professor/professor.type';
import { TarefaType } from '../tarefa/tarefa.type';
import { TurmaType } from '../turma/turma.type';
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
    return this.disciplinaService.findDisciplinaById(
      resourceActionRequest,
      dto,
    );
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

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('name', () => String)
  async name(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() disciplina: DisciplinaType,
  ): Promise<DisciplinaType['name']> {
    return this.disciplinaService.getDisciplinaName(
      resourceActionRequest,
      disciplina.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('codSuap', () => String)
  async codSuap(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() disciplina: DisciplinaType,
  ): Promise<DisciplinaType['codSuap']> {
    return this.disciplinaService.getDisciplinaCodSuap(
      resourceActionRequest,
      disciplina.id,
    );
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('turma', () => TurmaType)
  async turma(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() disciplina: DisciplinaType,
  ): Promise<TurmaType> {
    const turma = await this.disciplinaService.getDisciplinaTurma(
      resourceActionRequest,
      disciplina.id,
    );

    return turma as TurmaType;
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('tarefas', () => [TarefaType])
  async tarefas(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() disciplina: DisciplinaType,
  ): Promise<TarefaType[]> {
    const tarefas = await this.disciplinaService.getDisciplinaTarefas(
      resourceActionRequest,
      disciplina.id,
    );

    return tarefas as TarefaType[];
  }

  @ResourceAuth(AuthMode.OPTIONAL)
  @ResolveField('professores', () => [ProfessorType])
  async professores(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
    @Parent() disciplina: DisciplinaType,
  ): Promise<ProfessorType[]> {
    const professores = await this.disciplinaService.getDisciplinaProfessores(
      resourceActionRequest,
      disciplina.id,
    );

    return professores as ProfessorType[];
  }

  // END: fields resolvers
}
