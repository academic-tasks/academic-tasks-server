import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Client } from 'openid-client';
import { DataSource } from 'typeorm';
import { IS_PRODUCTION_MODE } from '../../common/constants/IS_PRODUCTION_MODE.const';
import { AppContext } from '../app-context/services/AppContext';
import { DATA_SOURCE } from '../database/constants/DATA_SOURCE';
import { UserService } from '../modules/user/user.service';
import { OPENID_CLIENT } from '../oidc-client/constants/OPENID_CLIENT.const';
import { ResourceActionRequest } from './interfaces/ResourceActionRequest';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,

    @Inject(OPENID_CLIENT)
    private openIDClient: Client,

    @Inject(DATA_SOURCE)
    private dataSource: DataSource,
  ) {}

  async getAuthedUser(appContext: AppContext) {
    const { resourceActionRequest } = appContext;

    const { user } = resourceActionRequest;

    if (!user) {
      throw new BadRequestException("You're not logged in");
    }

    return this.userService.findUserByIdStrictSimple(appContext, user.id);
  }

  async validateAccessToken(accessToken?: string | any) {
    const appContext = new AppContext(
      this.dataSource,
      ResourceActionRequest.forSystemInternalActions(),
    );

    try {
      if (typeof accessToken !== 'string' || accessToken?.length === 0) {
        throw new TypeError();
      }

      const userinfo = await this.openIDClient.userinfo(accessToken);

      const user = await this.userService.getUserByKeycloakId(
        appContext,
        userinfo.sub,
      );

      return user;
    } catch (err) {
      if (!IS_PRODUCTION_MODE) {
        console.error('auth err:', { err });
      }

      throw err;
    }
  }

  async getUserResourceActionRequest(userId: number) {
    return ResourceActionRequest.forUser(userId);
  }
}
