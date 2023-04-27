import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { AppContext } from 'src/app-context/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { getRoleRepository } from 'src/database/repositories/role.repository';
import { getUserHasRoleRepository } from 'src/database/repositories/user-has-role.repository';
import { getUserRepository } from 'src/database/repositories/user.repository';
import { INDEX_USER } from 'src/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { UserDbEntity } from '../../../database/entities/user.db.entity';
import {
  ICreateUserInput,
  IDeleteUserInput,
  IFindUserByIdInput,
  IUpdateUserInput,
} from './dtos';
import { ListUserResultType } from './dtos/ListUserResult';
import { UserType } from './user.type';

@Injectable()
export class UserService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findUserById(
    appContext: AppContext,
    dto: IFindUserByIdInput,
    options?: FindOneOptions<UserDbEntity>,
  ) {
    const { id } = dto;

    const targetUser = await appContext.databaseRun(
      async ({ entityManager }) => {
        const userRepository = getUserRepository(entityManager);

        return userRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetUser) {
      return null;
    }

    const user = await appContext.databaseRun<UserDbEntity>(
      async ({ entityManager }) => {
        const userRepository = getUserRepository(entityManager);

        return await userRepository.findOneOrFail({
          where: { id: targetUser.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return user;
  }

  async findUserByIdStrict(
    appContext: AppContext,
    dto: IFindUserByIdInput,
    options?: FindOneOptions<UserDbEntity>,
  ) {
    const user = await this.findUserById(appContext, dto, options);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findUserByIdStrictSimple(
    appContext: AppContext,
    userId: number,
  ): Promise<Pick<UserDbEntity, 'id'>> {
    const user = await this.findUserByIdStrict(appContext, {
      id: userId,
    });

    return user as Pick<UserDbEntity, 'id'>;
  }

  async listUser(
    appContext: AppContext,
    dto: IGenericListInput,
  ): Promise<ListUserResultType> {
    const result = await this.meilisearchService.listResource<UserType>(
      INDEX_USER,
      dto,
    );

    const items = await parralelMap(result.items, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const row = await this.findUserById(appContext, {
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

  async getUserFromKeycloakId(appContext: AppContext, keycloakId: string) {
    const userExists = await appContext.databaseRun(
      async ({ entityManager }) => {
        const userRepository = getUserRepository(entityManager);

        return await userRepository.findOne({
          where: { keycloakId: keycloakId },
          select: ['id'],
        });
      },
    );

    if (userExists) {
      return this.findUserByIdStrictSimple(appContext, userExists.id);
    }

    const newUser = await appContext.databaseRun(async ({ entityManager }) => {
      const userRepository = getUserRepository(entityManager);

      const userHasRoleRepository = getUserHasRoleRepository(entityManager);

      const roleRepository = getRoleRepository(entityManager);

      const newUser = userRepository.create();
      newUser.keycloakId = keycloakId;

      const usersCount = await userRepository.count();
      const hasUsers = usersCount > 0;

      await userRepository.save(newUser);

      if (!hasUsers) {
        const role = await roleRepository.findOne({
          where: { slug: 'dape' },
        });

        if (role) {
          const userHasRole = userHasRoleRepository.create();
          userHasRole.user = newUser;
          userHasRole.role = role;
          await userHasRoleRepository.save(userHasRole);
        }
      }

      return await userRepository.findOneOrFail({
        where: { keycloakId: keycloakId },
        select: ['id'],
      });
    });

    return this.findUserByIdStrictSimple(appContext, newUser.id);
  }

  async getUserStrictGenericField<K extends keyof UserDbEntity>(
    appContext: AppContext,
    userId: number,
    field: K,
  ): Promise<UserDbEntity[K]> {
    const user = await this.findUserByIdStrict(
      appContext,
      { id: userId },
      { select: ['id', field] },
    );

    return <UserDbEntity[K]>user[field];
  }

  async getUserName(appContext: AppContext, userId: number) {
    return this.getUserStrictGenericField(appContext, userId, 'name');
  }

  async getUserEmail(appContext: AppContext, userId: number) {
    return this.getUserStrictGenericField(appContext, userId, 'email');
  }

  async getUserKeycloakId(appContext: AppContext, userId: number) {
    return this.getUserStrictGenericField(appContext, userId, 'keycloakId');
  }

  async getUserMatriculaSiape(appContext: AppContext, userId: number) {
    return this.getUserStrictGenericField(appContext, userId, 'matriculaSiape');
  }

  async getUserRoles(appContext: AppContext, userId: number) {
    const roles = await appContext.databaseRun(async ({ entityManager }) => {
      const roleRepository = getRoleRepository(entityManager);

      return roleRepository
        .createQueryBuilder('role')
        .innerJoin('role.userHasRole', 'userHasRole')
        .innerJoin('userHasRole.user', 'user')
        .where('user.id = :userId', { userId })
        .select(['role.id'])
        .getMany();
    });

    return roles;
  }

  async createUser(appContext: AppContext, dto: ICreateUserInput) {
    const fieldsData = omit(dto, []);

    const user = await appContext.databaseRun(async ({ entityManager }) => {
      const userRepository = getUserRepository(entityManager);

      const user = { ...fieldsData };
      await userRepository.save(user);

      return <UserDbEntity>user;
    });

    return this.findUserByIdStrictSimple(appContext, user.id);
  }

  async updateUser(appContext: AppContext, dto: IUpdateUserInput) {
    const { id } = dto;

    const user = await this.findUserByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id']);

    await appContext.databaseRun(async ({ entityManager }) => {
      const userRepository = getUserRepository(entityManager);

      const updatedUser = { ...user, ...fieldsData };
      await userRepository.save(updatedUser);

      return <UserDbEntity>updatedUser;
    });

    return this.findUserByIdStrictSimple(appContext, user.id);
  }

  async deleteUser(appContext: AppContext, dto: IDeleteUserInput) {
    const { id } = dto;

    const user = await this.findUserByIdStrictSimple(appContext, id);

    return appContext.databaseRun(async ({ entityManager }) => {
      const userRepository = getUserRepository(entityManager);

      try {
        await userRepository.delete(user.id);

        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
