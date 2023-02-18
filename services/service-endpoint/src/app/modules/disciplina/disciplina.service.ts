import {
  AppAction,
  AppSubject,
  ICreateDisciplinaInput,
  IDeleteDisciplinaInput,
  IFindDisciplinaByIdInput,
  IUpdateDisciplinaInput,
  Professor,
  Tarefa,
  Turma,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { TurmaDbEntity } from 'src/app/entities/turma.db.entity';
import { IDisciplinaRepository } from 'src/app/repositories/disciplina.repository';
import { IProfessorRepository } from 'src/app/repositories/professor.repository';
import { ITarefaRepository } from 'src/app/repositories/tarefa.repository';
import { ITurmaRepository } from 'src/app/repositories/turma.repository';
import { FindOneOptions } from 'typeorm';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import {
  REPOSITORY_DISCIPLINA,
  REPOSITORY_PROFESSOR,
  REPOSITORY_TAREFA,
  REPOSITORY_TURMA,
} from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { DisciplinaDbEntity } from '../../entities/disciplina.db.entity';
import { TurmaService } from '../turma/turma.service';

@Injectable()
export class DisciplinaService {
  constructor(
    private turmaService: TurmaService,

    @Inject(REPOSITORY_DISCIPLINA)
    private disciplinaRepository: IDisciplinaRepository,

    @Inject(REPOSITORY_TURMA)
    private turmaRepository: ITurmaRepository,

    @Inject(REPOSITORY_TAREFA)
    private tarefaRepository: ITarefaRepository,

    @Inject(REPOSITORY_PROFESSOR)
    private professorRepository: IProfessorRepository,
  ) {}

  async findDisciplinaById(
    resourceActionRequest: ResourceActionRequest,
    dto: IFindDisciplinaByIdInput,
    options: FindOneOptions<DisciplinaDbEntity> | null = null,
  ) {
    const { id } = dto;

    const targetDisciplina = await this.disciplinaRepository.findOne({
      where: { id },
      select: ['id'],
    });

    if (!targetDisciplina) {
      throw new NotFoundException();
    }

    const disciplina = await this.disciplinaRepository.findOneOrFail({
      where: { id: targetDisciplina.id },
      select: ['id'],
      ...options,
    });

    return resourceActionRequest.readResource(
      AppSubject.DISCIPLINA,
      disciplina,
    );
  }

  async findDisciplinaByIdSimple(
    resourceActionRequest: ResourceActionRequest,
    disciplinaId: string,
  ): Promise<Pick<DisciplinaDbEntity, 'id'>> {
    const disciplina = await this.findDisciplinaById(resourceActionRequest, {
      id: disciplinaId,
    });

    return disciplina as Pick<DisciplinaDbEntity, 'id'>;
  }

  async getDisciplinaGenericField<K extends keyof DisciplinaDbEntity>(
    resourceActionRequest: ResourceActionRequest,
    disciplinaId: string,
    field: K,
  ): Promise<DisciplinaDbEntity[K]> {
    const disciplina = await this.findDisciplinaById(
      resourceActionRequest,
      { id: disciplinaId },
      { select: ['id', field] },
    );

    resourceActionRequest.ensurePermission(
      AppAction.READ,
      subject(AppSubject.DISCIPLINA, disciplina),
      field,
    );

    return <DisciplinaDbEntity[K]>disciplina[field];
  }

  /*
  async getDisciplinaField(
    resourceActionRequest: ResourceActionRequest,
    disciplinaId: string,
  ): Promise<DisciplinaDbEntity['field']> {
    return this.getDisciplinaGenericField(resourceActionRequest, disciplinaId, 'field');
  }
  */

  /*
  async getDisciplinaRelation(
    resourceActionRequest: ResourceActionRequest,
    disciplinaId: string,
  ): Promise<unknown> {
    const disciplina = await this.findDisciplinaByIdSimple(
      resourceActionRequest,
      disciplinaId,
    );

    const relationQuery = this.relationRepository
      .createQueryBuilder('relation')
      .innerJoin('relation.relation_disciplina', 'relation_disciplina')
      .select(['relation.id'])
      .where('relation_disciplina.id_disciplina_fk = :id', { id: disciplina.id });

    // const result = await relationQuery.getOne(); 
    // const result = await relationQuery.getMany(); 
    const result = null;

    return result;
  }
  */

  async getDisciplinaName(
    resourceActionRequest: ResourceActionRequest,
    disciplinaId: string,
  ): Promise<DisciplinaDbEntity['name']> {
    return this.getDisciplinaGenericField(
      resourceActionRequest,
      disciplinaId,
      'name',
    );
  }

  async getDisciplinaTurma(
    resourceActionRequest: ResourceActionRequest,
    disciplinaId: string,
  ): Promise<Turma> {
    const disciplina = await this.findDisciplinaByIdSimple(
      resourceActionRequest,
      disciplinaId,
    );

    const relationQuery = this.turmaRepository
      .createQueryBuilder('turma')
      .innerJoin('turma.disciplinas', 'disciplina')
      .select(['turma.id'])
      .where('disciplina.id_disciplina = :id', { id: disciplina.id });

    const result = await relationQuery.getOne();

    if (!result) {
      throw new InternalServerErrorException();
    }

    return result;
  }

  async getDisciplinaTarefas(
    resourceActionRequest: ResourceActionRequest,
    disciplinaId: string,
  ): Promise<Tarefa[]> {
    const disciplina = await this.findDisciplinaByIdSimple(
      resourceActionRequest,
      disciplinaId,
    );

    const tarefaQuery = this.tarefaRepository
      .createQueryBuilder('tarefa')
      .innerJoin('tarefa.disciplina', 'disciplina')
      .select(['tarefa.id'])
      .where('disciplina.id_disciplina = :id', { id: disciplina.id });

    const result = await tarefaQuery.getMany();

    return result;
  }

  async getDisciplinaProfessores(
    resourceActionRequest: ResourceActionRequest,
    disciplinaId: string,
  ): Promise<Professor[]> {
    const disciplina = await this.findDisciplinaByIdSimple(
      resourceActionRequest,
      disciplinaId,
    );

    const professorQuery = this.professorRepository
      .createQueryBuilder('professor')
      .innerJoin('professor.disciplina_professor', 'disciplina_professor')
      .innerJoin('disciplina_professor.disciplina', 'disciplina')
      .select(['professor.id'])
      .where('disciplina.id_disciplina = :id', { id: disciplina.id });

    const result = await professorQuery.getMany();

    return result;
  }

  async getDisciplinaCodSuap(
    resourceActionRequest: ResourceActionRequest,
    disciplinaId: string,
  ): Promise<DisciplinaDbEntity['codSuap']> {
    return this.getDisciplinaGenericField(
      resourceActionRequest,
      disciplinaId,
      'codSuap',
    );
  }

  async createDisciplina(
    resourceActionRequest: ResourceActionRequest,
    dto: ICreateDisciplinaInput,
  ) {
    const turma = await this.turmaService.findTurmaByIdSimple(
      resourceActionRequest,
      dto.turmaId,
    );

    const fieldsData = omit(dto, ['turmaId']);

    const disciplina = resourceActionRequest.updateResource(
      AppSubject.DISCIPLINA,
      <DisciplinaDbEntity>{},
      fieldsData,
      AppAction.CREATE,
    );

    DisciplinaDbEntity.setupInitialIds(disciplina);

    disciplina.turma = <TurmaDbEntity>{ id: turma.id };

    resourceActionRequest.ensurePermission(
      AppAction.CREATE,
      subject(AppSubject.DISCIPLINA, disciplina),
    );

    await this.disciplinaRepository.save(disciplina);

    return this.findDisciplinaByIdSimple(resourceActionRequest, disciplina.id);
  }

  async updateDisciplina(
    resourceActionRequest: ResourceActionRequest,
    dto: IUpdateDisciplinaInput,
  ) {
    const { id } = dto;

    const disciplina = await this.findDisciplinaByIdSimple(
      resourceActionRequest,
      id,
    );

    const fieldsData = omit(dto, ['id']);

    const updatedDisciplina = resourceActionRequest.updateResource(
      AppSubject.DISCIPLINA,
      <DisciplinaDbEntity>disciplina,
      fieldsData,
    );

    resourceActionRequest.ensurePermission(
      AppAction.UPDATE,
      subject(AppSubject.DISCIPLINA, disciplina),
    );

    await this.disciplinaRepository.save(updatedDisciplina);

    return this.findDisciplinaByIdSimple(resourceActionRequest, disciplina.id);
  }

  async deleteDisciplina(
    resourceActionRequest: ResourceActionRequest,
    dto: IDeleteDisciplinaInput,
  ) {
    const disciplina = await this.findDisciplinaByIdSimple(
      resourceActionRequest,
      dto.id,
    );

    resourceActionRequest.ensurePermission(
      AppAction.DELETE,
      subject(AppSubject.DISCIPLINA, disciplina),
    );

    await this.disciplinaRepository.delete(disciplina.id);

    return true;
  }
}
