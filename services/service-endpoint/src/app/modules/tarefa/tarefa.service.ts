import {
  Disciplina,
  ICreateTarefaInput,
  IDeleteTarefaInput,
  IFindTarefaByIdInput,
  IUpdateTarefaInput,
  Lista,
  ListaAction,
  ListaSubject,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { DisciplinaDbEntity } from 'src/app/entities/disciplina.db.entity';
import { ListaDbEntity } from 'src/app/entities/lista.db.entity';
import { IDisciplinaRepository } from 'src/app/repositories/disciplina.repository';
import { IListaRepository } from 'src/app/repositories/lista.repository';
import { ITarefaRepository } from 'src/app/repositories/tarefa.repository';
import { ListaResourceActionRequest } from 'src/infrastructure/auth-lista/ListaResourceActionRequest';
import { FindOneOptions } from 'typeorm';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import {
  REPOSITORY_DISCIPLINA,
  REPOSITORY_LISTA,
  REPOSITORY_TAREFA,
} from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { TarefaDbEntity } from '../../entities/tarefa.db.entity';
import { DisciplinaService } from '../disciplina/disciplina.service';
import { ListaService } from '../lista/lista.service';

@Injectable()
export class TarefaService {
  constructor(
    private listaService: ListaService,
    private disciplinaService: DisciplinaService,

    @Inject(REPOSITORY_TAREFA)
    private tarefaRepository: ITarefaRepository,

    @Inject(REPOSITORY_LISTA)
    private listaRepository: IListaRepository,

    @Inject(REPOSITORY_DISCIPLINA)
    private disciplinaRepository: IDisciplinaRepository,
  ) {}

  async findTarefaById(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
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

    return listaResourceActionRequest.readResource(ListaSubject.TAREFA, tarefa);
  }

  async findTarefaByIdSimple(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,

    tarefaId: string,
  ): Promise<Pick<TarefaDbEntity, 'id'>> {
    const tarefa = await this.findTarefaById(
      resourceActionRequest,
      listaResourceActionRequest,
      { id: tarefaId },
    );

    return tarefa as Pick<TarefaDbEntity, 'id'>;
  }

  async getTarefaGenericField<K extends keyof TarefaDbEntity>(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    tarefaId: string,
    field: K,
  ): Promise<TarefaDbEntity[K]> {
    const tarefa = await this.findTarefaById(
      resourceActionRequest,
      listaResourceActionRequest,
      { id: tarefaId },
      { select: ['id', field] },
    );

    listaResourceActionRequest.ensurePermission(
      ListaAction.READ,
      subject(ListaSubject.TAREFA, tarefa),
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

  async getTarefaTitle(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    tarefaId: string,
  ): Promise<TarefaDbEntity['title']> {
    return this.getTarefaGenericField(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefaId,
      'title',
    );
  }

  async getTarefaDescription(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    tarefaId: string,
  ): Promise<TarefaDbEntity['description']> {
    return this.getTarefaGenericField(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefaId,
      'description',
    );
  }

  async getTarefaDateOpen(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    tarefaId: string,
  ): Promise<TarefaDbEntity['dateOpen']> {
    return this.getTarefaGenericField(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefaId,
      'dateOpen',
    );
  }

  async getTarefaDateClose(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    tarefaId: string,
  ): Promise<TarefaDbEntity['dateClose']> {
    return this.getTarefaGenericField(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefaId,
      'dateClose',
    );
  }

  async getTarefaSubmissionFormat(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    tarefaId: string,
  ): Promise<TarefaDbEntity['submissionFormat']> {
    return this.getTarefaGenericField(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefaId,
      'submissionFormat',
    );
  }

  async getTarefaLista(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    tarefaId: string,
  ): Promise<Lista> {
    const tarefa = await this.findTarefaByIdSimple(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefaId,
    );

    const listaQuery = this.listaRepository
      .createQueryBuilder('lista')
      .innerJoin('lista.tarefas', 'tarefa')
      .select(['lista.id'])
      .where('tarefa.id_tarefa = :id', { id: tarefa.id });

    const result = await listaQuery.getOne();
    // const result = await relationQuery.getMany();

    if (!result) {
      throw new InternalServerErrorException();
    }

    return result;
  }

  async getTarefaDisciplina(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    tarefaId: string,
  ): Promise<Disciplina> {
    const tarefa = await this.findTarefaByIdSimple(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefaId,
    );

    const disciplinaQuery = this.disciplinaRepository
      .createQueryBuilder('disciplina')
      .innerJoin('disciplina.tarefas', 'tarefa')
      .select(['disciplina.id'])
      .where('tarefa.id_tarefa = :id', { id: tarefa.id });

    const result = await disciplinaQuery.getOne();

    if (!result) {
      throw new InternalServerErrorException();
    }

    return result;
  }

  async createTarefa(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    dto: ICreateTarefaInput,
  ) {
    const fieldsData = omit(dto, ['listaId', 'disciplinaId']);

    const lista = await this.listaService.findListaByIdSimple(
      resourceActionRequest,
      dto.listaId,
    );

    const disciplina = await this.disciplinaService.findDisciplinaByIdSimple(
      resourceActionRequest,
      dto.disciplinaId,
    );

    const tarefa = listaResourceActionRequest.updateResource(
      ListaSubject.TAREFA,
      <TarefaDbEntity>{},
      fieldsData,
      ListaAction.CREATE,
    );

    TarefaDbEntity.setupInitialIds(tarefa);

    tarefa.lista = <ListaDbEntity>{ id: lista.id };
    tarefa.disciplina = <DisciplinaDbEntity>{ id: disciplina.id };

    listaResourceActionRequest.ensurePermission(
      ListaAction.CREATE,
      subject(ListaSubject.TAREFA, tarefa),
    );

    await this.tarefaRepository.save(tarefa);

    return this.findTarefaByIdSimple(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefa.id,
    );
  }

  async updateTarefa(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    dto: IUpdateTarefaInput,
  ) {
    const { id } = dto;

    const tarefa = await this.findTarefaByIdSimple(
      resourceActionRequest,
      listaResourceActionRequest,
      id,
    );

    const fieldsData = omit(dto, ['id']);

    const updatedTarefa = listaResourceActionRequest.updateResource(
      ListaSubject.TAREFA,
      <TarefaDbEntity>tarefa,
      fieldsData,
    );

    listaResourceActionRequest.ensurePermission(
      ListaAction.UPDATE,
      subject(ListaSubject.TAREFA, tarefa),
    );

    await this.tarefaRepository.save(updatedTarefa);

    return this.findTarefaByIdSimple(
      resourceActionRequest,
      listaResourceActionRequest,
      tarefa.id,
    );
  }

  async deleteTarefa(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,

    dto: IDeleteTarefaInput,
  ) {
    const tarefa = await this.findTarefaByIdSimple(
      resourceActionRequest,
      listaResourceActionRequest,
      dto.id,
    );

    listaResourceActionRequest.ensurePermission(
      ListaAction.DELETE,
      subject(ListaSubject.TAREFA, tarefa),
    );

    await this.tarefaRepository.delete(tarefa.id);

    return true;
  }
}
