import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { has } from 'lodash';
import { BaseClient } from 'openid-client';
import { AppContext } from '../app-context/services/AppContext';
import {
  ICreateUserInput,
  IUpdateUserInput,
  IUpdateUserPasswordInput,
} from '../modules/user/dtos';
import { OPENID_CLIENT } from '../oidc-client/constants/OPENID_CLIENT.const';
import { KC_CLIENT } from './constants/KC_CLIENT.const';
import { IKCClient } from './interfaces/IKCClient';

@Injectable()
export class KCClientService {
  constructor(
    @Inject(KC_CLIENT)
    private kcClient: IKCClient,

    @Inject(OPENID_CLIENT)
    private oidcClient: BaseClient,
  ) {}

  static buildUserFullName(user: UserRepresentation) {
    return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  }

  async findUserByEmail(appContext: AppContext, email: string) {
    const adminClient = await this.kcClient.getAdminClient();

    const response = await adminClient.users.find({
      email,
      exact: true,
    });

    if (response.length === 0) {
      return null;
    }

    const user = response[0];

    return user;
  }

  async findUserByKeycloakId(appContext: AppContext, keycloakId: string) {
    const adminClient = await this.kcClient.getAdminClient();

    const user = await adminClient.users.findOne({ id: keycloakId });

    return user;
  }

  async createUser(appContext: AppContext, dto: ICreateUserInput) {
    const adminClient = await this.kcClient.getAdminClient();

    const user: UserRepresentation = {
      username: dto.email,

      email: dto.email,

      firstName: dto.name,

      enabled: true,
    };

    const response = await adminClient.users.create(user);

    return response;
  }

  async updateUser(
    appContext: AppContext,
    keycloakId: string,
    dto: IUpdateUserInput,
  ) {
    const adminClient = await this.kcClient.getAdminClient();

    const user: UserRepresentation = {
      ...(has(dto, 'name')
        ? {
            firstName: dto.name,
            lastName: '',
          }
        : {}),

      ...(has(dto, 'email')
        ? {
            email: dto.email,
            username: dto.email,
          }
        : {}),
    };

    await adminClient.users.update(
      {
        id: keycloakId,
      },
      {
        ...user,
      },
    );
  }

  async checkUserPassword(
    appContext: AppContext,
    keycloakId: string,
    password: string,
  ) {
    const user = await this.findUserByKeycloakId(appContext, keycloakId);

    if (user) {
      try {
        const username = user.username ?? user.email;

        const tokenset = await this.oidcClient.grant({
          password,
          username,
          grant_type: 'password',
        });

        if (tokenset) {
          return true;
        }
      } catch (error) {}

      return false;
    }
  }

  async updateUserPassword(
    appContext: AppContext,
    keycloakId: string,
    dto: IUpdateUserPasswordInput,
    checkCurrentPassword = true,
  ) {
    const adminClient = await this.kcClient.getAdminClient();

    const user = await this.findUserByKeycloakId(appContext, keycloakId);

    if (user) {
      if (checkCurrentPassword) {
        const isPasswordCorrect = await this.checkUserPassword(
          appContext,
          keycloakId,
          dto.currentPassword,
        );

        if (!isPasswordCorrect) {
          throw new ForbiddenException('Invalid current password.');
        }
      }

      await adminClient.users.resetPassword({
        id: keycloakId,
        credential: {
          temporary: false,
          type: 'password',
          value: dto.newPassword,
        },
      });

      return true;
    }
  }
}
