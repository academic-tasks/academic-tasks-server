import {
  AppAction,
  AppSubject,
  Lista,
  ICreateListaInput,
  IDeleteListaInput,
  IFindListaByIdInput,
  IUpdateListaInput,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { omit, pick } from 'lodash';
import { parralel } from 'src/app/helpers';
import { IListaRepository } from 'src/app/repositories/lista.repository';
import { FindOneOptions } from 'typeorm';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import {
  REPOSITORY_LISTA,
} from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { ListaDbEntity } from '../../entities/lista.db.entity';

@Injectable()
export class ListaService {
  constructor(
    @Inject(REPOSITORY_LISTA)
    private listaRepository: IListaRepository,
  ) {}

  async findListaById(
    resourceActionRequest: ResourceActionRequest,
    dto: IFindListaByIdInput,
    options: FindOneOptions<ListaDbEntity> | null = null,
  ) {
    const { id } = dto;

    const targetLista = await this.listaRepository.findOne({
      where: { id },
      select: ['id'],
    });

    if (!targetLista) {
      throw new NotFoundException();
    }

    const lista = await this.listaRepository.findOneOrFail({
      where: { id: targetLista.id },
      select: ['id'],
      ...options,
    });

    return resourceActionRequest.readResource(AppSubject.LISTA, lista);
  }

  async findListaByIdSimple(
    resourceActionRequest: ResourceActionRequest,
    listaId: string,
  ): Promise<Pick<ListaDbEntity, 'id'>> {
    const lista = await this.findListaById(resourceActionRequest, {
      id: listaId,
    });

    return lista as Pick<ListaDbEntity, 'id'>;
  }

  async getListaGenericField<K extends keyof ListaDbEntity>(
    resourceActionRequest: ResourceActionRequest,
    listaId: string,
    field: K,
  ): Promise<ListaDbEntity[K]> {
    const lista = await this.findListaById(
      resourceActionRequest,
      { id: listaId },
      { select: ['id', field] },
    );

    resourceActionRequest.ensurePermission(
      AppAction.READ,
      subject(AppSubject.LISTA, lista),
      field,
    );

    return <ListaDbEntity[K]>lista[field];
  }

  /*
  async getListaField(
    resourceActionRequest: ResourceActionRequest,
    listaId: string,
  ): Promise<ListaDbEntity['field']> {
    return this.getListaGenericField(resourceActionRequest, listaId, 'field');
  }
  */

  /*
  async getListaRelation(
    resourceActionRequest: ResourceActionRequest,
    listaId: string,
  ): Promise<unknown> {
    const lista = await this.findListaByIdSimple(
      resourceActionRequest,
      listaId,
    );

    const relationQuery = this.relationRepository
      .createQueryBuilder('relation')
      .innerJoin('relation.relation_lista', 'relation_lista')
      .select(['relation.id'])
      .where('relation_lista.id_lista_fk = :id', { id: lista.id });

    // const result = await relationQuery.getOne(); 
    // const result = await relationQuery.getMany(); 
    const result = null;

    return result;
  }
  */

  async createLista(
    resourceActionRequest: ResourceActionRequest,
    dto: ICreateListaInput,
  ) {
    const fieldsData = pick(dto, []);

    const lista = resourceActionRequest.updateResource(
      AppSubject.LISTA,
      <ListaDbEntity>{},
      fieldsData,
      AppAction.CREATE,
    );

    ListaDbEntity.setupInitialIds(lista);

    resourceActionRequest.ensurePermission(
      AppAction.CREATE,
      subject(AppSubject.LISTA, lista),
    );

    await this.listaRepository.save(lista);

    return this.findListaByIdSimple(resourceActionRequest, lista.id);
  }

  async updateLista(
    resourceActionRequest: ResourceActionRequest,
    dto: IUpdateListaInput,
  ) {
    const { id } = dto;

    const lista = await this.findListaByIdSimple(resourceActionRequest, id);

    const fieldsData = omit(dto, ['id']);

    const updatedLista = resourceActionRequest.updateResource(
      AppSubject.LISTA,
      <ListaDbEntity>lista,
      fieldsData,
    );

    resourceActionRequest.ensurePermission(
      AppAction.UPDATE,
      subject(AppSubject.LISTA, lista),
    );

    await this.listaRepository.save(updatedLista);

    return this.findListaByIdSimple(resourceActionRequest, lista.id);
  }

  async deleteLista(
    resourceActionRequest: ResourceActionRequest,
    dto: IDeleteListaInput,
  ) {
    const lista = await this.findListaByIdSimple(resourceActionRequest, dto.id);

    resourceActionRequest.ensurePermission(
      AppAction.DELETE,
      subject(AppSubject.LISTA, lista),
    );

    await this.listaRepository.delete(lista.id);

    return true;
  }
}
