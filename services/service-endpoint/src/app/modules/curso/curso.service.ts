import {
  AppAction,
  AppSubject,
  ICreateCursoInput,
  IDeleteCursoInput,
  IFindCursoByIdInput,
  IUpdateCursoInput,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { omit, pick } from 'lodash';
import { FindOneOptions } from 'typeorm';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import { REPOSITORY_CURSO } from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { CursoDbEntity } from '../../entities/curso.db.entity';
import { ICursoRepository } from '../../repositories/curso.repository';
import { CursoType } from './curso.type';

@Injectable()
export class CursoService {
  constructor(
    @Inject(REPOSITORY_CURSO)
    private cursoRepository: ICursoRepository,
  ) {}

  async findCursoById(
    resourceActionRequest: ResourceActionRequest,
    dto: IFindCursoByIdInput,
    options: FindOneOptions<CursoDbEntity> | null = null,
  ) {
    const targetCurso = await this.cursoRepository.findOne({
      where: { id: dto.id },
      select: ['id'],
    });

    if (!targetCurso) {
      throw new NotFoundException();
    }

    const curso = await this.cursoRepository.findOneOrFail({
      where: { id: targetCurso.id },
      select: ['id'],
      ...options,
    });

    resourceActionRequest.ensurePermission(
      AppAction.READ,
      subject(AppSubject.CURSO, curso),
    );

    return resourceActionRequest.readResource(AppSubject.CURSO, curso);
  }

  async findCursoByIdSimple(
    resourceActionRequest: ResourceActionRequest,
    cursoId: string,
  ): Promise<Pick<CursoDbEntity, 'id'>> {
    const curso = await this.findCursoById(resourceActionRequest, {
      id: cursoId,
    });

    return curso as Pick<CursoDbEntity, 'id'>;
  }

  async getCursoGenericField<K extends keyof CursoDbEntity>(
    resourceActionRequest: ResourceActionRequest,
    cursoId: string,
    field: K,
  ): Promise<CursoDbEntity[K]> {
    const curso = await this.findCursoById(
      resourceActionRequest,
      { id: cursoId },
      { select: ['id', field] },
    );

    resourceActionRequest.ensurePermission(
      AppAction.READ,
      subject(AppSubject.CURSO, curso),
      field,
    );

    return <CursoDbEntity[K]>curso[field];
  }

  async getCursoName(
    resourceActionRequest: ResourceActionRequest,
    cursoId: string,
  ): Promise<CursoType['name']> {
    return this.getCursoGenericField(resourceActionRequest, cursoId, 'name');
  }

  async getCursoTurmas(
    resourceActionRequest: ResourceActionRequest,
    cursoId: string,
  ): Promise<CursoType['turmas']> {
    return [];
  }

  async createCurso(
    resourceActionRequest: ResourceActionRequest,
    dto: ICreateCursoInput,
  ) {
    const fieldsData = pick(dto, ['name']);

    const curso = resourceActionRequest.updateResource(
      'curso',
      <CursoDbEntity>{},
      fieldsData,
      AppAction.CREATE,
    );

    CursoDbEntity.setupInitialIds(curso);

    resourceActionRequest.ensurePermission(
      AppAction.CREATE,
      subject(AppSubject.CURSO, curso),
    );

    await this.cursoRepository.save(curso);

    return this.findCursoByIdSimple(resourceActionRequest, curso.id);
  }

  async updateCurso(
    resourceActionRequest: ResourceActionRequest,
    dto: IUpdateCursoInput,
  ) {
    const { id } = dto;

    const curso = await this.findCursoByIdSimple(resourceActionRequest, id);

    const fieldsData = omit(dto, ['id']);

    const updatedCurso = resourceActionRequest.updateResource(
      AppSubject.CURSO,
      <CursoDbEntity>curso,
      fieldsData,
    );

    resourceActionRequest.ensurePermission(
      AppAction.UPDATE,
      subject(AppSubject.CURSO, curso),
    );

    await this.cursoRepository.save(updatedCurso);

    return this.findCursoByIdSimple(resourceActionRequest, curso.id);
  }

  async deleteCurso(
    resourceActionRequest: ResourceActionRequest,
    dto: IDeleteCursoInput,
  ) {
    const { id } = dto;

    const curso = await this.findCursoByIdSimple(resourceActionRequest, id);

    resourceActionRequest.ensurePermission(
      AppAction.DELETE,
      subject(AppSubject.CURSO, curso),
    );

    await this.cursoRepository.delete(curso.id);

    return true;
  }
}
