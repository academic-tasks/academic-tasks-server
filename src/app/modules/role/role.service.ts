import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { AppContext } from 'src/app-context/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { INDEX_ROLE } from 'src/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { RoleDbEntity } from '../../../database/entities/role.db.entity';
import { getRoleRepository } from '../../../database/repositories/role.repository';
import {
  ICreateRoleInput,
  IDeleteRoleInput,
  IFindRoleByIdInput,
  IUpdateRoleInput,
} from './dtos';
import { ListRoleResultType } from './dtos/ListRoleResult';
import { RoleType } from './role.type';

@Injectable()
export class RoleService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findRoleById(
    appContext: AppContext,
    dto: IFindRoleByIdInput,
    options: FindOneOptions<RoleDbEntity> | null = null,
  ) {
    const { id } = dto;

    const targetRole = await appContext.databaseRun(
      async ({ entityManager }) => {
        const roleRepository = getRoleRepository(entityManager);

        return roleRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetRole) {
      return null;
    }

    const role = await appContext.databaseRun(async ({ entityManager }) => {
      const roleRepository = getRoleRepository(entityManager);

      return roleRepository.findOneOrFail({
        where: { id: targetRole.id },
        select: ['id'],
        ...options,
      });
    });

    return role;
  }

  async findRoleByIdStrict(
    appContext: AppContext,
    dto: IFindRoleByIdInput,
    options: FindOneOptions<RoleDbEntity> | null = null,
  ) {
    const role = await this.findRoleById(appContext, dto, options);

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }

  async listRole(
    appContext: AppContext,
    dto: IGenericListInput,
  ): Promise<ListRoleResultType> {
    const result = await this.meilisearchService.listResource<RoleType>(
      INDEX_ROLE,
      dto,
    );

    const items = await parralelMap(result.items, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const row = await this.findRoleById(appContext, {
          id: hit.id,
        });

        if (row) {
          return row;
        }
      }

      return null;
    });

    return {
      ...result,
      items,
    };
  }

  async findRoleByIdStrictSimple<T = Pick<RoleDbEntity, 'id'>>(
    appContext: AppContext,
    roleId: number,
  ): Promise<T> {
    const role = await this.findRoleByIdStrict(appContext, { id: roleId });
    return <T>role;
  }

  async getRoleStrictGenericField<K extends keyof RoleDbEntity>(
    appContext: AppContext,
    roleId: number,
    field: K,
  ): Promise<RoleDbEntity[K]> {
    const role = await this.findRoleByIdStrict(
      appContext,
      { id: roleId },
      { select: ['id', field] },
    );

    return <RoleDbEntity[K]>role[field];
  }

  async getRoleSlug(appContext: AppContext, roleId: number) {
    return this.getRoleStrictGenericField(appContext, roleId, 'slug');
  }

  async createRole(appContext: AppContext, dto: ICreateRoleInput) {
    const fieldsData = omit(dto, []);

    const role = await appContext.databaseRun(async ({ entityManager }) => {
      const roleRepository = getRoleRepository(entityManager);

      const role = { ...fieldsData };
      await roleRepository.save(role);

      return <RoleDbEntity>role;
    });

    return this.findRoleByIdStrictSimple(appContext, role.id);
  }

  async updateRole(appContext: AppContext, dto: IUpdateRoleInput) {
    const { id } = dto;

    const role = await this.findRoleByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id']);

    await appContext.databaseRun(async ({ entityManager }) => {
      const roleRepository = getRoleRepository(entityManager);

      const updatedRole = { ...role, ...fieldsData };
      await roleRepository.save(updatedRole);

      return <RoleDbEntity>updatedRole;
    });

    return this.findRoleByIdStrictSimple(appContext, role.id);
  }

  async deleteRole(appContext: AppContext, dto: IDeleteRoleInput) {
    const { id } = dto;

    const role = await this.findRoleByIdStrictSimple(appContext, id);

    return appContext.databaseRun(async ({ entityManager }) => {
      const roleRepository = getRoleRepository(entityManager);

      try {
        await roleRepository.delete(role.id);

        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
