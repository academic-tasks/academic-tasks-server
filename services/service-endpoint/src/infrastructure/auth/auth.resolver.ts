import { Query, Resolver } from '@nestjs/graphql';
import { UsuarioType } from '../../app/modules/usuario/usuario.type';
import { AuthService } from './auth.service';
import { AuthMode } from './consts/AuthMode';
import { BindResourceActionRequest } from './decorators/BindResourceActionRequest.decorator';
import { ResourceAuth } from './decorators/ResourceAuth.decorator';
import { ResourceActionRequest } from './ResourceActionRequest';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // START: queries

  @ResourceAuth(AuthMode.STRICT)
  @Query(() => UsuarioType)
  async getLoggedUser(
    @BindResourceActionRequest() resourceActionRequest: ResourceActionRequest,
  ) {
    return this.authService.getLoggedUser(resourceActionRequest);
  }

  // END: queries

  // START: mutations

  // END: mutations

  // START: fields resolvers

  // END: fields resolvers
}
