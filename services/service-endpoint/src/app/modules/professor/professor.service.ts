import {
  AppAction,
  AppSubject,
  Disciplina,
  ICreateProfessorInput,
  IDeleteProfessorInput,
  IFindProfessorByIdInput,
  IUpdateProfessorInput,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';
import { IDisciplinaRepository } from 'src/app/repositories/disciplina.repository';
import { IProfessorRepository } from 'src/app/repositories/professor.repository';
import { FindOneOptions } from 'typeorm';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import {
  REPOSITORY_DISCIPLINA,
  REPOSITORY_PROFESSOR,
} from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { ProfessorDbEntity } from '../../entities/professor.db.entity';

@Injectable()
export class ProfessorService {
  constructor(
    @Inject(REPOSITORY_DISCIPLINA)
    private disciplinaRepository: IDisciplinaRepository,

    @Inject(REPOSITORY_PROFESSOR)
    private professorRepository: IProfessorRepository,
  ) {}

  async findProfessorById(
    resourceActionRequest: ResourceActionRequest,
    dto: IFindProfessorByIdInput,
    options: FindOneOptions<ProfessorDbEntity> | null = null,
  ) {
    const { id } = dto;

    const targetProfessor = await this.professorRepository.findOne({
      where: { id },
      select: ['id'],
    });

    if (!targetProfessor) {
      throw new NotFoundException();
    }

    const professor = await this.professorRepository.findOneOrFail({
      where: { id: targetProfessor.id },
      select: ['id'],
      ...options,
    });

    return resourceActionRequest.readResource(AppSubject.PROFESSOR, professor);
  }

  async findProfessorByIdSimple(
    resourceActionRequest: ResourceActionRequest,
    professorId: string,
  ): Promise<Pick<ProfessorDbEntity, 'id'>> {
    const professor = await this.findProfessorById(resourceActionRequest, {
      id: professorId,
    });

    return professor as Pick<ProfessorDbEntity, 'id'>;
  }

  async getProfessorGenericField<K extends keyof ProfessorDbEntity>(
    resourceActionRequest: ResourceActionRequest,
    professorId: string,
    field: K,
  ): Promise<ProfessorDbEntity[K]> {
    const professor = await this.findProfessorById(
      resourceActionRequest,
      { id: professorId },
      { select: ['id', field] },
    );

    resourceActionRequest.ensurePermission(
      AppAction.READ,
      subject(AppSubject.PROFESSOR, professor),
      field,
    );

    return <ProfessorDbEntity[K]>professor[field];
  }

  /*
  async getProfessorField(
    resourceActionRequest: ResourceActionRequest,
    professorId: string,
  ): Promise<ProfessorDbEntity['field']> {
    return this.getProfessorGenericField(resourceActionRequest, professorId, 'field');
  }
  */

  /*
  async getProfessorRelation(
    resourceActionRequest: ResourceActionRequest,
    professorId: string,
  ): Promise<unknown> {
    const professor = await this.findProfessorByIdSimple(
      resourceActionRequest,
      professorId,
    );

    const relationQuery = this.relationRepository
      .createQueryBuilder('relation')
      .innerJoin('relation.relation_professor', 'relation_professor')
      .select(['relation.id'])
      .where('relation_professor.id_professor_fk = :id', { id: professor.id });

    // const result = await relationQuery.getOne(); 
    // const result = await relationQuery.getMany(); 
    const result = null;

    return result;
  }
  */

  async getProfessorName(
    resourceActionRequest: ResourceActionRequest,
    professorId: string,
  ): Promise<ProfessorDbEntity['name']> {
    return this.getProfessorGenericField(
      resourceActionRequest,
      professorId,
      'name',
    );
  }

  async getProfessorCodSuap(
    resourceActionRequest: ResourceActionRequest,
    professorId: string,
  ): Promise<ProfessorDbEntity['codSuap']> {
    return this.getProfessorGenericField(
      resourceActionRequest,
      professorId,
      'codSuap',
    );
  }

  async getProfessorDisciplinas(
    resourceActionRequest: ResourceActionRequest,
    professorId: string,
  ): Promise<Disciplina[]> {
    const professor = await this.findProfessorByIdSimple(
      resourceActionRequest,
      professorId,
    );

    const disciplinaQuery = this.disciplinaRepository
      .createQueryBuilder('disciplina')
      .innerJoin('disciplina.disciplinaProfessor', 'disciplina_professor')
      .innerJoin('disciplina_professor.professor', 'professor')
      .select(['disciplina.id'])
      .where('professor.id_professor = :id', { id: professor.id });

    const result = await disciplinaQuery.getMany();

    return result;
  }

  async createProfessor(
    resourceActionRequest: ResourceActionRequest,
    dto: ICreateProfessorInput,
  ) {
    const fieldsData = omit(dto, []);

    const professor = resourceActionRequest.updateResource(
      AppSubject.PROFESSOR,
      <ProfessorDbEntity>{},
      fieldsData,
      AppAction.CREATE,
    );

    ProfessorDbEntity.setupInitialIds(professor);

    resourceActionRequest.ensurePermission(
      AppAction.CREATE,
      subject(AppSubject.PROFESSOR, professor),
    );

    await this.professorRepository.save(professor);

    return this.findProfessorByIdSimple(resourceActionRequest, professor.id);
  }

  async updateProfessor(
    resourceActionRequest: ResourceActionRequest,
    dto: IUpdateProfessorInput,
  ) {
    const { id } = dto;

    const professor = await this.findProfessorByIdSimple(
      resourceActionRequest,
      id,
    );

    const fieldsData = omit(dto, ['id']);

    const updatedProfessor = resourceActionRequest.updateResource(
      AppSubject.PROFESSOR,
      <ProfessorDbEntity>professor,
      fieldsData,
    );

    resourceActionRequest.ensurePermission(
      AppAction.UPDATE,
      subject(AppSubject.PROFESSOR, professor),
    );

    await this.professorRepository.save(updatedProfessor);

    return this.findProfessorByIdSimple(resourceActionRequest, professor.id);
  }

  async deleteProfessor(
    resourceActionRequest: ResourceActionRequest,
    dto: IDeleteProfessorInput,
  ) {
    const professor = await this.findProfessorByIdSimple(
      resourceActionRequest,
      dto.id,
    );

    resourceActionRequest.ensurePermission(
      AppAction.DELETE,
      subject(AppSubject.PROFESSOR, professor),
    );

    await this.professorRepository.delete(professor.id);

    return true;
  }
}
