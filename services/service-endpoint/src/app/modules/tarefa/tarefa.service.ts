import {
  AppAction,
  AppSubject,
  Tarefa,
  ICreateTarefaInput,
  IDeleteTarefaInput,
  IFindTarefaByIdInput,
  IUpdateTarefaInput,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { omit, pick } from 'lodash';
import { parralel } from 'src/app/helpers';
import { ITarefaRepository } from 'src/app/repositories/tarefa.repository';
import { FindOneOptions } from 'typeorm';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import {
  REPOSITORY_TAREFA,
} from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { TarefaDbEntity } from '../../entities/tarefa.db.entity';

@Injectable()
export class TarefaService {
  constructor(
    @Inject(REPOSITORY_TAREFA)
    private tarefaRepository: ITarefaRepository,
  ) {}

  async findTarefaById(
    resourceActionRequest: ResourceActionRequest,
    dto: IFindTarefaByIdInput,
    options: FindOneOptions<TarefaDbEntity> | null = null,
  ) {
    const { id } = dto;

    const targetTarefa = await this.tarefaRepository.findOne({
      where: { id },
      select: ['id'],
    });

    if (!targetTarefa) {
      throw new NotFoundException();
    }

    const tarefa = await this.tarefaRepository.findOneOrFail({
      where: { id: targetTarefa.id },
      select: ['id'],
      ...options,
    });

    return resourceActionRequest.readResource(AppSubject.TAREFA, tarefa);
  }

  async findTarefaByIdSimple(
    resourceActionRequest: ResourceActionRequest,
    tarefaId: string,
  ): Promise<Pick<TarefaDbEntity, 'id'>> {
    const tarefa = await this.findTarefaById(resourceActionRequest, {
      id: tarefaId,
    });

    return tarefa as Pick<TarefaDbEntity, 'id'>;
  }

  async getTarefaGenericField<K extends keyof TarefaDbEntity>(
    resourceActionRequest: ResourceActionRequest,
    tarefaId: string,
    field: K,
  ): Promise<TarefaDbEntity[K]> {
    const tarefa = await this.findTarefaById(
      resourceActionRequest,
      { id: tarefaId },
      { select: ['id', field] },
    );

    resourceActionRequest.ensurePermission(
      AppAction.READ,
      subject(AppSubject.TAREFA, tarefa),
      field,
    );

    return <TarefaDbEntity[K]>tarefa[field];
  }

  /*
  async getTarefaField(
    resourceActionRequest: ResourceActionRequest,
    tarefaId: string,
  ): Promise<TarefaDbEntity['field']> {
    return this.getTarefaGenericField(resourceActionRequest, tarefaId, 'field');
  }
  */

  /*
  async getTarefaRelation(
    resourceActionRequest: ResourceActionRequest,
    tarefaId: string,
  ): Promise<unknown> {
    const tarefa = await this.findTarefaByIdSimple(
      resourceActionRequest,
      tarefaId,
    );

    const relationQuery = this.relationRepository
      .createQueryBuilder('relation')
      .innerJoin('relation.relation_tarefa', 'relation_tarefa')
      .select(['relation.id'])
      .where('relation_tarefa.id_tarefa_fk = :id', { id: tarefa.id });

    // const result = await relationQuery.getOne(); 
    // const result = await relationQuery.getMany(); 
    const result = null;

    return result;
  }
  */

  async createTarefa(
    resourceActionRequest: ResourceActionRequest,
    dto: ICreateTarefaInput,
  ) {
    const fieldsData = pick(dto, []);

    const tarefa = resourceActionRequest.updateResource(
      AppSubject.TAREFA,
      <TarefaDbEntity>{},
      fieldsData,
      AppAction.CREATE,
    );

    TarefaDbEntity.setupInitialIds(tarefa);

    resourceActionRequest.ensurePermission(
      AppAction.CREATE,
      subject(AppSubject.TAREFA, tarefa),
    );

    await this.tarefaRepository.save(tarefa);

    return this.findTarefaByIdSimple(resourceActionRequest, tarefa.id);
  }

  async updateTarefa(
    resourceActionRequest: ResourceActionRequest,
    dto: IUpdateTarefaInput,
  ) {
    const { id } = dto;

    const tarefa = await this.findTarefaByIdSimple(resourceActionRequest, id);

    const fieldsData = omit(dto, ['id']);

    const updatedTarefa = resourceActionRequest.updateResource(
      AppSubject.TAREFA,
      <TarefaDbEntity>tarefa,
      fieldsData,
    );

    resourceActionRequest.ensurePermission(
      AppAction.UPDATE,
      subject(AppSubject.TAREFA, tarefa),
    );

    await this.tarefaRepository.save(updatedTarefa);

    return this.findTarefaByIdSimple(resourceActionRequest, tarefa.id);
  }

  async deleteTarefa(
    resourceActionRequest: ResourceActionRequest,
    dto: IDeleteTarefaInput,
  ) {
    const tarefa = await this.findTarefaByIdSimple(resourceActionRequest, dto.id);

    resourceActionRequest.ensurePermission(
      AppAction.DELETE,
      subject(AppSubject.TAREFA, tarefa),
    );

    await this.tarefaRepository.delete(tarefa.id);

    return true;
  }
}
