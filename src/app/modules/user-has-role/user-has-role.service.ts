import { Injectable, NotFoundException } from '@nestjs/common';
import { AppContext } from 'src/app/app-context/services/AppContext';
import { RoleDbEntity } from 'src/app/database/entities/role.db.entity';
import { UserHasRoleDbEntity } from 'src/app/database/entities/user-has-role.db.entity';
import { UserDbEntity } from 'src/app/database/entities/user.db.entity';
import { getRoleRepository } from 'src/app/database/repositories/role.repository';
import { getUserHasRoleRepository } from 'src/app/database/repositories/user-has-role.repository';
import { getUserRepository } from 'src/app/database/repositories/user.repository';
import { MeiliSearchService } from 'src/app/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import {
  IAddRoleToUserInput,
  IFindUserHasRoleByIdInput,
  IFindUserHasRoleByUserIdAndRoleIdInput,
  IRemoveRoleFromUserInput,
} from './dtos';

@Injectable()
export class UserHasRoleService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findUserHasRoleById(
    appContext: AppContext,
    dto: IFindUserHasRoleByIdInput,
    options?: FindOneOptions<UserHasRoleDbEntity>,
  ) {
    const { id } = dto;

    const targetUserHasRole = await appContext.databaseRun(
      async ({ entityManager }) => {
        const userHasRoleRepository = getUserHasRoleRepository(entityManager);

        return userHasRoleRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetUserHasRole) {
      return null;
    }

    const userHasRole = await appContext.databaseRun<UserHasRoleDbEntity>(
      async ({ entityManager }) => {
        const userHasRoleRepository = getUserHasRoleRepository(entityManager);

        return await userHasRoleRepository.findOneOrFail({
          where: { id: targetUserHasRole.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return userHasRole;
  }

  async findUserHasRoleByIdStrict(
    appContext: AppContext,
    dto: IFindUserHasRoleByIdInput,
    options?: FindOneOptions<UserHasRoleDbEntity>,
  ) {
    const userHasRole = await this.findUserHasRoleById(
      appContext,
      dto,
      options,
    );

    if (!userHasRole) {
      throw new NotFoundException();
    }

    return userHasRole;
  }

  async findUserHasRoleByIdStrictSimple(
    appContext: AppContext,
    userHasRoleId: number,
  ): Promise<Pick<UserHasRoleDbEntity, 'id'>> {
    const userHasRole = await this.findUserHasRoleByIdStrict(appContext, {
      id: userHasRoleId,
    });

    return userHasRole as Pick<UserHasRoleDbEntity, 'id'>;
  }

  async findUserHasRoleByUserIdAndRoleId(
    appContext: AppContext,
    dto: IFindUserHasRoleByUserIdAndRoleIdInput,
  ): Promise<UserHasRoleDbEntity | null> {
    const { roleId, userId } = dto;

    const userHasRole = await appContext.databaseRun(
      async ({ entityManager }) => {
        const userHasRoleRepository = getUserHasRoleRepository(entityManager);

        return userHasRoleRepository
          .createQueryBuilder('uhc')
          .innerJoin('uhc.user', 'user')
          .innerJoin('uhc.role', 'role')
          .where('user.id = :userId', { userId })
          .andWhere('role.id = :roleId', { roleId })
          .select(['uhc.id'])
          .getOne();
      },
    );

    return userHasRole;
  }

  async findUserHasRoleByUserIdAndRoleIdStrict(
    appContext: AppContext,
    dto: IFindUserHasRoleByUserIdAndRoleIdInput,
  ): Promise<UserHasRoleDbEntity> {
    const userHasRole = await this.findUserHasRoleByUserIdAndRoleId(
      appContext,
      dto,
    );

    if (!userHasRole) {
      throw new NotFoundException();
    }

    return userHasRole;
  }

  async getUserHasRoleStrictGenericField<K extends keyof UserHasRoleDbEntity>(
    appContext: AppContext,
    userHasRoleId: number,
    field: K,
  ): Promise<UserHasRoleDbEntity[K]> {
    const userHasRole = await this.findUserHasRoleByIdStrict(
      appContext,
      { id: userHasRoleId },
      { select: ['id', field] },
    );

    return <UserHasRoleDbEntity[K]>userHasRole[field];
  }

  async getUserHasRoleUser(appContext: AppContext, userHasRoleId: number) {
    const user = await appContext.databaseRun(async ({ entityManager }) => {
      const userRepository = getUserRepository(entityManager);

      return userRepository
        .createQueryBuilder('user')
        .innerJoin('user.userHasRole', 'uhc')
        .where('uhc.id = :userHasRoleId', { userHasRoleId })
        .select(['user.id'])
        .getOne();
    });

    return user;
  }

  async getUserHasRoleRole(appContext: AppContext, userHasRoleId: number) {
    const role = await appContext.databaseRun(async ({ entityManager }) => {
      const roleRepository = getRoleRepository(entityManager);

      return roleRepository
        .createQueryBuilder('role')
        .innerJoin('role.userHasRole', 'uhc')
        .where('uhc.id = :userHasRoleId', { userHasRoleId })
        .select(['role.id'])
        .getOne();
    });

    return role;
  }

  async addRoleToUser(appContext: AppContext, dto: IAddRoleToUserInput) {
    const { userId, roleId } = dto;

    const userHasRoleAlreadyExists =
      await this.findUserHasRoleByUserIdAndRoleId(appContext, {
        roleId,
        userId,
      });

    if (userHasRoleAlreadyExists) {
      return userHasRoleAlreadyExists;
    }

    const userHasRole = <UserHasRoleDbEntity>{};

    userHasRole.role = <RoleDbEntity>{ id: roleId };
    userHasRole.user = <UserDbEntity>{ id: userId };

    await appContext.databaseRun(async ({ entityManager }) => {
      const userHasRoleRepository = getUserHasRoleRepository(entityManager);

      await userHasRoleRepository.save(userHasRole);

      return userHasRole;
    });

    return this.findUserHasRoleByIdStrictSimple(appContext, userHasRole.id);
  }

  async removeRoleFromUser(
    appContext: AppContext,
    dto: IRemoveRoleFromUserInput,
  ) {
    const userHasRole = await this.findUserHasRoleByUserIdAndRoleId(
      appContext,
      { roleId: dto.roleId, userId: dto.userId },
    );

    if (!userHasRole) {
      return true;
    }

    return appContext.databaseRun(async ({ entityManager }) => {
      const userHasRoleRepository = getUserHasRoleRepository(entityManager);

      try {
        await userHasRoleRepository.delete(userHasRole.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
