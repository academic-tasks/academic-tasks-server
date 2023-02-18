import {
  AppSubject,
  ICreateListaInput,
  IDeleteListaInput,
  IFindListaByIdInput,
  IUpdateListaInput,
  ListaAction,
  ListaSubject,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { IListaMembroRepository } from 'src/app/repositories/lista-membro.repository';
import { IListaRepository } from 'src/app/repositories/lista.repository';
import { ListaResourceActionRequest } from 'src/infrastructure/auth-lista/ListaResourceActionRequest';
import { FindOneOptions } from 'typeorm';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import {
  REPOSITORY_LISTA,
  REPOSITORY_LISTA_MEMBRO,
} from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { ListaDbEntity } from '../../entities/lista.db.entity';
import { ListaMembroService } from '../lista-membro/lista-membro.service';

@Injectable()
export class ListaService {
  constructor(
    @Inject(forwardRef(() => ListaMembroService))
    private listaMembroService: ListaMembroService,

    @Inject(REPOSITORY_LISTA)
    private listaRepository: IListaRepository,

    @Inject(REPOSITORY_LISTA_MEMBRO)
    private listaMembroRepository: IListaMembroRepository,
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
    listaResourceActionRequest: ListaResourceActionRequest,
    listaId: string,
    field: K,
  ): Promise<ListaDbEntity[K]> {
    const lista = await this.findListaById(
      resourceActionRequest,
      { id: listaId },
      { select: ['id', field] },
    );

    listaResourceActionRequest.ensurePermission(
      ListaAction.READ,
      subject(ListaSubject.CURRENT_LISTA, lista),
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

  async getListaTitle(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    listaId: string,
  ): Promise<ListaDbEntity['title']> {
    return this.getListaGenericField(
      resourceActionRequest,
      listaResourceActionRequest,
      listaId,
      'title',
    );
  }

  async getListaListaMembros(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    listaId: string,
  ): Promise<ListaDbEntity['listaMembros']> {
    const lista = await this.findListaByIdSimple(
      resourceActionRequest,
      listaId,
    );

    listaResourceActionRequest.ensurePermission(
      ListaAction.READ,
      subject(ListaSubject.CURRENT_LISTA, lista),
      'listaMembros',
    );

    const listaMemboQuery = this.listaMembroRepository
      .createQueryBuilder('lista_membro')
      .innerJoin('lista_membro.lista', 'lista')
      .select(['lista_membro.id'])
      .where('lista.id_lista = :id', { id: lista.id });

    const result = await listaMemboQuery.getMany();

    return result;
  }

  async createLista(
    resourceActionRequest: ResourceActionRequest,
    dto: ICreateListaInput,
  ) {
    const fieldsData = omit(dto, []);

    const lista = resourceActionRequest.updateResource(
      AppSubject.LISTA,
      <ListaDbEntity>{},
      fieldsData,
      ListaAction.CREATE,
    );

    ListaDbEntity.setupInitialIds(lista);

    resourceActionRequest.ensurePermission(
      ListaAction.CREATE,
      subject(AppSubject.LISTA, lista),
    );

    await this.listaRepository.save(lista);

    const user = resourceActionRequest.user;

    if (user) {
      await this.listaMembroService.addMembroToLista(
        ResourceActionRequest.forSystemInternalActions(),
        ListaResourceActionRequest.forSystemInternalActions(),
        { listaId: lista.id, usuarioId: user.id },
      );
    }

    return this.findListaByIdSimple(resourceActionRequest, lista.id);
  }

  async updateLista(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    dto: IUpdateListaInput,
  ) {
    const { id } = dto;

    const lista = await this.findListaByIdSimple(resourceActionRequest, id);

    const fieldsData = omit(dto, ['id']);

    const updatedLista = listaResourceActionRequest.updateResource(
      ListaSubject.CURRENT_LISTA,
      <ListaDbEntity>lista,
      fieldsData,
    );

    listaResourceActionRequest.ensurePermission(
      ListaAction.UPDATE,
      subject(ListaSubject.CURRENT_LISTA, lista),
    );

    await this.listaRepository.save(updatedLista);

    return this.findListaByIdSimple(resourceActionRequest, lista.id);
  }

  async deleteLista(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    dto: IDeleteListaInput,
  ) {
    const lista = await this.findListaByIdSimple(resourceActionRequest, dto.id);

    listaResourceActionRequest.ensurePermission(
      ListaAction.DELETE,
      subject(ListaSubject.CURRENT_LISTA, lista),
    );

    await this.listaRepository.delete(lista.id);

    return true;
  }
}
