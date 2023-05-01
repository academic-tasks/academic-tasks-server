import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { AppContext } from 'src/app/app-context/services/AppContext';
import { INDEX_ROLE } from 'src/app/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/app/meilisearch/dtos';
import { MeiliSearchService } from 'src/app/meilisearch/meilisearch.service';
import { parralelMap } from 'src/common/utils/parralel-map';
import { FindOneOptions } from 'typeorm';
import { RoleDbEntity } from '../../database/entities/role.db.entity';
import { getRoleRepository } from '../../database/repositories/role.repository';
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
    const role = await this.findRoleByIdStrictSimple(appContext, dto.id);

    const fieldsData = omit(dto, ['id']);

    const result = await appContext.databaseRun(async ({ entityManager }) => {
      const roleRepository = getRoleRepository(entityManager);

      const updatedRole = <RoleDbEntity>{
        ...role,
        ...fieldsData,
      };

      const result = await roleRepository
        .createQueryBuilder('role')
        .update()
        .set(updatedRole)
        .where('role.id = :id', { id: role.id })
        .execute();

      return result;
    });

    if (result.affected === 0) {
      throw new ForbiddenException();
    }

    return this.findRoleByIdStrictSimple(appContext, role.id);
  }

  async deleteRole(appContext: AppContext, dto: IDeleteRoleInput) {
    const role = await this.findRoleByIdStrictSimple(appContext, dto.id);

    return appContext.databaseRun(async ({ entityManager }) => {
      const roleRepository = getRoleRepository(entityManager);

      try {
        const result = await roleRepository.delete(role.id);

        const rowsAffected = result.affected ?? 0;

        if (rowsAffected > 0) {
          return true;
        }
      } catch (error) {}

      return false;
    });
  }
}
