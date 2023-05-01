import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { get, has, isNil, omit } from 'lodash';
import { getRoleRepository } from 'src/app/database/repositories/role.repository';
import { getUserHasRoleRepository } from 'src/app/database/repositories/user-has-role.repository';
import { getUserRepository } from 'src/app/database/repositories/user.repository';
import { KCClientService } from 'src/app/kc-client/kc-client.service';
import { INDEX_USER } from 'src/app/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/app/meilisearch/dtos';
import { MeiliSearchService } from 'src/app/meilisearch/meilisearch.service';
import { ValidationErrorCodes } from 'src/common/ValidationErrorCodes';
import { ValidationFailedException } from 'src/common/ValidationFailedException';
import { parralelMap } from 'src/common/utils/parralel-map';
import { FindOneOptions } from 'typeorm';
import { APP_CONTEXT_SYSTEM } from '../../app-context/consts/APP_CONTEXT_SYSTEM.const';
import { AppContext } from '../../app-context/services/AppContext';
import { UserDbEntity } from '../../database/entities/user.db.entity';
import {
  ICreateUserInput,
  IDeleteUserInput,
  IFindUserByIdInput,
  IUpdateUserInput,
  IUpdateUserPasswordInput,
} from './dtos';
import { ListUserResultType } from './dtos/ListUserResult';
import { UserType } from './user.type';

@Injectable()
export class UserService {
  constructor(
    private meilisearchService: MeiliSearchService,
    private kcClientService: KCClientService,

    @Inject(APP_CONTEXT_SYSTEM)
    private appContextSystem: AppContext,
  ) {}

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

  async getUserByKeycloakId(appContext: AppContext, keycloakId: string) {
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

    const kcUser = await this.kcClientService.findUserByKeycloakId(
      appContext,
      keycloakId,
    );

    if (!kcUser) {
      throw new NotFoundException();
    }

    const newUser = await appContext.databaseRun(async ({ entityManager }) => {
      const roleRepository = getRoleRepository(entityManager);
      const userRepository = getUserRepository(entityManager);
      const userHasRoleRepository = getUserHasRoleRepository(entityManager);

      const usersCount = await userRepository.count();
      const databaseHasOtherUsers = usersCount > 0;

      const newUser = userRepository.create();
      newUser.keycloakId = keycloakId;
      newUser.email = kcUser.email ?? null;
      newUser.name = KCClientService.buildUserFullName(kcUser);
      await userRepository.save(newUser);

      if (!databaseHasOtherUsers) {
        const FIRST_SYSTEM_USER_ROLES_SLUG = ['admin'];

        for (const roleSlug of FIRST_SYSTEM_USER_ROLES_SLUG) {
          const role = await roleRepository.findOne({
            where: { slug: roleSlug },
          });

          if (role) {
            const userHasRole = userHasRoleRepository.create();

            userHasRole.user = newUser;
            userHasRole.role = role;

            await userHasRoleRepository.save(userHasRole);
          }
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

  async getUserByEmail(appContext: AppContext, email: string) {
    const kcUser = await this.kcClientService.findUserByEmail(
      appContext,
      email,
    );

    if (kcUser) {
      const id = get(kcUser, 'id');

      if (typeof id === 'string') {
        return this.getUserByKeycloakId(appContext, id);
      }
    }

    const user = await appContext.databaseRun(async ({ entityManager }) => {
      const userRepository = getUserRepository(entityManager);

      return await userRepository.findOne({
        where: { email },
        select: ['id'],
      });
    });

    return user;
  }

  async isEmailAvailableForUser(
    appContext: AppContext,
    email: string,
    userId: number,
  ) {
    const currentUserWithEmail = await this.getUserByEmail(appContext, email);

    const user = await this.findUserByIdStrictSimple(appContext, userId);

    return !currentUserWithEmail || currentUserWithEmail.id === user.id;
  }

  async isEmailAvailable(appContext: AppContext, email: string) {
    const currentUserWithEmail = await this.getUserByEmail(appContext, email);
    return !currentUserWithEmail;
  }

  async createUser(appContext: AppContext, dto: ICreateUserInput) {
    const fieldsData = omit(dto, []);

    if (has(fieldsData, 'email')) {
      const email = get(fieldsData, 'email')!;

      const isEmailAvailable = await this.isEmailAvailable(
        this.appContextSystem,
        email,
      );

      if (!isEmailAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodes.EMAIL_ALREADY_IN_USE,
            message: 'Já existe um usuário com o mesmo email.',
            path: ['email'],
          },
        ]);
      }
    }

    const user = await appContext.databaseRun(async ({ entityManager }) => {
      const userRepository = getUserRepository(entityManager);

      const user = <UserDbEntity>{ ...fieldsData };
      await userRepository.save(user);

      return user;
    });

    if (user) {
      const kcUser = await this.kcClientService.createUser(appContext, dto);

      await appContext.databaseRun(async ({ entityManager }) => {
        const userRepository = getUserRepository(entityManager);

        const updatedUser = <UserDbEntity>{
          id: user.id,
        };

        updatedUser.keycloakId = kcUser.id;

        await userRepository.save(updatedUser);

        return updatedUser;
      });
    }

    return this.findUserByIdStrictSimple(appContext, user.id);
  }

  async updateUser(appContext: AppContext, dto: IUpdateUserInput) {
    const user = await this.findUserByIdStrictSimple(appContext, dto.id);

    const fieldsData = omit(dto, ['id']);

    if (has(fieldsData, 'email')) {
      const email = get(fieldsData, 'email')!;

      const isEmailAvailable = await this.isEmailAvailableForUser(
        this.appContextSystem,
        email,
        user.id,
      );

      if (!isEmailAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodes.EMAIL_ALREADY_IN_USE,
            message: 'Já existe um usuário com o mesmo email.',
            path: ['email'],
          },
        ]);
      }
    }

    const result = await appContext.databaseRun(async ({ entityManager }) => {
      const userRepository = getUserRepository(entityManager);

      const updatedUser = <UserDbEntity>{
        ...user,
        ...fieldsData,
      };

      const result = await userRepository
        .createQueryBuilder('user')
        .update()
        .set(updatedUser)
        .where('id = :id', { id: user.id })
        .execute();

      return result;
    });

    const rowsAffected = result.affected ?? 0;

    if (rowsAffected > 0) {
      const keycloakId = await this.getUserKeycloakId(
        this.appContextSystem,
        user.id,
      );

      if (keycloakId) {
        await this.kcClientService.updateUser(appContext, keycloakId, dto);
      }
    }

    return this.findUserByIdStrictSimple(appContext, user.id);
  }

  async updateUserPassword(
    appContext: AppContext,
    dto: IUpdateUserPasswordInput,
  ) {
    const user = await this.findUserByIdStrictSimple(appContext, dto.id);

    const appContextUserRef = appContext.resourceActionRequest.user;

    if (!appContextUserRef || appContextUserRef.id !== user.id) {
      throw new ForbiddenException("You can't change other user password.");
    }

    const userKeycloakId = await this.getUserKeycloakId(
      this.appContextSystem,
      user.id,
    );

    if (!userKeycloakId) {
      throw new InternalServerErrorException('User without keycloakId');
    }

    const isPasswordCorrect = await this.kcClientService.checkUserPassword(
      appContext,
      userKeycloakId,
      dto.currentPassword,
    );

    if (!isPasswordCorrect) {
      throw new ValidationFailedException([
        {
          code: ValidationErrorCodes.INVALID_PASSWORD,
          message: 'Senha atual inválida.',
          path: ['currentPassword'],
        },
      ]);
    }

    const updated = await this.kcClientService.updateUserPassword(
      appContext,
      userKeycloakId,
      dto,
      false,
    );

    return updated;
  }

  async deleteUser(appContext: AppContext, dto: IDeleteUserInput) {
    const user = await this.findUserByIdStrictSimple(appContext, dto.id);

    return appContext.databaseRun(async ({ entityManager }) => {
      const userRepository = getUserRepository(entityManager);

      try {
        const result = await userRepository.delete(user.id);

        if ((result.affected ?? 0) > 0) {
          return true;
        }
      } catch (error) {}

      return false;
    });
  }
}
