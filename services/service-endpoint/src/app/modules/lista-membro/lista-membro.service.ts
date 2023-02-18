import {
  AppAction,
  AppSubject,
  IAddMembroToListaInput,
  IRemoveMembroFromListaInput,
} from '@academic-tasks/schemas';
import { Inject, Injectable } from '@nestjs/common';
import { ListaMembroDbEntity } from 'src/app/entities/lista-membro.db.entity';
import { ListaDbEntity } from 'src/app/entities/lista.db.entity';
import { UsuarioDbEntity } from 'src/app/entities/usuario.db.entity';
import { IListaMembroRepository } from 'src/app/repositories/lista-membro.repository';
import { ResourceActionRequest } from 'src/infrastructure/auth/ResourceActionRequest';
import { REPOSITORY_LISTA_MEMBRO } from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { ListaService } from '../lista/lista.service';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class ListaMembroService {
  constructor(
    private listaService: ListaService,
    private usuarioService: UsuarioService,

    @Inject(REPOSITORY_LISTA_MEMBRO)
    private listaMembroRepository: IListaMembroRepository,
  ) {}

  async findListaMembro(
    resourceActionRequest: ResourceActionRequest,
    listaId: string,
    usuarioId: string,
  ) {
    const listaMembro = await this.listaMembroRepository.findOne({
      where: {
        lista: { id: listaId },
        usuario: { id: usuarioId },
      },
    });

    return listaMembro;
  }

  async checkUsuarioInLista(
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
    dto: IAddMembroToListaInput,
  ) {
    const lista = await this.usuarioService.findUsuarioByIdSimple(
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

      // TODO: lista sub permission system.

      resourceActionRequest.ensurePermission(
        AppAction.UPDATE,
        AppSubject.LISTA,
        'membros',
      );

      await this.listaMembroRepository.save(listaMembro);
    }

    return true;
  }

  async removeMembroFromLista(
    resourceActionRequest: ResourceActionRequest,
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
      resourceActionRequest.ensurePermission(
        AppAction.UPDATE,
        AppSubject.LISTA,
        'membros',
      );

      await this.listaMembroRepository.remove(listaMembro);
    }

    return true;
  }
}
