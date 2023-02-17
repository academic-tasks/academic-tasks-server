import {
  AppAction,
  AppRawRule,
  AppSubject,
  Cargo,
  ICreateUsuarioInput,
  IDeleteUsuarioInput,
  IFindUsuarioByIdInput,
  ISetUsuarioRolesInput,
  IUpdateUsuarioInput,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { castArray, omit, pick } from 'lodash';
import { parralel } from 'src/app/helpers';
import { KcClient } from 'src/infrastructure/auth/providers/kc-client';
import { KC_CLIENT } from 'src/infrastructure/consts/KC_CLIENT.const';
import { FindOneOptions } from 'typeorm';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import {
  REPOSITORY_CARGO,
  REPOSITORY_USUARIO,
} from '../../../infrastructure/database/constants/REPOSITORIES.const';

import { UsuarioDbEntity } from '../../entities/usuario.db.entity';
import { ICargoRepository } from '../../repositories/cargo.repository';
import { IUsuarioRepository } from '../../repositories/usuario.repository';
import { CargoService } from '../cargo/cargo.service';

@Injectable()
export class UsuarioService {
  constructor(
    private cargoService: CargoService,

    @Inject(KC_CLIENT)
    private kcClient: KcClient,

    @Inject(REPOSITORY_CARGO)
    private cargoRepository: ICargoRepository,

    @Inject(REPOSITORY_USUARIO)
    private usuarioRepository: IUsuarioRepository,
  ) {}

  async findUsuarioById(
    resourceActionRequest: ResourceActionRequest,
    dto: IFindUsuarioByIdInput,
    options?: FindOneOptions<UsuarioDbEntity>,
  ) {
    const targetUsuario = await this.usuarioRepository.findOne({
      where: { id: dto.id },
      select: ['id'],
    });

    if (!targetUsuario) {
      throw new NotFoundException();
    }

    const usuario = await this.usuarioRepository.findOneOrFail({
      where: { id: targetUsuario.id },
      select: ['id'],
      ...options,
    });

    return resourceActionRequest.readResource(AppSubject.USUARIO, usuario);
  }

  async findUsuarioByIdSimple(
    resourceActionRequest: ResourceActionRequest,
    usuarioId: string,
  ): Promise<Pick<UsuarioDbEntity, 'id'>> {
    const usuario = await this.findUsuarioById(resourceActionRequest, {
      id: usuarioId,
    });

    return usuario as Pick<UsuarioDbEntity, 'id'>;
  }

  async getUsuarioFromKeycloakId(
    resourceActionRequest: ResourceActionRequest,
    keycloakId: string,
  ) {
    const usuarioExists = await this.usuarioRepository.findOne({
      where: { keycloakId: keycloakId },
      select: ['id'],
    });

    if (usuarioExists) {
      return this.findUsuarioByIdSimple(
        resourceActionRequest,
        usuarioExists.id,
      );
    }

    const newUsuario = this.usuarioRepository.create();

    newUsuario.id = keycloakId;
    // UsuarioDbEntity.setupInitialIds(newUsuario);

    const user = await this.kcClient.users.findOne({ id: keycloakId });

    if (!user) {
      throw new ForbiddenException();
    }

    newUsuario.keycloakId = keycloakId;
    newUsuario.username = user.username!;

    await this.usuarioRepository.save(newUsuario);

    return this.findUsuarioByIdSimple(resourceActionRequest, newUsuario.id);
  }

  async getUsuarioGenericField<K extends keyof UsuarioDbEntity>(
    resourceActionRequest: ResourceActionRequest,
    usuarioId: string,
    field: K,
  ): Promise<UsuarioDbEntity[K]> {
    const usuario = await this.findUsuarioById(
      resourceActionRequest,
      { id: usuarioId },
      { select: ['id', field] },
    );

    resourceActionRequest.ensurePermission(
      AppAction.READ,
      subject(AppSubject.USUARIO, usuario),
      field,
    );

    return <UsuarioDbEntity[K]>usuario[field];
  }

  async getUsuarioUsername(
    resourceActionRequest: ResourceActionRequest,
    usuarioId: string,
  ) {
    return this.getUsuarioGenericField(
      resourceActionRequest,
      usuarioId,
      'username',
    );
  }

  async getUsuarioCargos(
    resourceActionRequest: ResourceActionRequest,
    usuarioId: string,
  ) {
    const usuario = await this.findUsuarioByIdSimple(
      resourceActionRequest,
      usuarioId,
    );

    const dbCargosQuery = this.cargoRepository
      .createQueryBuilder('cargo')
      .innerJoin('cargo.usuarioHasCargo', 'usuario_has_cargo')
      .select(['cargo.id'])
      .where('usuario_has_cargo.id_usuario_fk = :id', { id: usuario.id });

    const dbCargos = await dbCargosQuery.getMany();

    const cargos = await parralel(dbCargos, (role) =>
      this.cargoService.findCargoByIdSimple(resourceActionRequest, role.id),
    );

    return cargos as Cargo[];
  }

  async getUsuarioAuthorizationRules(
    resourceActionRequest: ResourceActionRequest,
    usuarioId: string,
  ): Promise<AppRawRule[]> {
    const usuario = await this.findUsuarioByIdSimple(
      resourceActionRequest,
      usuarioId,
    );

    const cargos = await this.getUsuarioCargos(
      resourceActionRequest,
      usuario.id,
    );

    const recipes = await this.cargoService.getCargosRecipes(
      resourceActionRequest,
      cargos,
    );

    const rules: AppRawRule[] = recipes
      .map((recipe): AppRawRule[] => castArray(JSON.parse(recipe)))
      .flat(1);

    return rules;
  }

  async createUsuario(
    resourceActionRequest: ResourceActionRequest,
    dto: ICreateUsuarioInput,
  ) {
    const fieldsData = pick(dto, ['username']);

    const usuario = resourceActionRequest.updateResource(
      AppSubject.USUARIO,
      <UsuarioDbEntity>{},
      fieldsData,
      AppAction.CREATE,
    );

    resourceActionRequest.ensurePermission(
      AppAction.CREATE,
      subject(AppSubject.USUARIO, usuario),
    );

    await this.usuarioRepository.save(usuario);

    return this.findUsuarioByIdSimple(resourceActionRequest, usuario.id);
  }

  async updateUsuario(
    resourceActionRequest: ResourceActionRequest,
    dto: IUpdateUsuarioInput,
  ) {
    const { id } = dto;

    const usuario = await this.findUsuarioByIdSimple(resourceActionRequest, id);

    const fieldsData = omit(dto, ['id']);

    const updatedUsuario = resourceActionRequest.updateResource(
      AppSubject.USUARIO,
      <UsuarioDbEntity>usuario,
      fieldsData,
    );

    resourceActionRequest.ensurePermission(
      AppAction.UPDATE,
      subject(AppSubject.USUARIO, updatedUsuario),
    );

    await this.usuarioRepository.save(updatedUsuario);

    return this.findUsuarioByIdSimple(resourceActionRequest, usuario.id);
  }

  async setUsuarioCargos(
    resourceActionRequest: ResourceActionRequest,
    dto: ISetUsuarioRolesInput,
  ) {
    const { id } = dto;

    const usuario = await this.findUsuarioByIdSimple(resourceActionRequest, id);

    const roles = await this.cargoService.findCargosByIds(
      resourceActionRequest,
      dto.cargos,
    );

    resourceActionRequest.ensurePermission(
      AppAction.UPDATE,
      subject(AppSubject.USUARIO, usuario),
      AppSubject.USUARIO,
    );

    await this.usuarioRepository.save({
      id: usuario.id,
      roles: roles,
    });

    return this.findUsuarioByIdSimple(resourceActionRequest, usuario.id);
  }

  async deleteUsuario(
    resourceActionRequest: ResourceActionRequest,
    dto: IDeleteUsuarioInput,
  ) {
    const { id } = dto;

    const usuario = await this.findUsuarioByIdSimple(resourceActionRequest, id);

    resourceActionRequest.ensurePermission(
      AppAction.DELETE,
      subject(AppSubject.USUARIO, usuario),
    );

    await this.usuarioRepository.delete(usuario.id);

    return true;
  }
}
