import {
  AppAction,
  AppSubject,
  ICreateCursoInput,
  IDeleteCursoInput,
  IFindCursoByIdInput,
  IUpdateCursoInput,
  Turma,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';
import { ITurmaRepository } from 'src/app/repositories/turma.repository';
import { FindOneOptions } from 'typeorm';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import {
  REPOSITORY_CURSO,
  REPOSITORY_TURMA,
} from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { CursoDbEntity } from '../../entities/curso.db.entity';
import { ICursoRepository } from '../../repositories/curso.repository';
import { CursoType } from './curso.type';

@Injectable()
export class CursoService {
  constructor(
    @Inject(REPOSITORY_CURSO)
    private cursoRepository: ICursoRepository,

    @Inject(REPOSITORY_TURMA)
    private turmaRepository: ITurmaRepository,
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
  ): Promise<Turma[]> {
    const curso = await this.findCursoByIdSimple(
      resourceActionRequest,
      cursoId,
    );

    const turmaQuery = this.turmaRepository
      .createQueryBuilder('turma')
      .innerJoin('turma.curso', 'curso')
      .select(['turma.id'])
      .where('curso.id_curso = :id', { id: curso.id });

    const result = await turmaQuery.getMany();

    return result;
  }

  async createCurso(
    resourceActionRequest: ResourceActionRequest,
    dto: ICreateCursoInput,
  ) {
    const fieldsData = omit(dto, []);

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
