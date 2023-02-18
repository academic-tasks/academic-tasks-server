import {
  AppAction,
  AppSubject,
  Disciplina,
  ICreateDisciplinaInput,
  IDeleteDisciplinaInput,
  IFindDisciplinaByIdInput,
  IUpdateDisciplinaInput,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { omit, pick } from 'lodash';
import { parralel } from 'src/app/helpers';
import { IDisciplinaRepository } from 'src/app/repositories/disciplina.repository';
import { FindOneOptions } from 'typeorm';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import {
  REPOSITORY_DISCIPLINA,
} from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { DisciplinaDbEntity } from '../../entities/disciplina.db.entity';

@Injectable()
export class DisciplinaService {
  constructor(
    @Inject(REPOSITORY_DISCIPLINA)
    private disciplinaRepository: IDisciplinaRepository,
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

    return resourceActionRequest.readResource(AppSubject.DISCIPLINA, disciplina);
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

  async createDisciplina(
    resourceActionRequest: ResourceActionRequest,
    dto: ICreateDisciplinaInput,
  ) {
    const fieldsData = pick(dto, []);

    const disciplina = resourceActionRequest.updateResource(
      AppSubject.DISCIPLINA,
      <DisciplinaDbEntity>{},
      fieldsData,
      AppAction.CREATE,
    );

    DisciplinaDbEntity.setupInitialIds(disciplina);

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

    const disciplina = await this.findDisciplinaByIdSimple(resourceActionRequest, id);

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
    const disciplina = await this.findDisciplinaByIdSimple(resourceActionRequest, dto.id);

    resourceActionRequest.ensurePermission(
      AppAction.DELETE,
      subject(AppSubject.DISCIPLINA, disciplina),
    );

    await this.disciplinaRepository.delete(disciplina.id);

    return true;
  }
}
