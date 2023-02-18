import {
  IAddMembroToListaInput,
  IFindListaMembroByIdInput,
  IRemoveMembroFromListaInput,
  Lista,
  ListaAction,
  ListaSubject,
  Usuario,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ListaMembroDbEntity } from 'src/app/entities/lista-membro.db.entity';
import { ListaDbEntity } from 'src/app/entities/lista.db.entity';
import { UsuarioDbEntity } from 'src/app/entities/usuario.db.entity';
import { IListaMembroRepository } from 'src/app/repositories/lista-membro.repository';
import { IListaRepository } from 'src/app/repositories/lista.repository';
import { IUsuarioRepository } from 'src/app/repositories/usuario.repository';
import { ListaResourceActionRequest } from 'src/infrastructure/auth-lista/ListaResourceActionRequest';
import { ResourceActionRequest } from 'src/infrastructure/auth/ResourceActionRequest';
import { FindOneOptions } from 'typeorm';
import {
  REPOSITORY_LISTA,
  REPOSITORY_LISTA_MEMBRO,
  REPOSITORY_USUARIO,
} from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { ListaService } from '../lista/lista.service';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class ListaMembroService {
  constructor(
    private listaService: ListaService,
    private usuarioService: UsuarioService,

    @Inject(REPOSITORY_LISTA)
    private listaRepository: IListaRepository,

    @Inject(REPOSITORY_LISTA_MEMBRO)
    private listaMembroRepository: IListaMembroRepository,

    @Inject(REPOSITORY_USUARIO)
    private usuarioRepository: IUsuarioRepository,
  ) {}

  async findListaMembroById(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    dto: IFindListaMembroByIdInput,
    options: FindOneOptions<ListaMembroDbEntity> | null = null,
  ) {
    const { id } = dto;

    const targetListaMembro = await this.listaMembroRepository.findOne({
      where: { id },
      select: ['id'],
    });

    if (!targetListaMembro) {
      throw new NotFoundException();
    }

    const listaMembro = await this.listaMembroRepository.findOneOrFail({
      where: { id: targetListaMembro.id },
      select: ['id'],
      ...options,
    });

    return listaResourceActionRequest.readResource(
      ListaSubject.MEMBRO,
      listaMembro,
    );
  }

  async findListaMembroByIdSimple(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    listaMembroId: string,
  ): Promise<Pick<ListaMembroDbEntity, 'id'>> {
    const listaMembro = await this.findListaMembroById(
      resourceActionRequest,
      listaResourceActionRequest,
      { id: listaMembroId },
    );

    return listaMembro as Pick<ListaMembroDbEntity, 'id'>;
  }

  async getListaMembroLista(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    listaMembroId: string,
  ): Promise<Lista> {
    const listaMembro = await this.findListaMembroByIdSimple(
      resourceActionRequest,
      listaResourceActionRequest,
      listaMembroId,
    );

    console.trace();

    console.log({ listaMembroId });

    const listaQuery = this.listaRepository
      .createQueryBuilder('lista')
      .innerJoin('lista.listaMembro', 'lista_membro')
      .select(['lista.id'])
      .where('lista_membro.id_lista_membro = :id', { id: listaMembro.id });

    const result = await listaQuery.getOne();

    if (!result) {
      throw new InternalServerErrorException();
    }

    return result;
  }

  async getListaMembroUsuario(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    listaMembroId: string,
  ): Promise<Usuario> {
    const listaMembro = await this.findListaMembroByIdSimple(
      resourceActionRequest,
      listaResourceActionRequest,
      listaMembroId,
    );

    const usuarioQuery = this.usuarioRepository
      .createQueryBuilder('usuario')
      .innerJoin('usuario.listaMembro', 'lista_membro')
      .select(['usuario.id'])
      .where('lista_membro.id_lista_membro = :id', { id: listaMembro.id });

    const result = await usuarioQuery.getOne();

    if (!result) {
      throw new InternalServerErrorException();
    }

    return result;
  }

  private async findListaMembro(
    resourceActionRequest: ResourceActionRequest,
    listaId: string,
    usuarioId: string,
  ) {
    const lista = await this.listaService.findListaByIdSimple(
      resourceActionRequest,
      listaId,
    );

    const usuario = await this.usuarioService.findUsuarioByIdSimple(
      resourceActionRequest,
      usuarioId,
    );

    const listaMembro = await this.listaMembroRepository.findOne({
      where: {
        lista: { id: lista.id },
        usuario: { id: usuario.id },
      },
    });

    return listaMembro;
  }

  private async checkUsuarioInLista(
    resourceActionRequest: ResourceActionRequest,
    listaId: string,
    usuarioId: string,
  ) {
    const listaMembro = await this.findListaMembro(
      resourceActionRequest,
      listaId,
      usuarioId,
    );

    return listaMembro !== null;
  }

  async addMembroToLista(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    dto: IAddMembroToListaInput,
  ) {
    const lista = await this.listaService.findListaByIdSimple(
      resourceActionRequest,
      dto.listaId,
    );

    const usuario = await this.usuarioService.findUsuarioByIdSimple(
      resourceActionRequest,
      dto.usuarioId,
    );

    const isUsuarioInLista = await this.checkUsuarioInLista(
      resourceActionRequest,
      lista.id,
      usuario.id,
    );

    if (!isUsuarioInLista) {
      const listaMembro = this.listaMembroRepository.create();

      ListaMembroDbEntity.setupInitialIds(listaMembro);

      listaMembro.lista = <ListaDbEntity>{ id: lista.id };
      listaMembro.usuario = <UsuarioDbEntity>{ id: usuario.id };

      listaResourceActionRequest.ensurePermission(
        ListaAction.CREATE,
        subject(ListaSubject.MEMBRO, listaMembro),
      );

      await this.listaMembroRepository.save(listaMembro);
    }

    return true;
  }

  async removeMembroFromLista(
    resourceActionRequest: ResourceActionRequest,
    listaResourceActionRequest: ListaResourceActionRequest,
    dto: IRemoveMembroFromListaInput,
  ) {
    const lista = await this.usuarioService.findUsuarioByIdSimple(
      resourceActionRequest,
      dto.listaId,
    );

    const usuario = await this.usuarioService.findUsuarioByIdSimple(
      resourceActionRequest,
      dto.usuarioId,
    );

    const listaMembro = await this.findListaMembro(
      resourceActionRequest,
      lista.id,
      usuario.id,
    );

    if (listaMembro) {
      listaResourceActionRequest.ensurePermission(
        ListaAction.DELETE,
        subject(ListaSubject.MEMBRO, listaMembro),
      );

      await this.listaMembroRepository.remove(listaMembro);
    }

    return true;
  }

  async getListaResourceActionRequestFromListaId(
    resourceActionRequest: ResourceActionRequest,
    listaId: string,
  ): Promise<ListaResourceActionRequest> {
    const lista = await this.listaService.findListaByIdSimple(
      ResourceActionRequest.forSystemInternalActions(),
      listaId,
    );

    const user = resourceActionRequest.userRef;

    if (user) {
      const isUsuarioInLista = await this.checkUsuarioInLista(
        ResourceActionRequest.forSystemInternalActions(),
        lista.id,
        user.id,
      );

      if (isUsuarioInLista) {
        return ListaResourceActionRequest.forSystemInternalActions();
      }
    }

    const listaResourceActionRequest = new ListaResourceActionRequest([
      { action: 'read', subject: 'all' },
    ]);

    return listaResourceActionRequest;
  }

  async getListaResourceActionRequestFromListaMembroId(
    resourceActionRequest: ResourceActionRequest,
    listaId: string,
  ): Promise<ListaResourceActionRequest> {
    const listaMembro = await this.findListaMembroByIdSimple(
      ResourceActionRequest.forSystemInternalActions(),
      ListaResourceActionRequest.forSystemInternalActions(),
      listaId,
    );

    const lista = await this.getListaMembroLista(
      ResourceActionRequest.forSystemInternalActions(),
      ListaResourceActionRequest.forSystemInternalActions(),
      listaMembro.id,
    );

    return this.getListaResourceActionRequestFromListaId(
      resourceActionRequest,
      lista.id,
    );
  }
}
