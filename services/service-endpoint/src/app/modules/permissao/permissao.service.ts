import {
  AppAction,
  AppSubject,
  ICreatePermissaoInput,
  IDeletePermissaoInput,
  IFindPermissaoByIdInput,
  IUpdatePermissaoInput,
} from '@academic-tasks/schemas';
import { subject } from '@casl/ability';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { omit, pick } from 'lodash';
import { FindOneOptions } from 'typeorm';
import { ResourceActionRequest } from '../../../infrastructure/auth/ResourceActionRequest';
import { REPOSITORY_PERMISSAO } from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { PermissaoDbEntity } from '../../entities/permissao.db.entity';
import { IPermissaoRepository } from '../../repositories/permissao.repository';
import { PermissaoType } from './permissao.type';

@Injectable()
export class PermissoesService {
  constructor(
    @Inject(REPOSITORY_PERMISSAO)
    private permissaoRepository: IPermissaoRepository,
  ) {}

  async findPermissaoById(
    resourceActionRequest: ResourceActionRequest,
    dto: IFindPermissaoByIdInput,
    options: FindOneOptions<PermissaoDbEntity> | null = null,
  ) {
    const targetPermissao = await this.permissaoRepository.findOne({
      where: { id: dto.id },
      select: ['id'],
    });

    if (!targetPermissao) {
      throw new NotFoundException();
    }

    const permissao = await this.permissaoRepository.findOneOrFail({
      where: { id: targetPermissao.id },
      select: ['id'],
      ...options,
    });

    resourceActionRequest.ensurePermission(
      AppAction.READ,
      subject(AppSubject.PERMISSAO, permissao),
    );

    return resourceActionRequest.readResource(AppSubject.PERMISSAO, permissao);
  }

  async findPermissaoByIdSimple(
    resourceActionRequest: ResourceActionRequest,
    permissaoId: string,
  ): Promise<Pick<PermissaoDbEntity, 'id'>> {
    const permissao = await this.findPermissaoById(resourceActionRequest, {
      id: permissaoId,
    });

    return permissao as Pick<PermissaoDbEntity, 'id'>;
  }

  async getPermissaoGenericField<K extends keyof PermissaoDbEntity>(
    resourceActionRequest: ResourceActionRequest,
    permissaoId: string,
    field: K,
  ): Promise<PermissaoDbEntity[K]> {
    const permissao = await this.findPermissaoById(
      resourceActionRequest,
      { id: permissaoId },
      { select: ['id', field] },
    );

    resourceActionRequest.ensurePermission(
      AppAction.READ,
      subject(AppSubject.PERMISSAO, permissao),
      field,
    );

    return <PermissaoDbEntity[K]>permissao[field];
  }

  async getPermissaoDescription(
    resourceActionRequest: ResourceActionRequest,
    permissaoId: string,
  ): Promise<PermissaoType['description']> {
    const description = await this.getPermissaoGenericField(
      resourceActionRequest,
      permissaoId,
      'description',
    );

    return description;
  }

  async getPermissaoRecipe(
    resourceActionRequest: ResourceActionRequest,
    permissaoId: string,
  ): Promise<PermissaoType['recipe']> {
    const recipe = await this.getPermissaoGenericField(
      resourceActionRequest,
      permissaoId,
      'recipe',
    );

    return recipe;
  }

  async createPermissao(
    resourceActionRequest: ResourceActionRequest,
    dto: ICreatePermissaoInput,
  ) {
    const fieldsData = pick(dto, ['recipe']);

    const permissao = resourceActionRequest.updateResource(
      'permissao',
      <PermissaoDbEntity>{},
      fieldsData,
      AppAction.CREATE,
    );

    PermissaoDbEntity.setupInitialIds(permissao);

    resourceActionRequest.ensurePermission(
      AppAction.CREATE,
      subject(AppSubject.PERMISSAO, permissao),
    );

    await this.permissaoRepository.save(permissao);

    return this.findPermissaoByIdSimple(resourceActionRequest, permissao.id);
  }

  async updatePermissao(
    resourceActionRequest: ResourceActionRequest,
    dto: IUpdatePermissaoInput,
  ) {
    const { id } = dto;

    const permissao = await this.findPermissaoByIdSimple(
      resourceActionRequest,
      id,
    );

    const fieldsData = omit(dto, ['id']);

    const updatedPermissao = resourceActionRequest.updateResource(
      AppSubject.PERMISSAO,
      <PermissaoDbEntity>permissao,
      fieldsData,
    );

    resourceActionRequest.ensurePermission(
      AppAction.UPDATE,
      subject(AppSubject.PERMISSAO, permissao),
    );

    await this.permissaoRepository.save(updatedPermissao);

    return this.findPermissaoByIdSimple(resourceActionRequest, permissao.id);
  }

  async deletePermissao(
    resourceActionRequest: ResourceActionRequest,
    dto: IDeletePermissaoInput,
  ) {
    const { id } = dto;

    const permissao = await this.findPermissaoByIdSimple(
      resourceActionRequest,
      id,
    );

    resourceActionRequest.ensurePermission(
      AppAction.DELETE,
      subject(AppSubject.PERMISSAO, permissao),
    );

    await this.permissaoRepository.delete(permissao.id);

    return true;
  }
}
