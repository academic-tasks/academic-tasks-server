import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Client } from 'openid-client';
import { UsuarioService } from '../../app/modules/usuario/usuario.service';
import { IS_PRODUCTION_MODE } from '../consts/IS_PRODUCTION_MODE.const';
import { OPENID_CLIENT } from '../consts/OPENID_CLIENT.const';
import { ResourceActionRequest } from './ResourceActionRequest';
import { systemResourceActionRequest } from './SystemResourceActionRequest';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,

    @Inject(OPENID_CLIENT)
    private openIDClient: Client,
  ) {}

  async getLoggedUser(resourceActionRequest: ResourceActionRequest) {
    const { user } = resourceActionRequest;

    if (!user) {
      throw new BadRequestException();
    }

    return this.usuarioService.findUsuarioByIdSimple(
      resourceActionRequest,
      user.id,
    );
  }

  async validateAccessToken(accessToken?: string | any) {
    try {
      if (typeof accessToken !== 'string' || accessToken?.length === 0) {
        throw new TypeError();
      }

      const userinfo = await this.openIDClient.userinfo(accessToken);

      const user = await this.usuarioService.getUsuarioFromKeycloakId(
        systemResourceActionRequest,
        userinfo.sub,
      );

      return user;
    } catch (err) {
      if (!IS_PRODUCTION_MODE) {
        console.error('auth err:', { err });
      }

      if (err instanceof HttpException) {
        throw err;
      }
    }

    return false;
  }

  async getUserResourceActionRequest(userId: string) {
    const regras = await this.usuarioService.getUsuarioAuthorizationRules(
      systemResourceActionRequest,
      userId,
    );

    return ResourceActionRequest.forUser(userId, regras);
  }
}
