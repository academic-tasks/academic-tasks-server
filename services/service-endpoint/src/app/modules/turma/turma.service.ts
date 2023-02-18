import {
  AppAction,
  AppSubject,
  Curso,
  Disciplina,
  ICreateTurmaInput,
  IDeleteTurmaInput,
  IFindTurmaByIdInput,
  IUpdateTurmaInput,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { omit, pick } from 'lodash';
import { ICursoRepository } from 'src/app/repositories/curso.repository';
import { IDisciplinaRepository } from 'src/app/repositories/disciplina.repository';
import { ITurmaRepository } from 'src/app/repositories/turma.repository';
import { FindOneOptions } from 'typeorm';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import {
  REPOSITORY_CURSO,
  REPOSITORY_DISCIPLINA,
  REPOSITORY_TURMA,
} from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { TurmaDbEntity } from '../../entities/turma.db.entity';

@Injectable()
export class TurmaService {
  constructor(
    @Inject(REPOSITORY_TURMA)
    private turmaRepository: ITurmaRepository,

    //

    @Inject(REPOSITORY_CURSO)
    private cursoRepository: ICursoRepository,

    @Inject(REPOSITORY_DISCIPLINA)
    private disciplinaRepository: IDisciplinaRepository,
  ) {}

  async findTurmaById(
    resourceActionRequest: ResourceActionRequest,
    dto: IFindTurmaByIdInput,
    options: FindOneOptions<TurmaDbEntity> | null = null,
  ) {
    const { id } = dto;

    const targetTurma = await this.turmaRepository.findOne({
      where: { id },
      select: ['id'],
    });

    if (!targetTurma) {
      throw new NotFoundException();
    }

    const turma = await this.turmaRepository.findOneOrFail({
      where: { id: targetTurma.id },
      select: ['id'],
      ...options,
    });

    return resourceActionRequest.readResource(AppSubject.TURMA, turma);
  }

  async findTurmaByIdSimple(
    resourceActionRequest: ResourceActionRequest,
    turmaId: string,
  ): Promise<Pick<TurmaDbEntity, 'id'>> {
    const turma = await this.findTurmaById(resourceActionRequest, {
      id: turmaId,
    });

    return turma as Pick<TurmaDbEntity, 'id'>;
  }

  async getTurmaGenericField<K extends keyof TurmaDbEntity>(
    resourceActionRequest: ResourceActionRequest,
    turmaId: string,
    field: K,
  ): Promise<TurmaDbEntity[K]> {
    const turma = await this.findTurmaById(
      resourceActionRequest,
      { id: turmaId },
      { select: ['id', field] },
    );

    resourceActionRequest.ensurePermission(
      AppAction.READ,
      subject(AppSubject.TURMA, turma),
      field,
    );

    return <TurmaDbEntity[K]>turma[field];
  }

  /*
  async getTurmaField(
    resourceActionRequest: ResourceActionRequest,
    turmaId: string,
  ): Promise<TurmaDbEntity['field']> {
    return this.getTurmaGenericField(resourceActionRequest, turmaId, 'field');
  }
  */

  /*
  async getTurmaRelation(
    resourceActionRequest: ResourceActionRequest,
    turmaId: string,
  ): Promise<unknown> {
    const turma = await this.findTurmaByIdSimple(
      resourceActionRequest,
      turmaId,
    );

    const relationQuery = this.relationRepository
      .createQueryBuilder('relation')
      .innerJoin('relation.relation_turma', 'relation_turma')
      .select(['relation.id'])
      .where('relation_turma.id_turma_fk = :id', { id: turma.id });

    // const result = await relationQuery.getOne(); 
    // const result = await relationQuery.getMany(); 
    const result = null;

    return result;
  }
  */

  async getTurmaName(
    resourceActionRequest: ResourceActionRequest,
    turmaId: string,
  ): Promise<TurmaDbEntity['name']> {
    return this.getTurmaGenericField(resourceActionRequest, turmaId, 'name');
  }

  async getTurmaYear(
    resourceActionRequest: ResourceActionRequest,
    turmaId: string,
  ): Promise<TurmaDbEntity['year']> {
    return this.getTurmaGenericField(resourceActionRequest, turmaId, 'year');
  }

  async getTurmaSerie(
    resourceActionRequest: ResourceActionRequest,
    turmaId: string,
  ): Promise<TurmaDbEntity['serie']> {
    return this.getTurmaGenericField(resourceActionRequest, turmaId, 'serie');
  }

  async getTurmaTurno(
    resourceActionRequest: ResourceActionRequest,
    turmaId: string,
  ): Promise<TurmaDbEntity['turno']> {
    return this.getTurmaGenericField(resourceActionRequest, turmaId, 'turno');
  }

  async getTurmaCurso(
    resourceActionRequest: ResourceActionRequest,
    turmaId: string,
  ): Promise<Curso> {
    const turma = await this.findTurmaByIdSimple(
      resourceActionRequest,
      turmaId,
    );

    const cursoQuery = this.cursoRepository
      .createQueryBuilder('curso')
      .innerJoin('curso.turmas', 'turma')
      .select(['curso.id'])
      .where('turma.id_turma = :id', { id: turma.id });

    const result = await cursoQuery.getOne();

    if (!result) {
      throw new InternalServerErrorException();
    }

    return result;
  }

  async getTurmaDisciplinas(
    resourceActionRequest: ResourceActionRequest,
    turmaId: string,
  ): Promise<Disciplina[]> {
    const turma = await this.findTurmaByIdSimple(
      resourceActionRequest,
      turmaId,
    );

    const disciplinaQuery = this.disciplinaRepository
      .createQueryBuilder('disciplina')
      .innerJoin('disciplina.turma', 'turma')
      .select(['disciplina.id'])
      .where('turma.id_turma = :id', { id: turma.id });

    const result = await disciplinaQuery.getMany();

    return result;
  }

  async createTurma(
    resourceActionRequest: ResourceActionRequest,
    dto: ICreateTurmaInput,
  ) {
    const fieldsData = pick(dto, []);

    const turma = resourceActionRequest.updateResource(
      AppSubject.TURMA,
      <TurmaDbEntity>{},
      fieldsData,
      AppAction.CREATE,
    );

    TurmaDbEntity.setupInitialIds(turma);

    resourceActionRequest.ensurePermission(
      AppAction.CREATE,
      subject(AppSubject.TURMA, turma),
    );

    await this.turmaRepository.save(turma);

    return this.findTurmaByIdSimple(resourceActionRequest, turma.id);
  }

  async updateTurma(
    resourceActionRequest: ResourceActionRequest,
    dto: IUpdateTurmaInput,
  ) {
    const { id } = dto;

    const turma = await this.findTurmaByIdSimple(resourceActionRequest, id);

    const fieldsData = omit(dto, ['id']);

    const updatedTurma = resourceActionRequest.updateResource(
      AppSubject.TURMA,
      <TurmaDbEntity>turma,
      fieldsData,
    );

    resourceActionRequest.ensurePermission(
      AppAction.UPDATE,
      subject(AppSubject.TURMA, turma),
    );

    await this.turmaRepository.save(updatedTurma);

    return this.findTurmaByIdSimple(resourceActionRequest, turma.id);
  }

  async deleteTurma(
    resourceActionRequest: ResourceActionRequest,
    dto: IDeleteTurmaInput,
  ) {
    const turma = await this.findTurmaByIdSimple(resourceActionRequest, dto.id);

    resourceActionRequest.ensurePermission(
      AppAction.DELETE,
      subject(AppSubject.TURMA, turma),
    );

    await this.turmaRepository.delete(turma.id);

    return true;
  }
}
